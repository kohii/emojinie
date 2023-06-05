import fs from "node:fs";

import { emojiToName } from "gemoji";

const SOURCE_URL = "https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json";
const OUTPUT_PATH = "src/generated/emojiData.json";

function getIamcalEmojiData(): Promise<
  {
    name: string;
    unified: string;
    non_qualified: string;
    docomo: string | null;
    au: string | null;
    softbank: string | null;
    google: string | null;
    image: string;
    sheet_x: number;
    sheet_y: number;
    short_name: string;
    short_names: string[];
    text: string | null;
    texts: string[] | null;
    category: string;
    subcategory: string;
    sort_order: number;
    added_in: string;
    has_img_apple: boolean;
    has_img_google: boolean;
    has_img_twitter: boolean;
    has_img_facebook: boolean;
  }[]
> {
  return fetch(SOURCE_URL).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch emoji data from ${SOURCE_URL}.`);
    }
    return res.json();
  });
}

const iamcalEmojiData = await getIamcalEmojiData();

const emojiData = new Map<
  string,
  {
    shortcode: string | undefined;
    githubShortcode: string | undefined;
  }
>();

for (const iamcalEmojiRow of iamcalEmojiData) {
  const unified = iamcalEmojiRow.unified
    .split("-")
    .map((s) => String.fromCodePoint(parseInt(s, 16)))
    .join("");
  const shortcode = iamcalEmojiRow.short_name;
  const githubShortcode = emojiToName[unified];
  if (!githubShortcode) {
    console.warn(`No GitHub shortcode found for emoji: ${unified}.`);
  }

  emojiData.set(unified, { shortcode, githubShortcode });
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(Object.fromEntries(emojiData.entries())));
