import { Box, Divider, Text, useMantineTheme } from "@mantine/core";
import React from "react";

import { useTextColor } from "../hooks/useTextColor";

import { Hotkey } from "./Hotkey";

type Props = {
	keymap: {
		[key: string]: React.ReactNode;
	}
};

export const StatusBar = React.memo(function StatusBar({ keymap }: Props) {
	const theme = useMantineTheme();
	const textColor = useTextColor();


	return <Box
		px="xs"
		py={6}
		display="flex"
		sx={{
			userSelect: "none",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "flex-end",
			gap: 8,
			backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
			borderTop: "1px solid",
			borderTopColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2],
		}}>
		{Object.entries(keymap).map(([key, value], index) => (
			<>
				{index > 0 && <Divider orientation="vertical" />}
				<Box
					key={key}
					display="flex"
					sx={{
						flexDirection: "row",
						alignItems: "center",
						gap: 4,
					}}
				>
					<Text size="xs" color={textColor.secondary}>{value}</Text>
					<Hotkey hotkey={key} />
				</Box>
			</>
		))}
	</Box>;
});
