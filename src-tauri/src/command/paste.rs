use enigo::{Enigo, KeyboardControllable};
use std::{thread, time::Duration};
use tauri::{AppHandle, ClipboardManager, Manager};

use super::result::CommandResult;

#[tauri::command]
pub async fn paste(app: AppHandle, text: String) -> CommandResult<()> {
    log::debug!("paste: {}", &text);

    let window = app.get_window("main").unwrap();
    window.hide().ok();

    let prev_content = app.clipboard_manager().read_text().unwrap().unwrap();
    Some(app.clipboard_manager().write_text(&text).ok());
    thread::sleep(Duration::from_millis(50));

    // let mut enigo = Enigo::new();
    //
    // match enigo.key_sequence_parse_try("{+META}v{-META}") {
    //     Ok(_) => {}
    //     Err(e) => {
    //         log::error!("enigo.key_sequence_parse error: {}", e);
    //         return CommandResult::Error(String::from("Failed to paste"));
    //     }
    // }

    thread::sleep(Duration::from_millis(50));
    if !prev_content.is_empty() {
        Some(app.clipboard_manager().write_text(&prev_content).ok());
    }

    CommandResult::Success(())
}
