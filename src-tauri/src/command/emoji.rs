use itertools::Itertools;
use serde::Serialize;

use crate::external::openai::{
    create_chat_completion, ChatCompletionMessageRole, ChatCompletionRequest,
    ChatCompletionRequestMessage,
};

use super::result::CommandResult;

#[derive(Serialize)]
pub struct EmojiItem {
    emoji: String,
    name: String,
}

const SYSTEM_PROMPT: &str = r#"You're an emoji suggester AI.
Suggest relevant emojis for a given sentence.

Guidelines:
　Provide many suitable emojis.
- Rank by relevance.

Output format:
- List emojis, one per line.
- No additional text.
-
Output example:
😀
😄
😆"#;

#[tauri::command]
pub async fn suggest_emojis_for_text(text: String) -> CommandResult<Vec<EmojiItem>> {
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
                .map(|emoji| EmojiItem {
                    emoji: emoji.to_string(),
                    name: String::from("TODO"),
                })
                .collect();
            CommandResult::Success(emojis)
        }
        Err(err) => CommandResult::Error(format!("{:?}", err)),
    }
}
