import emojiComponents from "unicode-emoji-json/data-emoji-components.json" assert { type: "json" };

import _emojiData from "../generated/emojiData.json" assert { type: "json" };
import { EmojiData } from "../types/emojiData";

const emojiData = _emojiData as unknown as EmojiData;

const EMOJI_VARIATION_SELECTOR = "\u{FE0F}";

const skinToneByEmojis = {
  [emojiComponents.light_skin_tone]: {
    name: "light skin tone",
    shortcode: ":skin-tone-2:",
  },
  [emojiComponents.medium_light_skin_tone]: {
    name: "medium-light skin tone",
    shortcode: ":skin-tone-3:",
  },
  [emojiComponents.medium_skin_tone]: {
    name: "medium skin tone",
    shortcode: ":skin-tone-4:",
  },
  [emojiComponents.medium_dark_skin_tone]: {
    name: "medium-dark skin tone",
    shortcode: ":skin-tone-5:",
  },
  [emojiComponents.dark_skin_tone]: {
    name: "dark skin tone",
    shortcode: ":skin-tone-6:",
  },
};

const skinTonePattern = Object.keys(skinToneByEmojis).join("|");

function splitSkinTone(emoji: string): [string, string?] {
  const skinTone = emoji.match(new RegExp(skinTonePattern));
  if (skinTone) {
    return [emoji.replace(skinTone[0], ""), skinTone[0]];
  }
  return [emoji];
}

const splitEmojis = (s: string) => [...new Intl.Segmenter().segment(s)].map((x) => x.segment);

export function getShortcodes(emojis: string): {
  shortcode: string;
  githubShortcode: string;
} {
  const chars = splitEmojis(emojis);
  return {
    shortcode: chars.map(getShortcodeForSingleEmoji).join(" "),
    githubShortcode: chars.map(getGithubShortcodeForSingleEmoji).join(""),
  };
}

function getShortcodeForSingleEmoji(emoji: string): string {
  const [base, skinTone] = splitSkinTone(emoji);

  let baseShortcode = emojiData[base]?.shortcode;
  if (!baseShortcode) {
    if (base.endsWith(EMOJI_VARIATION_SELECTOR)) {
      baseShortcode = emojiData[base.slice(0, -1)]?.shortcode;
    } else {
      baseShortcode = emojiData[base + EMOJI_VARIATION_SELECTOR]?.shortcode;
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
    const skinToneInfo = skinToneByEmojis[skinTone];
    return `:${baseShortcode}:${skinToneInfo?.shortcode ?? ""}`;
  }
  return `:${baseShortcode}:`;
}

function getGithubShortcodeForSingleEmoji(emoji: string): string {
  const [base] = splitSkinTone(emoji);

  let baseShortcode = emojiData[base]?.githubShortcode;
  if (!baseShortcode) {
    if (base.endsWith(EMOJI_VARIATION_SELECTOR)) {
      baseShortcode = emojiData[base.slice(0, -1)]?.githubShortcode;
    } else {
      baseShortcode = emojiData[base + EMOJI_VARIATION_SELECTOR]?.githubShortcode;
    }
  }
  if (!baseShortcode) {
    return getShortcodeForSingleEmoji(emoji);
  }
  return `:${baseShortcode}:`;
}
