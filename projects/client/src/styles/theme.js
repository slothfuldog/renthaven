import { extendTheme } from "@chakra-ui/react";
import { inputTheme } from "./input";
import { selectTheme } from "./select";

export const theme = extendTheme({
  components: { Input: inputTheme, Select: selectTheme },
});
