import { useMemo } from "react";
import dataByEmojis from "unicode-emoji-json" assert { type: "json" };
import emojiComponents from "unicode-emoji-json/data-emoji-components.json" assert { type: "json" };

import { useQueryCommand } from "./useQueryCommand";

const skinToneByEmojis = {
	[emojiComponents.light_skin_tone]: {
		name: "light skin tone",
		slug: ":skin-tone-2:",
	},
	[emojiComponents.medium_light_skin_tone]: {
		name: "medium-light skin tone",
		slug: ":skin-tone-3:",
	},
	[emojiComponents.medium_skin_tone]: {
		name: "medium skin tone",
		slug: ":skin-tone-4:",
	},
	[emojiComponents.medium_dark_skin_tone]: {
		name: "medium-dark skin tone",
		slug: ":skin-tone-5:",
	},
	[emojiComponents.dark_skin_tone]: {
		name: "dark skin tone",
		slug: ":skin-tone-6:",
	},
};

const skinTonePattern = Object.keys(skinToneByEmojis).join("|") + "$";

function splitSkinTone(emoji: string): [string, string?] {
	const skinTone = emoji.match(new RegExp(skinTonePattern));
	if (skinTone) {
		return [emoji.slice(0, -skinTone[0].length), skinTone[0]];
	}
	return [emoji];
}

function getSlug(emoji: string): string {
	const [strippedEmoji, skinTone] = splitSkinTone(emoji);
	if (strippedEmoji in dataByEmojis) {
		const slug = `:${dataByEmojis[strippedEmoji as keyof typeof dataByEmojis].slug}:`;
		if (skinTone) {
			const skinToneSlug = skinToneByEmojis[skinTone as keyof typeof skinToneByEmojis]?.slug ?? "";
			return slug + skinToneSlug;
		}
		return slug;
	}
	return "";
}

export function useSuggestEmojis(
	text: string
) {
	const args = useMemo(() => text ? ({
		text,
	}) : undefined, [text]);

	const emojisQuery = useQueryCommand<string[]>("suggest_emojis_for_text", {
		args,
		enabled: Boolean(args),
	});

	const data = useMemo(() => {
		if (!emojisQuery.data) {
			return [];
		}
		return emojisQuery.data.map((emoji) => ({
			emoji,
			slug: getSlug(emoji),
		}));
	}, [emojisQuery.data]);

	return {
		...emojisQuery,
		data,
	};
}
