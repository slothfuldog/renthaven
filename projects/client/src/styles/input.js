import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

const baseStyle = definePartsStyle({
  field: {
    shadow: "sm",
  },
});

export const inputTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    focusBorderColor: "green.400",
  },
});
