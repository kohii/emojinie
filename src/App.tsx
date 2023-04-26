import { Box, ScrollArea } from "@mantine/core";
import { useCallback, useState } from "react";

import { EmojiList } from "./components/EmojiList";
import { MainInput } from "./components/MainInput";
import { useFocusState } from "./hooks/useFocutState";
import { useQueryCommand } from "./hooks/useQueryCommand";
import { EmojiItem } from "./types/emoji";

function App() {
  const [text, setText] = useState("");
  const [suggestEmojisArgs, setSuggestEmojisArgs] = useState<{
    text: string;
  } | undefined>(undefined);

  const emojisQuery = useQueryCommand<{
    emoji: string;
    name: string;
  }[]>("suggest_emojis_for_text", {
    args: suggestEmojisArgs,
    enabled: Boolean(suggestEmojisArgs?.text),
  });

  const focusState = useFocusState({ listSize: emojisQuery.data?.length || 0 });

  const handleSubmit = useCallback(async () => {
    console.log("submit", text, emojisQuery.isFetching);
    if (emojisQuery.isFetching) return;
    setSuggestEmojisArgs({
      text,
    });
  }, [emojisQuery.isFetching, text]);

  const handleSelectEmoji = useCallback((emoji: EmojiItem) => {
    console.log("select", emoji);
  }, []);


  return (
    <div style={{ height: "100%" }}>
      <div className="container">
        <MainInput
          value={text}
          onChange={setText}
          onSubmit={handleSubmit}
          onMoveUp={focusState.focusPrevious}
          onMoveDown={focusState.focusNext}
        />
      </div>
      <ScrollArea>
        {emojisQuery.isFetching && <Box p="sm">Loading...</Box>}
        {!emojisQuery.isFetching && emojisQuery.error && <Box p="sm">Error: {emojisQuery.error?.message}</Box>}
        {!emojisQuery.isFetching && emojisQuery.data && (
          <EmojiList emojis={emojisQuery.data} focusedIndex={focusState.focusedIndex} onClick={handleSelectEmoji} />
        )}
      </ScrollArea>
    </div>
  );
}

export default App;
