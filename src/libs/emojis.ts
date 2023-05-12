import { emojiToName } from "gemoji";
import emojiComponents from "unicode-emoji-json/data-emoji-components.json" assert { type: "json" };

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

const skinTonePattern = Object.keys(skinToneByEmojis).join("|") + "$";

function splitSkinTone(emoji: string): [string, string?] {
  const skinTone = emoji.match(new RegExp(skinTonePattern));
  if (skinTone) {
    return [emoji.slice(0, -skinTone[0].length), skinTone[0]];
  }
  return [emoji];
}

const splitEmoji = (s: string) => [...new Intl.Segmenter().segment(s)].map(x => x.segment);

export function getShortcode(emojis: string): string {
  const chars = splitEmoji(emojis);
  return chars.map(getShortcodeForEmoji).join("");
}

function getShortcodeForEmoji(emoji: string): string {
  const [base, skinTone] = splitSkinTone(emoji);

  let baseShortcode = emojiToName[base];
  if (!baseShortcode) {
    if (base.endsWith(EMOJI_VARIATION_SELECTOR)) {
      baseShortcode = emojiToName[base.slice(0, -1)];
    } else {
      baseShortcode = emojiToName[base + EMOJI_VARIATION_SELECTOR];
    }
  }
  if (!baseShortcode) {
    console.warn(`No shortcode found for emoji: ${emoji}. Unicode points: [${[...emoji].map((c) => c.codePointAt(0)?.toString(16)).join(" ")}]`);
    return "";
  }
  if (skinTone) {
    const skinToneInfo = skinToneByEmojis[skinTone];
    return `:${baseShortcode}:${skinToneInfo?.shortcode ?? ""}`;
  }
  return `:${baseShortcode}:`;
}

