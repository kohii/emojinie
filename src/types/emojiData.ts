// export type EmojiData = Record<
//   string,
//   {
//     category: string;
//     shortcode: string;
//     githubShortcode: string | undefined;
//   }
// >;

export type EmojiDataEntry = {
  unified: string;
  category: number;
  name: string;
  shortcode: string;
  ghShortcode: string | undefined; // github shortcode
};

export type EmojiData = EmojiDataEntry[];

export type EmojiMap = {
  [unified: string]: EmojiDataEntry;
};

export type EmojiIndexItem = {
  unified: string;
  tags: string[];
};

export type EmojiIndex = EmojiIndexItem[];

export type EmojiGroup = {
  category: number;
  emojis: EmojiDataEntry[];
};
export type EmojiList = EmojiGroup[];
