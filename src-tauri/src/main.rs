// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod external;
mod settings;
mod spotlight;
mod window_ext;

use std::process;
use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use window_ext::WindowExt;

fn make_tray() -> SystemTray {
    // <- a function that creates the system tray
    let menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("toggle".to_string(), "Show"))
        .add_item(CustomMenuItem::new("settings", "Settings"))
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
                window.hide().ok();
                menu_item.set_title("Show").ok();
            } else {
                window.show().ok();
                menu_item.set_title("Hide").ok();
            }
        }
        if id.as_str() == "settings" {
            settings::open_settings_window(app);
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
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(make_tray())
        .on_system_tray_event(handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            command::emoji::suggest_emojis_for_text,
            command::paste::paste,
            spotlight::init_spotlight_window,
            spotlight::show_spotlight_window,
            spotlight::hide_spotlight_window,
            spotlight::toggle_spotlight_window,
            settings::show_settings_window,
        ])
        .manage(spotlight::State::default())
        .setup(move |app| {
            // Set activation poicy to Accessory to prevent the app icon from showing on the dock
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let window = app.get_window("main").unwrap();
            window.set_transparent_titlebar(true, true);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
