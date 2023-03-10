import { selectAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  selectAnatomy.keys
);

const baseStyle = definePartsStyle({
  field: {
    shadow: "sm",

    _focusWithin: {
      ringColor: "green.400",
      ring: "2px",
      borderColor: "green.400",
    },
  },
});

export const selectTheme = defineMultiStyleConfig({
  baseStyle,
});
