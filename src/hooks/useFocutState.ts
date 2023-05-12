import { useEffect, useMemo, useState } from "react";

export function useFocusState({
	listSize
}: {
	listSize: number;
}) {
	const [focusedIndex, setFocusedIndex] = useState(0);

	useEffect(() => {
		setFocusedIndex(0);
	}, [listSize]);

	return useMemo(() => ({
		focusedIndex,
		setFocusedIndex,
		focusNext() {
			setFocusedIndex((currentIndex) => {
				if (currentIndex === listSize - 1) {
					return 0;
				}
				return currentIndex + 1;
			});
		},
		focusPrevious() {
			setFocusedIndex((currentIndex) => {
				if (currentIndex === 0) {
					return listSize - 1;
				}
				return currentIndex - 1;
			});
		},
		resetFocus() {
			setFocusedIndex(0);
		},
	}), [focusedIndex, listSize]);
}