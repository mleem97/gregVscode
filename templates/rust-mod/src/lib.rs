// __MOD_ID__ — gregCore Rust mod.
// Bindings: src/greg.rs (copy of gregCore templates/rust, ABI table v1).
// Build: cargo build --release --target x86_64-pc-windows-msvc
// Deploy: <game>/UserLibs/Rust/__MOD_ID__.dll

mod greg;

use std::ffi::c_char;

extern "C" fn on_coins_changed(_event_id: u32, data: u64) {
    greg::log_info(&format!("[__MOD_ID__] coins changed: {data}"));
}

#[no_mangle]
pub extern "C" fn greg_mod_info() -> greg::GregModInfo {
    greg::GregModInfo {
        id: c"__MOD_ID__".as_ptr(),
        name: c"__MOD_NAME__".as_ptr(),
        version: c"1.0.0".as_ptr(),
        author: c"__AUTHOR__".as_ptr(),
        description: c"__DESCRIPTION__".as_ptr(),
        api_version: greg::TABLE_VERSION,
    }
}

#[no_mangle]
pub extern "C" fn greg_mod_init(api: *const greg::GregCoreAPI) -> bool {
    if !greg::init(api) {
        return false;
    }
    greg::subscribe_event(greg::events::PLAYER_COIN_UPDATED, on_coins_changed);
    greg::notify("__MOD_NAME__ loaded.");
    true
}

#[no_mangle]
pub extern "C" fn greg_mod_update(_dt: f32) {}

#[no_mangle]
pub extern "C" fn greg_mod_shutdown() {}
