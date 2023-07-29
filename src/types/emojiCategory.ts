const categoryIdToNameMap = new Map([
  [1, "Smileys & Emotion"],
  [2, "People & Body"],
  [3, "Animals & Nature"],
  [4, "Food & Drink"],
  [5, "Travel & Places"],
  [6, "Activities"],
  [7, "Objects"],
  [8, "Symbols"],
  [9, "Flags"],
]);

export function getCategoryName(categoryId: number): string {
  const name = categoryIdToNameMap.get(categoryId);
  if (!name) {
    throw new Error(`Unknown category id: ${categoryId}`);
  }
  return name;
}
