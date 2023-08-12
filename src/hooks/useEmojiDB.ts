import { useEffect, useMemo, useState } from "react";

import { getEmojiData } from "../libs/emojidb";
import { splitSkinTone, splitVariationSelector } from "../libs/emojiParser";
import { EmojiData, EmojiDataEntry, EmojiGroup, EmojiMap } from "../types/emojiData";
import { tokenizeSearchQuery } from "../utils/tokenizeSearchQuery";

import { useLangs } from "./useLangs";

function createGroupedEmojiList(emojiData: EmojiData) {
  const data = emojiData.reduce(
    (acc, emoji) => {
      const category = emoji.category;
      let group: EmojiGroup | undefined = acc[category];
      if (!group) {
        group = acc[category] = {
          category,
          emojis: [],
        };
      }
      group!.emojis.push(emoji);
      return acc;
    },
    {} as Record<number, EmojiGroup>,
  );
  return Object.values(data);
}

export function useEmojiDB() {
  const langs = useLangs();
  const [emojiData, setEmojiData] = useState<EmojiData>([]);

  useEffect(() => {
    (async () => {
      const emojiData = await getEmojiData(langs);
      setEmojiData(emojiData);
    })();
  }, [langs]);

  const emojis = useMemo(() => {
    if (!emojiData)
      return {
        emojiMap: undefined,
        groupedEmojiList: undefined,
        searchEmojis: (query: string) => [],
        getEmojiData: (emoji: string) => [],
      };
    const emojiMap: EmojiMap = Object.fromEntries(
      emojiData.map((x) => [x.unified, x] as [string, EmojiDataEntry]),
    );
    const groupedEmojiList = createGroupedEmojiList(emojiData);
    const searchEmojis = (query: string) => {
      const tokenizedSearchText = tokenizeSearchQuery(query.toLowerCase());
      return [
        {
          category: 0, // Search Results
          emojis: emojiData.filter((emoji) => {
            return tokenizedSearchText.every((token) =>
              emoji.tags.some((tag) => tag.startsWith(token)),
            );
          }),
        },
      ];
    };
    const getEmojiData = (emoji: string) => {
      const [base] = splitSkinTone(emoji);
      const baseEmojiData = emojiMap[base];
      if (baseEmojiData) {
        return baseEmojiData;
      }
      const [baseWithoutVariationSelector, variationSelector] = splitVariationSelector(base);
      if (variationSelector) {
        return emojiMap[baseWithoutVariationSelector];
      }
      return undefined;
    };

    return {
      emojiData,
      emojiMap,
      groupedEmojiList,
      searchEmojis,
      getEmojiData,
    };
  }, [emojiData]);

  return emojis;
}

export type Emojis = ReturnType<typeof useEmojiDB>;
