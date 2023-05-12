import { Box } from "@mantine/core";

type Props = {
	children: React.ReactNode;
	gap?: number;
	alignItems?: "center" | "flex-start" | "flex-end";
}

export function HStack({
	children,
	gap,
	alignItems = "center",
}: Props) {
	return <Box display="flex" sx={{
		flexDirection: "row",
		alignItems,
		gap,
	}}>
		{children}
	</Box>;
}