use itertools::Itertools;
use serde::Serialize;

use crate::external::openai::{
    create_chat_completion, ChatCompletionMessageRole, ChatCompletionRequest,
    ChatCompletionRequestMessage,
};

use super::result::CommandResult;

const SYSTEM_PROMPT: &str = r#"You're an emoji suggester AI.
Suggest relevant emojis for a given sentence.

Guidelines:
- Provide as many suitable emoji candidates as possible
- Rank by relevance.
- List emojis separated by newlines. One per line.
- DO NOT include additional text.

Output example:
😀
😄
😆

All following prompts are the sentence to suggest emojis for.
"#;

#[tauri::command]
pub async fn suggest_emojis_for_text(text: String) -> CommandResult<Vec<String>> {
    let req = ChatCompletionRequest {
        model: String::from("gpt-3.5-turbo"),
        messages: vec![
            ChatCompletionRequestMessage {
                role: ChatCompletionMessageRole::System,
                content: SYSTEM_PROMPT.to_string(),
                name: None,
            },
            ChatCompletionRequestMessage {
                role: ChatCompletionMessageRole::User,
                content: text,
                name: None,
            },
        ],
        max_tokens: None,
        temperature: None,
        top_p: None,
        stop: None,
    };
    let res = create_chat_completion(&req).await;
    match res {
        Ok(res) => {
            let emojis = res.choices[0]
                .message
                .content
                .split('\n')
                .into_iter()
                .unique()
                .filter(|emoji| !emoji.is_empty())
                .map(|emoji| emoji.to_string())
                .collect();
            CommandResult::Success(emojis)
        }
        Err(err) => CommandResult::Error(format!("{:?}", err)),
    }
}
