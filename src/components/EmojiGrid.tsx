import { Text } from "@mantine/core";
import { Box, useMantineTheme } from "@mantine/core";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

import { useEmojis } from "../contexts/EmojiDataContext";
import { useMouseMove } from "../hooks/useMouseMove";
import { getCategoryName } from "../types/emojiCategory";
import { EmojiDataEntry, EmojiList } from "../types/emojiData";

const COUNT_PER_ROW = 8;

type Row = {
  emojis: EmojiDataEntry[];
  offset: number;
};

type EmojiGridData = {
  rows: Row[];
  groupsNames: string[];
  groupRowCounts: number[];
  groupItemCounts: number[];
};

function toEmojiGridData(emojiList: EmojiList): EmojiGridData {
  const groupsNames: string[] = [];
  const groupRowCounts: number[] = [];

  const rows = emojiList.flatMap((group) => {
    const rows: Row[] = [];
    let offset = 0;
    for (let i = 0; i < group.emojis.length; i += COUNT_PER_ROW) {
      const emojis = group.emojis.slice(i, i + COUNT_PER_ROW);
      rows.push({
        emojis,
        offset,
      });
      offset += emojis.length;
    }

    groupsNames.push(getCategoryName(group.category));
    groupRowCounts.push(rows.length);

    return rows;
  });

  return {
    rows,
    groupsNames,
    groupRowCounts,
    groupItemCounts: emojiList.map((g) => g.emojis.length),
  };
}

const focusStyle = {
  backgroundColor: "#3478C6 !important",
  color: "#fff !important",
};

export type EmojiGridProps = {
  searchText: string;
  onSelect: (emoji: string) => void;
  onFocusChange?: (row: number, col: number, emoji: string | null) => void;
};

export type EmojiGridHandle = {
  getFocusedEmoji: () => string | null;
  focusUp: () => void;
  focusDown: () => void;
  focusLeft: () => void;
  focusRight: () => void;
  focusFirstInRow: () => void;
  focusLastInRow: () => void;
  focusFirst: () => void;
  focusLast: () => void;
};

