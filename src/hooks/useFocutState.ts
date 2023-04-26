import { useCallback, useEffect, useState } from "react";

export function useFocusState({
	listSize
}: {
	listSize: number;
}) {
	const [focusedIndex, setFocusedIndex] = useState(0);

	useEffect(() => {
		setFocusedIndex(0);
	}, [listSize]);

	const focusNext = useCallback(() => {
		setFocusedIndex((currentIndex) => {
			if (currentIndex === listSize - 1) {
				return 0;
			}
			return currentIndex + 1;
		});
	}, [listSize]);

	const focusPrevious = useCallback(() => {
		setFocusedIndex((currentIndex) => {
			if (currentIndex === 0) {
				return listSize - 1;
			}
			return currentIndex - 1;
		});
	}, [listSize]);

	const resetFocus = useCallback(() => {
		setFocusedIndex(0);
	}, []);

	return {
		focusedIndex,
		focusNext,
		focusPrevious,
		resetFocus,
	};
}