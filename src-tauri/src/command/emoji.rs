use itertools::Itertools;

use crate::external::openai::{
    create_chat_completion, ChatCompletionMessageRole, ChatCompletionRequest,
    ChatCompletionRequestMessage,
};

use super::result::CommandResult;

fn crate_prompt(text: &str) -> String {
    format!(
        r#"Suggest relevant emojis for a given sentence.

Guidelines:
- Provide as many suitable emoji candidates as possible
- List emojis separated by newlines. **One** per line.
- Rank by relevance.
- DO NOT include additional text.
- If you can't think of any emojis, just write "None".

Output example1:
😀
😄
😆

Output example2:
None

The sentence to suggest emojis for:
```
{}
```"#,
        text.replace("```", "'''")
    )
}

#[tauri::command]
pub async fn suggest_emojis_for_text(text: String) -> CommandResult<Vec<String>> {
    let req: ChatCompletionRequest = ChatCompletionRequest {
        model: String::from("gpt-3.5-turbo"),
        messages: vec![ChatCompletionRequestMessage {
            role: ChatCompletionMessageRole::System,
            content: crate_prompt(&text).to_string(),
            name: None,
        }],
        max_tokens: None,
        temperature: None,
        top_p: None,
        stop: None,
    };
    let res = create_chat_completion(&req).await;
    match res {
        Ok(res) => {
            let response_text = &res.choices[0].message.content;
            if response_text.starts_with("None") || response_text.starts_with("Error") {
                return CommandResult::Success(vec![]);
            }
            let emojis = response_text
                .split('\n')
                .into_iter()
                .map(|emoji| emoji.trim())
                .unique()
                .filter(|emoji| !emoji.is_empty())
                .map(|emoji| emoji.to_string())
                .collect();
            CommandResult::Success(emojis)
        }
        Err(err) => CommandResult::Error(format!("{:?}", err)),
    }
}
