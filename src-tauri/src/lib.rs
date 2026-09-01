use cpal::{
    traits::{DeviceTrait, HostTrait, StreamTrait},
    FromSample, Sample, SampleFormat, SizedSample, Stream, StreamConfig,
};
use enigo::{
    Direction::{Click, Press, Release},
    Enigo, Key, Keyboard, Settings,
};
use std::{
    process::Command,
    sync::{Arc, Mutex},
    thread,
    time::{Duration, Instant},
};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};
#[cfg(any(target_os = "macos", windows, target_os = "linux"))]
use tauri_plugin_deep_link::DeepLinkExt;

#[derive(Default)]
struct NativeRecorder(Mutex<Option<NativeRecording>>);

struct NativeRecording {
    stream: Stream,
    samples: Arc<Mutex<Vec<i16>>>,
    sample_rate: u32,
    channels: u16,
    started_at: Instant,
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct NativeAudio {
    bytes: Vec<u8>,
    duration_ms: u64,
}

#[derive(serde::Serialize)]
struct TextDelivery {
    pasted: bool,
}

fn build_input_stream<T>(
    device: &cpal::Device,
    config: StreamConfig,
    samples: Arc<Mutex<Vec<i16>>>,
) -> Result<Stream, String>
where
    T: Sample + SizedSample + Send + 'static,
    i16: FromSample<T>,
{
    device
        .build_input_stream(
            config,
            move |input: &[T], _| {
                if let Ok(mut output) = samples.try_lock() {
                    output.extend(input.iter().copied().map(i16::from_sample));
                }
            },
            move |error| eprintln!("Saygo microphone stream error: {error}"),
            None,
        )
        .map_err(|error| error.to_string())
}

fn wav_bytes(samples: &[i16], sample_rate: u32, channels: u16) -> Vec<u8> {
    let data_size = (samples.len() * std::mem::size_of::<i16>()) as u32;
    let block_align = channels * 2;
    let byte_rate = sample_rate * block_align as u32;
    let mut wav = Vec::with_capacity(44 + data_size as usize);
    wav.extend_from_slice(b"RIFF");
    wav.extend_from_slice(&(36 + data_size).to_le_bytes());
    wav.extend_from_slice(b"WAVEfmt ");
    wav.extend_from_slice(&16u32.to_le_bytes());
    wav.extend_from_slice(&1u16.to_le_bytes());
    wav.extend_from_slice(&channels.to_le_bytes());
    wav.extend_from_slice(&sample_rate.to_le_bytes());
    wav.extend_from_slice(&byte_rate.to_le_bytes());
    wav.extend_from_slice(&block_align.to_le_bytes());
    wav.extend_from_slice(&16u16.to_le_bytes());
    wav.extend_from_slice(b"data");
    wav.extend_from_slice(&data_size.to_le_bytes());
    for sample in samples {
        wav.extend_from_slice(&sample.to_le_bytes());
    }
    wav
}

#[tauri::command]
fn start_native_recording(recorder: tauri::State<'_, NativeRecorder>) -> Result<(), String> {
    let mut active = recorder
        .0
        .lock()
        .map_err(|_| "Recorder state is unavailable")?;
    if active.is_some() {
        return Ok(());
    }

    let host = cpal::default_host();
    let device = host
        .default_input_device()
        .ok_or("No microphone was found")?;
    let supported = device
        .default_input_config()
        .map_err(|error| error.to_string())?;
    let sample_rate = supported.sample_rate();
    let channels = supported.channels();
    let format = supported.sample_format();
    let config = supported.into();
    let samples = Arc::new(Mutex::new(Vec::new()));
    let stream = match format {
        SampleFormat::I8 => build_input_stream::<i8>(&device, config, samples.clone())?,
        SampleFormat::I16 => build_input_stream::<i16>(&device, config, samples.clone())?,
        SampleFormat::I32 => build_input_stream::<i32>(&device, config, samples.clone())?,
        SampleFormat::F32 => build_input_stream::<f32>(&device, config, samples.clone())?,
        unsupported => {
            return Err(format!(
                "Unsupported microphone sample format: {unsupported}"
            ))
        }
    };
    stream.play().map_err(|error| error.to_string())?;
    *active = Some(NativeRecording {
        stream,
        samples,
        sample_rate,
        channels,
        started_at: Instant::now(),
    });
    Ok(())
}

#[tauri::command]
fn stop_native_recording(
    recorder: tauri::State<'_, NativeRecorder>,
) -> Result<NativeAudio, String> {
    let recording = recorder
        .0
        .lock()
        .map_err(|_| "Recorder state is unavailable")?
        .take()
        .ok_or("No recording is active")?;
    let duration_ms = recording.started_at.elapsed().as_millis() as u64;
    drop(recording.stream);
    let samples = recording
        .samples
        .lock()
        .map_err(|_| "Recorded audio is unavailable")?;
    Ok(NativeAudio {
        bytes: wav_bytes(&samples, recording.sample_rate, recording.channels),
        duration_ms,
    })
}

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

