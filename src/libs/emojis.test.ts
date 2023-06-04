import { expect, test } from "vitest";

import { getGitHubShortcode } from "./emojis";

test.each([
  ["😃", ":smiley:"],
  ["☝️", ":point_up:"],
  ["☝🏿", ":point_up::skin-tone-6:"],
  ["🎅🏽", ":santa::skin-tone-4:"],
  ["👨‍👩‍👧‍👧", ":family_man_woman_girl_girl:"],
  ["❤️", ":heart:"],
  ["☔️", ":umbrella:"],
])('getShortcode("%s") -> %s', (emoji, expected) => {
  expect(getGitHubShortcode(emoji)).toBe(expected);
});
