// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod external;
mod window_ext;

use std::process;

use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use window_ext::WindowExt;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn show(app: &AppHandle) {
    let window = app.get_window("main").unwrap();
    let menu_item = app.tray_handle().get_item("toggle");
    if window.is_visible().unwrap() {
        window.hide();
        menu_item.set_title("Show");
    } else {
        window.show();
        window.center();
        menu_item.set_title("Hide");
    }
}

fn make_tray() -> SystemTray {
    // <- a function that creates the system tray
    let menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("toggle".to_string(), "Hide"))
        .add_item(CustomMenuItem::new("quit".to_string(), "Quit"));
    return SystemTray::new().with_menu(menu);
}

fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        if id.as_str() == "quit" {
            process::exit(0);
        }
        if id.as_str() == "toggle" {
            let window = app.get_window("main").unwrap();
            let menu_item = app.tray_handle().get_item("toggle");
            if window.is_visible().unwrap() {
                window.hide();
                menu_item.set_title("Show");
            } else {
                window.show();
                window.center();
                menu_item.set_title("Hide");
            }
        }
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([tauri_plugin_log::LogTarget::Stdout])
                .build(),
        )
        .system_tray(make_tray())
        .on_system_tray_event(handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            greet,
            command::emoji::suggest_emojis_for_text
        ])
        .setup(move |app| {
            let window = app.get_window("main").unwrap();
            window.set_transparent_titlebar(true, true);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // #[cfg(target_os = "macos")]
    // {
    //     app.set_activation_policy(ActivationPolicy::Accessory);
    // }
}
