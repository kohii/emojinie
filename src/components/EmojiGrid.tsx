import { Text } from "@mantine/core";
import { Box, useMantineTheme } from "@mantine/core";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { GroupedVirtuoso, GroupedVirtuosoHandle } from "react-virtuoso";

import { useMouseMove } from "../hooks/useMouseMove";
import { allEmojiList, getEmojiList } from "../libs/emojis";
import { EmojiDataEntry, EmojiList } from "../types/emojiData";
import { getCategoryName } from "../types/emojiCategory";

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
}

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

const allEmojiGridData = toEmojiGridData(allEmojiList);

function getEmojiGridData(filterText: string): EmojiGridData {
  if (!filterText) return allEmojiGridData;
  return toEmojiGridData(getEmojiList(filterText));
}


const focusStyle = {
  backgroundColor: "#3478C6 !important",
  color: "#fff !important",
};

export type EmojiGridProps = {
  filterText: string;
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
  { filterText, onSelect, onFocusChange },
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

  const { rows, groupsNames, groupRowCounts, groupItemCounts } = useMemo(() => getEmojiGridData(filterText), [filterText]);

  useEffect(() => {
    setFocusPos([0, 0]);
  }, [rows]);

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
    [rows],
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
        groupCounts={groupRowCounts}
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
                {groupsNames[index]}
              </Text>
              <Text size="xs" color="text.1">
                {groupItemCounts[index]}
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
