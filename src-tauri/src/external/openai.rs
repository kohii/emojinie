// see https://platform.openai.com/docs/api-reference/chat/create

use std::collections::HashMap;
use std::env;

use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error(transparent)]
    Io(reqwest::Error),
    #[error(transparent)]
    UnnsuccessfulResponse(reqwest::Error),
}

type Result<T> = std::result::Result<T, ApiError>;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum ChatCompletionMessageRole {
    System,
    User,
    Assistant,
}

#[derive(Serialize, Debug, Clone)]
pub struct ChatCompletionRequestMessage {
    pub role: ChatCompletionMessageRole,
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
pub struct ChatCompletionRequest {
    pub model: String,
    pub messages: Vec<ChatCompletionRequestMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_tokens: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_p: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop: Option<Vec<String>>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChatCompletionResponseChoice {
    pub index: u64,
    pub message: ChatCompletionResponseMessage,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub finish_reason: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChatCompletionResponseMessage {
    pub role: ChatCompletionMessageRole,
    pub content: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChatCompletionResponse {
    pub id: String,
    pub created: u64,
    pub model: String,
    pub choices: Vec<ChatCompletionResponseChoice>,
}

pub async fn create_chat_completion(req: &ChatCompletionRequest) -> Result<ChatCompletionResponse> {
    let payload = serde_json::to_string(&req).unwrap();
    log::debug!("create_chat_completion request: {}", payload);

    let apiKey = env::var("OPENAI_API_KEY").unwrap();

    let client = reqwest::Client::new();
    let res = client
        .post("https://api.openai.com/v1/chat/completions")
        .body(payload)
        .header("Authorization", format!("Bearer {}", apiKey))
        .header("Content-Type", "application/json")
        .send()
        .await;

    log::debug!("create_chat_completion response: {:?}", res);

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let res_body = response.text().await.unwrap();
                log::debug!("create_chat_completion response body: {}", res_body);
                let res_json = serde_json::from_str(&res_body).unwrap();
                return Result::Ok(res_json);
            } else {
                let err = response.error_for_status_ref().unwrap_err();
                if cfg!(debug_assertions) {
                    log::debug!(
                        "create_chat_completion response error: {:?}",
                        response.text().await.unwrap()
                    );
                }
                return Err(ApiError::UnnsuccessfulResponse(err));
            }
        }
        Err(err) => return Result::Err(ApiError::Io(err)),
    };
}
