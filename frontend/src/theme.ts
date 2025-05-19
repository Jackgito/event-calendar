// theme.ts or theme.js

import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    typography: {
    fontFamily: `'Ancizar Sans', sans-serif`,
  },
  palette: {
    primary: {
      main: "#1976d2", // primary color (you can keep or modify as needed)
    },
    secondary: {
      main: "#f50057", // secondary color (you can keep or modify as needed)
    },
    text: {
      primary: "#212121", // default text color
      secondary: "#757575", // secondary text color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white", // Dark Grey for button text
        },
      },
    },
  },
})

export default theme
