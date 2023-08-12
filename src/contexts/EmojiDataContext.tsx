import React, { createContext, useContext } from "react";

import { Emojis, useEmojiDB } from "../hooks/useEmojiDB";

export type EmojiDataContextType = Emojis;

const EmojiDataContext = createContext<EmojiDataContextType>({
  emojiData: undefined,
  emojiMap: undefined,
  groupedEmojiList: undefined,
  searchEmojis: () => [],
  getEmojiData: () => [],
});

export const EmojiDataProvider = ({ children }: { children: React.ReactNode }) => {
  const emojis = useEmojiDB();
  return <EmojiDataContext.Provider value={emojis}>{children}</EmojiDataContext.Provider>;
};

export function useEmojis() {
  return useContext(EmojiDataContext);
}
