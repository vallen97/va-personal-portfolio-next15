"use client";
import { useTheme } from "next-themes";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-row justify-end items-center gap-4 w-full">
      <FormControlLabel
        control={<Switch onClick={() => setTheme("light")} />}
        label="Light"
        id="lightToggle"
        checked={theme === "light"}
      />
      <FormControlLabel
        control={<Switch onClick={() => setTheme("dark")} />}
        label="Dark"
        checked={theme === "dark"}
      />
      <FormControlLabel
        control={<Switch onClick={() => setTheme("system")} />}
        label="System"
        checked={theme === "system"}
        defaultChecked
      />
    </div>
  );
}