export const EmojiGrid = forwardRef<EmojiGridHandle, EmojiGridProps>(function EmojiGrid(
  { searchText, onSelect, onFocusChange },
  ref,
) {
  const theme = useMantineTheme();

  const [focusPos, setFocusPos] = useState<[number, number]>([0, 0]);
  const virtuoso = useRef<GroupedVirtuosoHandle>(null);
  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 0,
  });
  const scrollTo = useCallback(
    (rowIndex: number) => {
      if (rowIndex <= visibleRange.startIndex) {
        virtuoso.current?.scrollToIndex({
          index: rowIndex,
          align: "start",
        });
      }
      if (rowIndex >= visibleRange.endIndex) {
        virtuoso.current?.scrollToIndex({
          index: rowIndex,
          align: "end",
        });
      }
    },
    [visibleRange],
  );

  const emojis = useEmojis();
  const allEmojiGridData = useMemo(
    () => (emojis.groupedEmojiList ? toEmojiGridData(emojis.groupedEmojiList) : undefined),
    [emojis],
  );

  const searchResult = useMemo(() => {
    if (!searchText) return allEmojiGridData;
    const searched = emojis.searchEmojis(searchText);
    return searched ? toEmojiGridData(searched) : undefined;
  }, [searchText, allEmojiGridData, emojis]);

  useEffect(() => {
    setFocusPos([0, 0]);
  }, [searchResult]);

  useImperativeHandle(
    ref,
    () => ({
      getFocusedEmoji() {
        if (!searchResult) return null;
        const row = searchResult.rows[focusPos[0]];
        return row?.emojis[focusPos[1]]?.unified ?? null;
      },
      focusUp() {
        if (!searchResult) return;
        setFocusPos(([row, col]) => {
          const newRow = (row - 1 + searchResult.rows.length) % searchResult.rows.length;
          const r = searchResult.rows[newRow]!;
          const newCol = Math.min(col, r.emojis.length - 1);
          return [newRow, newCol];
        });
      },
      focusDown() {
        if (!searchResult) return;
        setFocusPos(([row, col]) => {
          const newRow = (row + 1) % searchResult.rows.length;
          const r = searchResult.rows[newRow]!;
          const newCol = Math.min(col, r.emojis.length - 1);
          return [newRow, newCol];
        });
      },
      focusLeft() {
        if (!searchResult) return;
        setFocusPos(([row, col]) => {
          if (col === 0) {
            const newRow = (row - 1 + searchResult.rows.length) % searchResult.rows.length;
            const r = searchResult.rows[newRow]!;
            const newCol = r.emojis.length - 1;
            return [newRow, newCol];
          }
          return [row, col - 1];
        });
      },
      focusRight() {
        if (!searchResult) return;
        setFocusPos(([row, col]) => {
          if (col === searchResult.rows[row]!.emojis.length - 1) {
            const newRow = (row + 1) % searchResult.rows.length;
            const newCol = 0;
            return [newRow, newCol];
          }
          return [row, col + 1];
        });
      },
      focusFirstInRow() {
        if (!searchResult) return;
        setFocusPos(([row, col]) => {
          return [row, 0];
        });
      },
      focusLastInRow() {
        if (!searchResult) return;
        setFocusPos(([row, col]) => {
          const newRow = row;
          const newCol = searchResult.rows[row]!.emojis.length - 1;
          return [newRow, newCol];
        });
      },
      focusFirst() {
        setFocusPos([0, 0]);
      },
      focusLast() {
        if (!searchResult) return;
        setFocusPos([
          searchResult.rows.length - 1,
          searchResult.rows[searchResult.rows.length - 1]!.emojis.length - 1,
        ]);
      },
    }),
    [searchResult],
  );

  const lastFocusPos = useRef(focusPos);
  const lastRows = useRef(searchResult?.rows);
  useEffect(() => {
    if (
      lastFocusPos.current[0] === focusPos[0] &&
      lastFocusPos.current[1] === focusPos[1] &&
      lastRows.current === searchResult?.rows
    )
      return;
    lastFocusPos.current = focusPos;
    lastRows.current = searchResult?.rows;
    scrollTo(focusPos[0]);
    onFocusChange?.(
      focusPos[0],
      focusPos[1],
      searchResult?.rows[focusPos[0]]?.emojis[focusPos[1]]?.unified ?? null,
    );
  }, [focusPos, onFocusChange, scrollTo, searchResult]);

  return (
    <Box
      sx={{
        userSelect: "none",
        "&>*": {
          userSelect: "none",
        },
      }}
    >
      <GroupedVirtuoso
        style={{ height: "400px" }}
        ref={virtuoso}
        rangeChanged={setVisibleRange}
        groupCounts={searchResult?.groupRowCounts ?? []}
        groupContent={(index) => {
          return (
            <Box
              display="flex"
              mx={12}
              py={8}
              sx={{
                background: theme.colors.background[0],
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text size="sm" color="text.1" weight="bold">
                {searchResult?.groupsNames?.[index]}
              </Text>
              <Text size="xs" color="text.1">
                {searchResult?.groupItemCounts?.[index]}
              </Text>
            </Box>
          );
        }}
        itemContent={(rowIndex) => {
          const row = searchResult?.rows?.[rowIndex];
          return (
            <Box
              display="flex"
              mx={12}
              pb={8}
              sx={{
                gap: 8,
                "&>*": {
                  flex: 1,
                  textAlign: "center",
                  fontSize: 32,
                  borderRadius: 8,
                  cursor: "pointer",
                  background:
                    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              }}
            >
              {Array.from({ length: COUNT_PER_ROW }).map((_, i) => {
                const focus = focusPos[0] === rowIndex && focusPos[1] === i;
                const emoji = row?.emojis[i]?.unified;
                return emoji ? (
                  <Box
                    className="emoji"
                    data-row={rowIndex}
                    data-col={i}
                    key={emoji}
                    sx={{
                      ...(focus ? focusStyle : {}),
                    }}
                    onClick={() => onSelect(emoji)}
                  >
                    {emoji}
                  </Box>
                ) : (
                  <Box key={i} sx={{ visibility: "hidden" }} />
                );
              })}
            </Box>
          );
        }}
        onMouseMove={useMouseMove(".emoji", (ev) => {
          const row = parseInt(ev.target.dataset["row"]!);
          const col = parseInt(ev.target.dataset["col"]!);
          setFocusPos([row, col]);
        })}
      />
    </Box>
  );
});
