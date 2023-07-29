import fs from "node:fs";

import { emojiToName } from "gemoji";

const SOURCE_URL = "https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji_pretty.json";
const OUTPUT_PATH = "src/generated/emojiData.json";

// Note: sync data with src/types/emojiCategory.ts
const categoryNameToIdMap = new Map([
  ["Smileys & Emotion", 1],
  ["People & Body", 2],
  ["Animals & Nature", 3],
  ["Food & Drink", 4],
  ["Travel & Places", 5],
  ["Activities", 6],
  ["Objects", 7],
  ["Symbols", 8],
  ["Flags", 9],
]);

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
iamcalEmojiData.sort((a, b) => a.sort_order - b.sort_order);

const emojiDataList: object[] = [];

for (const iamcalEmojiRow of iamcalEmojiData) {
  const unified = iamcalEmojiRow.unified
    .split("-")
    .map((s) => String.fromCodePoint(parseInt(s, 16)))
    .join("");
  if (iamcalEmojiRow.category === "Component") {
    continue;
  }

  const shortcode = iamcalEmojiRow.short_name;
  const ghShortcode = emojiToName[unified];
  if (!ghShortcode) {
    console.warn(`No GitHub shortcode found for emoji: ${unified}.`);
  }

  const category = categoryNameToIdMap.get(iamcalEmojiRow.category);
  if (!category) {
    throw new Error(`No category id found for emoji: ${unified}, ${iamcalEmojiRow.category}.`);
  }

  const tags = [...new Set([
    ...iamcalEmojiRow.short_names,
    iamcalEmojiRow.name.toLowerCase(),
  ])];

  // Note: sync type with src/types/emojiData.ts
  emojiDataList.push({
    unified,
    category,
    name: iamcalEmojiRow.name,
    shortcode,
    ghShortcode,
    tags,
  });
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(emojiDataList));
