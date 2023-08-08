import emojiComponents from "unicode-emoji-json/data-emoji-components.json" assert { type: "json" };

const EMOJI_VARIATION_SELECTOR = "\u{FE0F}";

export function splitVariationSelector(emoji: string): [string, string?] {
  if (emoji.endsWith(EMOJI_VARIATION_SELECTOR)) {
    return [emoji.slice(0, -1), EMOJI_VARIATION_SELECTOR];
  }
  return [emoji];
}

export function appendVariationSelector(emoji: string): string {
  if (emoji.endsWith(EMOJI_VARIATION_SELECTOR)) {
    return emoji;
  }
  return emoji + EMOJI_VARIATION_SELECTOR;
}

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

export function getSkinToneInfo(skinTone: string): { name: string; shortcode: string } | undefined {
  return skinToneByEmojis[skinTone];
}

export function splitSkinTone(emoji: string): [string, string?] {
  const skinTone = emoji.match(new RegExp(skinTonePattern));
  if (skinTone) {
    return [emoji.replace(skinTone[0], ""), skinTone[0]];
  }
  return [emoji];
}

export const splitEmojis = (s: string) => [...new Intl.Segmenter().segment(s)].map((x) => x.segment);
