import { EmojiMap } from "../types/emojiData";

import {
  appendVariationSelector,
  getSkinToneInfo,
  splitEmojis,
  splitSkinTone,
  splitVariationSelector,
} from "./emojiParser";

export function getShortcodes(
  emojis: string,
  emojiMap: EmojiMap,
): {
  shortcode: string;
  githubShortcode: string;
} {
  const chars = splitEmojis(emojis);
  return {
    shortcode: chars.map((c) => getShortcodeForSingleEmoji(c, emojiMap)).join(""),
    githubShortcode: chars.map((c) => getGithubShortcodeForSingleEmoji(c, emojiMap)).join(""),
  };
}

function getShortcodeForSingleEmoji(emoji: string, emojiMap: EmojiMap): string {
  const [base, skinTone] = splitSkinTone(emoji);

  let baseShortcode = emojiMap[base]?.shortcode;
  if (!baseShortcode) {
    const [baseWithoutVariationSelector, variationSelector] = splitVariationSelector(base);
    if (variationSelector) {
      baseShortcode = emojiMap[baseWithoutVariationSelector]?.shortcode;
    } else {
      baseShortcode = emojiMap[appendVariationSelector(base)]?.shortcode;
    }
  }
  if (!baseShortcode) {
    console.warn(
      `No shortcode found for emoji: ${emoji}. Unicode points: [${[...emoji]
        .map((c) => c.codePointAt(0)?.toString(16))
        .join(" ")}]`,
    );
    return "";
  }
  if (skinTone) {
    const skinToneInfo = getSkinToneInfo(skinTone);
    return `:${baseShortcode}:${skinToneInfo?.shortcode ?? ""}`;
  }
  return `:${baseShortcode}:`;
}

function getGithubShortcodeForSingleEmoji(emoji: string, emojiMap: EmojiMap): string {
  const [base] = splitSkinTone(emoji);

  let baseShortcode = emojiMap[base]?.ghShortcode;
  if (!baseShortcode) {
    const [baseWithoutVariationSelector, variationSelector] = splitVariationSelector(base);
    if (variationSelector) {
      baseShortcode = emojiMap[baseWithoutVariationSelector]?.ghShortcode;
    } else {
      baseShortcode = emojiMap[appendVariationSelector(base)]?.ghShortcode;
    }
  }
  if (!baseShortcode) {
    return getShortcodeForSingleEmoji(emoji, emojiMap);
  }
  return `:${baseShortcode}:`;
}
