#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::dialog::blocking::FileDialogBuilder;
use tauri::Manager;

#[tauri::command]
fn open_file_dialog(options: tauri::api::dialog::blocking::FileDialogBuilder) -> Option<String> {
    let result = options.pick_folder();
    match result {
        Some(path) => Some(path.to_string_lossy().into_owned()),
        None => None,
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![open_file_dialog]) // open_file_dialog needs to be here
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}