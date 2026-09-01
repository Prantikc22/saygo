#!/bin/sh
set -eu

if [ "$(uname -s)" != "Darwin" ]; then
  exit 0
fi

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
app_path="$project_dir/src-tauri/target/release/bundle/macos/Saygo.app"
app_version=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' "$app_path/Contents/Info.plist")
dmg_path="$project_dir/src-tauri/target/release/bundle/dmg/Saygo_${app_version}_aarch64.dmg"
zip_path="$project_dir/src-tauri/target/release/bundle/macos/Saygo_${app_version}_aarch64.zip"
entitlements_path="$project_dir/src-tauri/Entitlements.plist"
requirement='=designated => identifier "app.saygo.desktop"'

codesign --force --deep --sign - \
  --entitlements "$entitlements_path" \
  --requirements "$requirement" \
  "$app_path"
hdiutil create -volname Saygo -srcfolder "$app_path" -ov -format UDZO "$dmg_path"
codesign --force --sign - "$dmg_path"
rm -f "$zip_path"
ditto -c -k --sequesterRsrc --keepParent "$app_path" "$zip_path"
