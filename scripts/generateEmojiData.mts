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

function tokenize(text: string): string[] {
  return text.split(/[-:&()\s|　]/g).filter((s) => s.length > 0);
}

function generateTags(words: string[]): string[] {
  let tags = words.flatMap((word) => {
    const lowerCaseWord = word.toLowerCase();
    const normalizedWord = lowerCaseWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return [lowerCaseWord, normalizedWord, ...tokenize(lowerCaseWord), ...tokenize(normalizedWord)];
  });
  // - remove duplicates
  tags = [...new Set(tags)];

  // - remove tags that are too short
  tags = tags.filter((tag) => tag.length > 1);

  if (tags.includes("flag-rw")) {
    console.log(tags);
  }

  // - remove tags that start with other tags
  tags.sort((a, b) => b.length - a.length); // sort by length desc
  const result: string[] = [];
  tags.forEach((tag) => {
    if (!result.length) {
      result.push(tag);
      return;
    }
    if (!result.some((t) => t.startsWith(tag))) {
      result.push(tag);
    }
  });
  return result;
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

  const tags: string[] = generateTags([iamcalEmojiRow.name, ...iamcalEmojiRow.short_names])

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