    command
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn open_microphone_settings() -> Result<(), String> {
    #[cfg(target_os = "macos")]
    let mut command = {
        let mut command = Command::new("open");
        command.arg("x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension?Privacy_Microphone");
        command
    };
    #[cfg(windows)]
    let mut command = {
        let mut command = Command::new("cmd");
        command.args(["/C", "start", "", "ms-settings:privacy-microphone"]);
        command
    };
    #[cfg(target_os = "linux")]
    return Err("Open your system privacy settings and allow microphone access for Saygo.".into());

    #[cfg(any(target_os = "macos", windows))]
    command
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn open_accessibility_settings() -> Result<(), String> {
    #[cfg(target_os = "macos")]
    let mut command = {
        let mut command = Command::new("open");
        command.arg(
            "x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension?Privacy_Accessibility",
        );
        command
    };
    #[cfg(windows)]
    return Ok(());
    #[cfg(target_os = "linux")]
    return Ok(());

    #[cfg(target_os = "macos")]
    command
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

#[tauri::command]
fn accessibility_status() -> bool {
    #[cfg(target_os = "macos")]
    {
        let mut settings = Settings::default();
        settings.open_prompt_to_get_permissions = false;
        Enigo::new(&settings).is_ok()
    }
    #[cfg(not(target_os = "macos"))]
    {
        true
    }
}

fn deliver_to_active_app(app: &tauri::AppHandle, text: String) -> Result<TextDelivery, String> {
    let mut clipboard = arboard::Clipboard::new().map_err(|error| error.to_string())?;
    clipboard
        .set_text(text)
        .map_err(|error| error.to_string())?;

    let mut settings = Settings::default();
    settings.open_prompt_to_get_permissions = false;
    let Ok(mut enigo) = Enigo::new(&settings) else {
        return Ok(TextDelivery { pasted: false });
    };

    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|error| error.to_string())?;
    }
    thread::sleep(Duration::from_millis(180));

    #[cfg(target_os = "macos")]
    let modifier = Key::Meta;
    #[cfg(not(target_os = "macos"))]
    let modifier = Key::Control;
    let paste_result = enigo
        .key(modifier, Press)
        .and_then(|_| enigo.key(Key::Unicode('v'), Click))
        .and_then(|_| enigo.key(modifier, Release));
    if paste_result.is_err() {
        let _ = enigo.key(modifier, Release);
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.show();
            let _ = window.set_focus();
        }
        return Ok(TextDelivery { pasted: false });
    }
    Ok(TextDelivery { pasted: true })
}

#[tauri::command]
fn paste_text(app: tauri::AppHandle, text: String) -> Result<TextDelivery, String> {
    deliver_to_active_app(&app, text)
}

#[tauri::command]
fn deliver_text(app: tauri::AppHandle, text: String) -> Result<TextDelivery, String> {
    deliver_to_active_app(&app, text)
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
        .invoke_handler(tauri::generate_handler![
            paste_text,
            deliver_text,
            open_auth_url,
            open_microphone_settings,
            open_accessibility_settings,
            accessibility_status,
            start_native_recording,
            stop_native_recording
        ])
        .manage(NativeRecorder::default())
        .setup(|app| {
            #[cfg(any(windows, target_os = "linux"))]
            app.deep_link().register_all()?;
            #[cfg(any(target_os = "macos", windows, target_os = "linux"))]
            {
                let app_handle = app.handle().clone();
                app.deep_link().on_open_url(move |event| {
                    let is_auth_callback = event.urls().iter().any(|url| {
                        url.scheme() == "saygo" && url.host_str() == Some("auth-callback")
                    });
                    if is_auth_callback {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                });
            }
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
