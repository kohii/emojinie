use serde::Serialize;

#[derive(Serialize)]
pub enum CommandResult<T: Serialize> {
    Success(T),
    Error(String),
}
