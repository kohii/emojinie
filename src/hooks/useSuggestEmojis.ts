import { useMemo } from "react";

import * as emojis from "../libs/emojis";

import { useQueryCommand } from "./useQueryCommand";

export function useSuggestEmojis(
	text: string
) {
	const args = useMemo(() => text ? ({
		text,
	}) : undefined, [text]);

	const emojisQuery = useQueryCommand<string[]>("suggest_emojis_for_text", {
		args,
		enabled: Boolean(args),
		staleTime: Infinity,
	});

	const data = useMemo(() => {
		if (!emojisQuery.data) {
			return [];
		}
		return emojisQuery.data.map((emoji) => ({
			emoji,
			shortcode: emojis.getShortcode(emoji),
		}));
	}, [emojisQuery.data]);

	return {
		...emojisQuery,
		data,
	};
}
