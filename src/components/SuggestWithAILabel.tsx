import { Box, Text } from "@mantine/core";

export function SuggestWithAILabel() {
  return (<Box display="flex" sx={{ alignItems: "center", gap: 4 }}>
    <Text size="xs" color="text.1">Suggest with AI</Text>
    <Text size={11} color="text.1" px={2} sx={{
      border: "1px solid #999",
      borderRadius: 4,
    }}>TAB</Text>
  </Box>);
}