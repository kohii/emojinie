import { Box, ScrollArea } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { useCallback, useState } from "react";

import { EmojiList } from "./components/EmojiList";
import { MainInput } from "./components/MainInput";
import { useFocusState } from "./hooks/useFocutState";
import { useSuggestEmojis } from "./hooks/useSuggestEmojis";
import { EmojiItem } from "./types/emoji";

function App() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  const emojisQuery = useSuggestEmojis(submittedText);

  const focusState = useFocusState({ listSize: emojisQuery.data?.length || 0 });

  const handleSubmit = useCallback(async () => {
    console.log("submit", text, emojisQuery.isFetching);
    if (emojisQuery.isFetching) return;
    setSubmittedText(text);
  }, [emojisQuery.isFetching, text]);

  const handleSelectEmoji = useCallback((emoji: EmojiItem) => {
    console.log("paste", emoji);
    invoke("paste", { text: emoji.emoji });
  }, []);


  return (
    <Box>
      <MainInput
        value={text}
        onChange={setText}
        onSubmit={handleSubmit}
        onMoveUp={focusState.focusPrevious}
        onMoveDown={focusState.focusNext}
      />
      {<ScrollArea sx={{
        maxHeight: 360,
      }}>
        {emojisQuery.isFetching && <Box p="sm">Loading...</Box>}
        {!emojisQuery.isFetching && emojisQuery.error && <Box p="sm">Error: {emojisQuery.error?.message}</Box>}
        {!emojisQuery.isFetching && emojisQuery.data && (
          <Box pb="xs" px="xs">
            <EmojiList emojis={emojisQuery.data} focusedIndex={focusState.focusedIndex} setFocusedIndex={focusState.setFocusedIndex} onClick={handleSelectEmoji} />
          </Box>
        )}
      </ScrollArea>}
    </Box>
  );
}

export default App;
