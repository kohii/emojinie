use std::process::Command;

#[derive(Debug, thiserror::Error)]
pub enum AppleScriptError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error("{0}")]
    PermisionDenied(String),
}

fn invoke_keystroke(key: &str) -> Result<(), AppleScriptError> {
    let mut cmd = Command::new("osascript");
    cmd.arg("-e").arg(format!(
        r#"tell application "System Events" to keystroke {}"#,
        key
    ));
    let output = cmd.output()?;
    if !output.status.success() {
        let srderr = String::from_utf8_lossy(&output.stderr);
        if srderr.contains("1002") {
            return Err(AppleScriptError::PermisionDenied(srderr.to_string()));
        }

        return Err(AppleScriptError::Io(std::io::Error::new(
            std::io::ErrorKind::Other,
            format!(
                "osascript failed with status code: {}",
                output.status.code().unwrap_or(-1)
            ),
        )));
    }
    Ok(())
}

pub fn invoke_paste_command() -> Result<(), AppleScriptError> {
    invoke_keystroke("\"v\" using {command down}")
}
