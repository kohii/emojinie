// eslint-disable-next-line no-irregular-whitespace
const WHITESPACE_PATTERN = /[\s|　]+/;

export const tokenizeSearchQuery = (query: string): string[] => {
  if (!query) {
    return [];
  }
  return query.split(WHITESPACE_PATTERN).filter((s) => s !== "");
};
