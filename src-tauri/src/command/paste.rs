use enigo::{Enigo, KeyboardControllable};
use std::{thread, time::Duration};
use tauri::{AppHandle, ClipboardManager, Manager};

use crate::external::apple_script::invoke_paste_command;

use super::result::CommandResult;

#[tauri::command]
pub async fn paste(app: AppHandle, text: String) -> CommandResult<()> {
    log::debug!("paste: {}", &text);

    let window = app.get_window("main").unwrap();
    window.hide().ok();

    let prev_content = app.clipboard_manager().read_text().unwrap();

    thread::sleep(Duration::from_millis(10));

    match app.clipboard_manager().write_text(&text) {
        Ok(_) => {}
        Err(e) => {
            log::error!("app.clipboard_manager().write_text error: {}", e);
            return CommandResult::Error(String::from("Failed to paste"));
        }
    }
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

    match invoke_paste_command() {
        Ok(_) => {}
        Err(e) => {
            // TODO: suggest to enable accessibility
            log::error!("invoke_paste_command error: {}", e);
            return CommandResult::Error(String::from("Failed to paste"));
        }
    }

    thread::sleep(Duration::from_millis(50));
    match prev_content {
        Some(content) => {
            Some(app.clipboard_manager().write_text(&content).ok());
        }
        None => (),
    }

    log::debug!("paste: done");

    CommandResult::Success(())
}
