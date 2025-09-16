// src/theme/muiTheme.ts
import { createTheme, PaletteMode } from "@mui/material";

export const getMuiTheme = (mode: PaletteMode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? { primary: { main: "#1976d2" } }
        : {
            primary: { main: "#90caf9" },
            background: { default: "#121212", paper: "#1d1d1d" },
          }),
    },
  });
