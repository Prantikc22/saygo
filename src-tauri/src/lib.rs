use enigo::{Direction::{Click, Press, Release}, Enigo, Key, Keyboard, Settings};
use std::{process::Command, thread, time::Duration};
use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  Manager,
};
#[cfg(any(windows, target_os = "linux"))]
use tauri_plugin_deep_link::DeepLinkExt;

#[tauri::command]
fn open_auth_url(url: String) -> Result<(), String> {
  if !url.starts_with("https://saygo-ai-dictation.vercel.app/auth?") {
    return Err("Blocked non-Saygo authentication URL".into());
  }

  #[cfg(target_os = "macos")]
  let mut command = {
    let mut command = Command::new("open");
    command.arg(&url);
    command
  };
  #[cfg(windows)]
  let mut command = {
    let mut command = Command::new("cmd");
    command.args(["/C", "start", "", &url]);
    command
  };
  #[cfg(target_os = "linux")]
  let mut command = {
    let mut command = Command::new("xdg-open");
    command.arg(&url);
    command
  };

  command.spawn().map(|_| ()).map_err(|error| error.to_string())
}

#[tauri::command]
fn paste_text(app: tauri::AppHandle, text: String) -> Result<(), String> {
  let mut clipboard = arboard::Clipboard::new().map_err(|error| error.to_string())?;
  clipboard.set_text(text).map_err(|error| error.to_string())?;

  if let Some(window) = app.get_webview_window("main") {
    window.hide().map_err(|error| error.to_string())?;
  }
  thread::sleep(Duration::from_millis(180));

  let mut enigo = Enigo::new(&Settings::default()).map_err(|error| error.to_string())?;
  #[cfg(target_os = "macos")]
  let modifier = Key::Meta;
  #[cfg(not(target_os = "macos"))]
  let modifier = Key::Control;
  enigo.key(modifier, Press).map_err(|error| error.to_string())?;
  enigo.key(Key::Unicode('v'), Click).map_err(|error| error.to_string())?;
  enigo.key(modifier, Release).map_err(|error| error.to_string())?;
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let builder = tauri::Builder::default();
  #[cfg(desktop)]
  let builder = builder.plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
    if let Some(window) = app.get_webview_window("main") {
      let _ = window.show();
      let _ = window.set_focus();
    }
  }));

  builder
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .invoke_handler(tauri::generate_handler![paste_text, open_auth_url])
    .setup(|app| {
      #[cfg(any(windows, target_os = "linux"))]
      app.deep_link().register_all()?;
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      let show = MenuItem::with_id(app, "show", "Show Saygo", true, None::<&str>)?;
      let quit = MenuItem::with_id(app, "quit", "Quit Saygo", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show, &quit])?;
      let mut tray = TrayIconBuilder::new()
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "show" => {
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
          "quit" => app.exit(0),
          _ => {}
        })
        .on_tray_icon_event(|tray, event| {
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
            }
          }
        });
      if let Some(icon) = app.default_window_icon() {
        tray = tray.icon(icon.clone());
      }
      tray.build(app)?;
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
