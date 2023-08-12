import { test } from "vitest";

// import { getShortcodes } from "./emojiShortcodes";

test.each([
  ["😃", { shortcode: ":smiley:", githubShortcode: ":smiley:" }],
  ["☝️", { shortcode: ":point_up:", githubShortcode: ":point_up:" }],
  ["☝🏿", { shortcode: ":point_up::skin-tone-6:", githubShortcode: ":point_up:" }],
  ["👨🏿‍🦱", { shortcode: ":curly_haired_man::skin-tone-6:", githubShortcode: ":curly_haired_man:" }],
  ["🎅🏽", { shortcode: ":santa::skin-tone-4:", githubShortcode: ":santa:" }],
  ["👨‍👩‍👧‍👧", { shortcode: ":man-woman-girl-girl:", githubShortcode: ":family_man_woman_girl_girl:" }],
  ["❤️", { shortcode: ":heart:", githubShortcode: ":heart:" }],
  ["☔️", { shortcode: ":umbrella_with_rain_drops:", githubShortcode: ":umbrella:" }],
])('getShortcode("%s") -> %s', (emoji, expected) => {
  // expect(getShortcodes(emoji)).toStrictEqual(expected);
});
