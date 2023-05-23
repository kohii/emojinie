use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn show_settings_window(app: AppHandle) {
    open_settings_window(&app);
}

pub fn open_settings_window(app: &AppHandle) {
    let setting_window = app.get_window("settings");
    match setting_window {
        Some(window) => {
            window.show().ok();
            window.set_focus().ok();
        }
        None => {
            let setting_window = tauri::WindowBuilder::new(
                app,
                "settings",
                tauri::WindowUrl::App("settings.html".into()),
            )
            .title("Recommoji Settings")
            .resizable(false)
            .inner_size(480.0, 400.0)
            .build()
            .ok();
            match setting_window {
                Some(window) => {
                    window.show().ok();
                }
                None => (),
            }
        }
    }
}
