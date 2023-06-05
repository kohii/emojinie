import { Configuration, OpenAIApi } from "openai";

type Success = {
  type: "success";
  emojis: string[];
};
type UnsuccesfulResponse = {
  type: "unsuccesful_response";
  message: string;
};
type UnknownError = {
  type: "unknown_error";
  error: Error;
};

export type Result = Success | UnsuccesfulResponse | UnknownError;

export async function suggestEmojis(text: string, openaiApiKey: string): Promise<Result> {
  const prompt = createPrompt(text);

  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    });
    console.log(1, response);

    const content = response.data.choices[0]?.message?.content;

    if (!content) {
      console.warn("No error code found.", response);
      return {
        type: "unknown_error",
        error: new Error("No content found in response."),
      };
    }
    if (content.startsWith("None") || content.startsWith("Error")) {
      return {
        type: "success",
        emojis: [],
      };
    }
    const emojis = content
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s && s !== "None");
    return {
      type: "success",
      emojis: [...new Set(emojis)],
    };
  } catch (error) {
    const errorCode = getErrorCode(error);
    if (!errorCode) {
      console.warn("No error code found.", error);
      return {
        type: "unknown_error",
        error: new Error("No error code found.", {
          cause: error,
        }),
      };
    }

    return {
      type: "unsuccesful_response",
      message: errorCode,
    };
  }
}

function createPrompt(text: string) {
  return `Suggest relevant emojis for a given sentence.

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
\`\`\`
${text.replaceAll("```", "'''")}
\`\`\`
`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorCode(error: any): string | undefined {
  return error?.response?.data?.error?.code;
}
