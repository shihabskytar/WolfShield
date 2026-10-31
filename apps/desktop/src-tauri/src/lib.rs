use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("command not implemented in M0")]
    NotImplemented,
}

#[derive(Serialize)]
pub struct PingResponse {
    pub ok: bool,
    pub version: &'static str,
}

// STUB: M0 allow-listed command stub only.
// Real commands (clipboard, watcher, hashing, Zone.Identifier) are M1/M3
// and must be added here one at a time with input validation.
#[tauri::command]
fn ping() -> PingResponse {
    PingResponse { ok: true, version: env!("CARGO_PKG_VERSION") }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
