import { Text } from "@mantine/core";
import { Box, useMantineTheme } from "@mantine/core";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

import { useMouseMove } from "../hooks/useMouseMove";
import { emojiList } from "../libs/emojis";
import { EmojiDataEntry } from "../types/emojiData";
import { getCategoryName } from "../types/emojiCategory";

const COUNT_PER_ROW = 8;

type Row = {
  emojis: EmojiDataEntry[];
  offset: number;
};

const rows: Row[] = emojiList.flatMap((group) => {
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
  return rows;
});

const focusStyle = {
  backgroundColor: "#3478C6 !important",
  color: "#fff !important",
};

export type EmojiGridProps = {
  onSelect: (emoji: string) => void;
  onFocusChange?: (row: number, col: number, emoji: string | null) => void;
};

export type EmojiGridHandle = {
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
  { onSelect, onFocusChange },
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

  useImperativeHandle(
    ref,
    () => ({
      focusUp() {
        setFocusPos(([row, col]) => {
          const newRow = (row - 1 + rows.length) % rows.length;
          const r = rows[newRow]!;
          const newCol = Math.min(col, r.emojis.length - 1);
          return [newRow, newCol];
        });
      },
      focusDown() {
        setFocusPos(([row, col]) => {
          const newRow = (row + 1) % rows.length;
          const r = rows[newRow]!;
          const newCol = Math.min(col, r.emojis.length - 1);
          return [newRow, newCol];
        });
      },
      focusLeft() {
        setFocusPos(([row, col]) => {
          if (col === 0) {
            const newRow = (row - 1 + rows.length) % rows.length;
            const r = rows[newRow]!;
            const newCol = r.emojis.length - 1;
            return [newRow, newCol];
          }
          return [row, col - 1];
        });
      },
      focusRight() {
        setFocusPos(([row, col]) => {
          if (col === rows[row]!.emojis.length - 1) {
            const newRow = (row + 1) % rows.length;
            const newCol = 0;
            return [newRow, newCol];
          }
          return [row, col + 1];
        });
      },
      focusFirstInRow() {
        setFocusPos(([row, col]) => {
          return [row, 0];
        });
      },
      focusLastInRow() {
        setFocusPos(([row, col]) => {
          const newRow = row;
          const newCol = rows[row]!.emojis.length - 1;
          return [newRow, newCol];
        });
      },
      focusFirst() {
        setFocusPos([0, 0]);
      },
      focusLast() {
        setFocusPos([rows.length - 1, rows[rows.length - 1]!.emojis.length - 1]);
      },
    }),
    [],
  );

  const lastFocusPos = useRef<[number, number]>(focusPos);
  useEffect(() => {
    if (lastFocusPos.current[0] === focusPos[0] && lastFocusPos.current[1] === focusPos[1]) return;
    lastFocusPos.current = focusPos;
    scrollTo(focusPos[0]);
    onFocusChange?.(focusPos[0], focusPos[1], rows[focusPos[0]]?.emojis[focusPos[1]]?.unified ?? null);
  }, [focusPos, onFocusChange, scrollTo]);

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
        groupCounts={emojiList.map((group) => Math.ceil(group.emojis.length / COUNT_PER_ROW))}
        groupContent={(index) => {
          return (
            <Box sx={{ background: theme.colors.background[0] }} mx={12}>
              <Text size="sm" color="text.1" weight="bold" py={8}>
                {getCategoryName(emojiList[index]!.category)}
              </Text>
            </Box>
          );
        }}
        itemContent={(rowIndex) => {
          const row = rows[rowIndex]!;
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
                const emoji = row.emojis[i]?.unified;
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
