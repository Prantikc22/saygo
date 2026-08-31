fn main() {
  // Cross-compiling a portable Windows preview from macOS cannot run Microsoft's
  // resource compiler. The native Windows release workflow still embeds the icon,
  // version metadata, and manifest through Tauri's normal build step.
  if std::env::var_os("OPENWHISPR_CROSS_BUILD").is_some() {
    println!("cargo:rustc-check-cfg=cfg(desktop)");
    println!("cargo:rustc-cfg=desktop");
    println!("cargo:rustc-check-cfg=cfg(mobile)");
    if let Ok(target) = std::env::var("TARGET") {
      println!("cargo:rustc-env=TAURI_ENV_TARGET_TRIPLE={target}");
    }
    return;
  }
  tauri_build::build()
}
