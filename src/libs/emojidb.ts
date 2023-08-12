import { exists, readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { appDataDir, resolveResource } from "@tauri-apps/api/path";

import { EmojiData } from "../types/emojiData";

function tokenize(text: string): string[] {
  return text.split(/[-:&()\s|　]/g).filter((s) => s.length > 0);
}

function generateTags(words: string[]): string[] {
  let tags = [...new Set(words)].flatMap((word) => {
    const lowerCaseWord = word.toLowerCase();
    const normalizedWord = lowerCaseWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return [lowerCaseWord, normalizedWord, ...tokenize(lowerCaseWord), ...tokenize(normalizedWord)];
  });
  // remove duplicates
  tags = [...new Set(tags)];

  // remove tags that are too short
  tags = tags.filter((tag) => tag.length > 1);

  // remove tags that start with other tags
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

export type EmojiDB = {
  langs: string[];
  // version: string; TODO
  emojiData: EmojiData;
};

async function getLangNames(langs: string[]) {
  const langCandidates = langs.flatMap((lang) => {
    const l = lang.toLowerCase();
    if (l.includes("-")) {
      return [l, l.split("-")[0] as string];
    }
    return [l];
  });
  const langNames = new Set(langCandidates);
  const result: string[] = [];
  for await (const langName of langNames) {
    const resourcePath = await resolveResource(`resources/searchIndices/${langName}.json`);
    if (await exists(resourcePath)) {
      result.push(langName);
    }
  }
  return result;
}

async function createEmojiDB(langs: string[]): Promise<EmojiDB> {
  const emojiDataPath = await resolveResource("resources/emojiData.json");
  const emojiData: EmojiData = JSON.parse(await readTextFile(emojiDataPath));

  const searchIndices = await Promise.all(
    langs.map(async (lang) => {
      const contents = await readTextFile(
        await resolveResource(`resources/searchIndices/${lang}.json`),
      );
      return JSON.parse(contents);
    }),
  );
  console.log("searchIndices", searchIndices);

  const emojiDB = {
    langs,
    emojiData: emojiData.map((emoji) => {
      const searchIndex = searchIndices.flatMap((searchIndex) => {
        return searchIndex[emoji.unified] ?? [];
      });
      const tags = generateTags([...emoji.tags, ...searchIndex]);
      return {
        ...emoji,
        tags,
      };
    }),
  };
  return emojiDB;
}

function arrayEquals(a: string[], b: string[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export async function getEmojiData(_langs: string[]): Promise<EmojiData> {
  const langs = await getLangNames(_langs);
  console.log("getEmojiDb", langs);
  if (await exists("fullEmojiDB.json", { dir: BaseDirectory.AppData })) {
    console.log("Loading emoji DB...");
    const contents = await readTextFile("fullEmojiDB.json", { dir: BaseDirectory.AppData });
    const emojiData: EmojiDB = JSON.parse(contents);
    console.log("Loaded emoji DB", emojiData);
    if (arrayEquals(emojiData.langs, _langs)) {
      console.log("Emoji DB is up to date");
      return emojiData.emojiData;
    }
  }

  const emojiData = await createEmojiDB(langs);
  await writeTextFile("fullEmojiDB.json", JSON.stringify(emojiData), {
    dir: BaseDirectory.AppData,
  });
  console.log("Created emoji DB", emojiData);
  return emojiData.emojiData;
}
