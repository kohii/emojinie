import { Box, Divider, Text, useMantineTheme } from "@mantine/core";
import React from "react";

import { Hotkey } from "./Hotkey";

type Props = {
	keymap: {
		[key: string]: React.ReactNode;
	}
};

export const StatusBar = React.memo(function StatusBar({ keymap }: Props) {
	const theme = useMantineTheme();

	return <Box
		px="xs"
		py={6}
		display="flex"
		sx={{
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "flex-end",
			gap: 8,
			backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
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
					<Text size="xs">{value}</Text>
					<Hotkey hotkey={key} />
				</Box>
			</>
		))}
	</Box>;
});
