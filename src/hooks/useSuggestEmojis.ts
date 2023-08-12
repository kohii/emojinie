import { useQuery } from "@tanstack/react-query";

import { suggestEmojis } from "../apis/emojiApi";
import { getShortcodes } from "../libs/emojiShortcodes";
import { EmojiMap } from "../types/emojiData";
import { assertUnreachable } from "../utils/assertUnreachable";

export function useSuggestEmojis(
  text: string,
  emojiMap: EmojiMap | undefined,
  openaiApiKey: string,
) {
  return useQuery({
    queryKey: ["suggest_emojis_for_text", text, openaiApiKey],
    queryFn: async () => {
      const result = await suggestEmojis(text, openaiApiKey);
      switch (result.type) {
        case "success":
          return result.emojis.map((emoji) => ({
            emoji,
            ...(emojiMap
              ? getShortcodes(emoji, emojiMap)
              : {
                  shortcode: "",
                  githubShortcode: "",
                }),
          }));
        case "unsuccesful_response":
          throw new Error(result.message);
        case "unknown_error":
          throw result.error;
        default:
          assertUnreachable(result);
      }
    },
    enabled: Boolean(text && openaiApiKey),
    staleTime: Infinity,
  });
}
