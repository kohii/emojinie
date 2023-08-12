import FlexSearch from "flexsearch";

type EmojiDoc = {
  e: string;
  n: string;
  s: string;
  c: string;
  t: string[];
};

const emojis: EmojiDoc[] = [
  {
    e: "👋",
    n: "Waving Hand",
    s: "wave",
    c: "people",
    t: ["hand", "wave", "waving"],
  },
  {
    e: "🚀",
    n: "Rocket",
    s: "rocket",
    c: "travel",
    t: ["launch", "rocket", "space"],
  },
];

async function buildIndex() {
  const a = FlexSearch;
  console.log(a);

  const index = new FlexSearch.Index({
    // encode: (str) => str.replace(/[\x00-\x7F]/g, ""),
    tokenize: "forward",
  });

  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i]!;
    index.add(i, [emoji.n, ...emoji.t].join(" "));
  }
  return index;
}

let index: FlexSearch.Index | undefined;

async function getIndex(): Promise<FlexSearch.Index> {
  if (index) return index;
  return (index = await buildIndex());
}

export async function searchEmojis(query: string): Promise<string[]> {
  const idx = await getIndex();
  const ids = await idx.searchAsync(query);
  return ids.map((id) => emojis[+id]!.e);
}
