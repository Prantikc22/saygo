fn main() {
    // Cross-compiling a portable Windows preview from macOS cannot run Microsoft's
    // resource compiler. The native Windows release workflow still embeds the icon,
    // version metadata, and manifest through Tauri's normal build step.
    if std::env::var_os("SAYGO_CROSS_BUILD").is_some() {
        println!("cargo:rustc-check-cfg=cfg(desktop)");
        println!("cargo:rustc-cfg=desktop");
        println!("cargo:rustc-check-cfg=cfg(mobile)");
        if let Ok(target) = std::env::var("TARGET") {
            println!("cargo:rustc-env=TAURI_ENV_TARGET_TRIPLE={target}");
        }
        let out_dir = std::path::PathBuf::from(std::env::var("OUT_DIR").expect("OUT_DIR is set"));
        std::fs::write(
      out_dir.join("capabilities.json"),
      r#"{"default":{"identifier":"default","description":"enables the default permissions","remote":{"urls":["https://saygo-ai-dictation.vercel.app/*"]},"local":true,"windows":["main"],"permissions":["core:default","core:event:default","core:window:allow-hide","core:window:allow-show","core:window:allow-set-focus","core:window:allow-set-position","core:window:allow-set-size","core:window:allow-start-dragging","deep-link:default","opener:default","global-shortcut:allow-register","global-shortcut:allow-unregister","global-shortcut:allow-unregister-all","global-shortcut:allow-is-registered"]}}"#,
    ).expect("cross-build capabilities are written");
        let target_root = out_dir.ancestors().nth(5).expect("target directory");
        let native_builds = target_root.join("release/build");
        let native_out = std::fs::read_dir(native_builds)
            .expect("build the native macOS target before the Windows preview")
            .filter_map(Result::ok)
            .map(|entry| entry.path().join("out"))
            .find(|path| {
                let acl_path = path.join("acl-manifests.json");
                let acl = std::fs::read_to_string(&acl_path).unwrap_or_default();
                acl_path.is_file()
                    && path.join("__global-api-script.js").is_file()
                    && acl.contains("deep-link")
                    && acl.contains("opener")
            })
            .expect("native Tauri ACL output");
        for file in ["acl-manifests.json", "__global-api-script.js"] {
            std::fs::copy(native_out.join(file), out_dir.join(file))
                .expect("native Tauri build metadata is copied");
        }
        std::fs::create_dir_all(out_dir.join("app-manifest")).expect("app manifest directory");
        std::fs::write(out_dir.join("app-manifest/__app__-permission-files"), "[]")
            .expect("app manifest");
        return;
    }
    tauri_build::build()
}
