import { expect, test } from "vitest";

import { searchEmojis } from "./emojiIndex";

test("searchEmojis", async () => {
  const result = await searchEmojis("wav");
  expect(result).toStrictEqual(["👋"]);
});
