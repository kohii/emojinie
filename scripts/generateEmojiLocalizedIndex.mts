import fs from "fs/promises";
import path from "path";

async function listChildDirectories(
  repositoryName: string,
  directoryPath: string,
) {
  const url = `https://api.github.com/repos/${repositoryName}/contents/${directoryPath}`;
  const response = await fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url}.`);
    }
    return res.json();
  });

  if (!Array.isArray(response)) {
    throw new Error(`Unexpected response from ${url}.`);
  }
  return response
    .filter((item) => item.type === "dir")
    .map((item) => item.name);
}

async function fetchGitHubFileContent(
  repositoryName: string,
  filePath: string,
  branch = "master",
) {
  const url = `https://raw.githubusercontent.com/${repositoryName}/${branch}/${filePath}`;
  const response = await fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url}.`);
    }
    return res.json();
  });
  return response;
}

async function generateSearchIndex(
  { lang }: {
    repositoryName: string;
    lang: string;
  }
) {
  fs.mkdir(path.join(process.cwd(), "resources", "searchIndices"), { recursive: true });

  const emojiData = await fetchGitHubFileContent(
    "milesj/emojibase",
    `packages/data/${lang}/compact.raw.json`,
  );
  const emojiIndex = emojiData
    .map((emoji: any) => ([emoji.unicode, [...new Set([emoji.label, ...(emoji.tags ?? [])])]]));
  const emojiIndexContent = JSON.stringify(emojiIndex, null, 2);
  await fs.writeFile(
    path.join(process.cwd(), "src-tauri", "resources", "searchIndices", `${lang}.json`),
    emojiIndexContent,
    "utf8",
  );
}

async function generateSearchIndices() {
  const langs = (await listChildDirectories(
    "milesj/emojibase",
    "packages/data",
  )).filter((name) => name.split("-")[0].length === 2);

  for (const lang of langs) {
    await generateSearchIndex({ repositoryName: "milesj/emojibase", lang });
  }
}

generateSearchIndices();