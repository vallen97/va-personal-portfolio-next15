"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Switch from "@mui/material/Switch";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Wait for client, then render theme UI
  if (!mounted) return null;

  return (
    <div>
      <Switch
        checked={theme === "dark"}
        onChange={(_, checked) => setTheme(checked ? "dark" : "light")}
        inputProps={{ "aria-label": "theme switch" }}
      />
      <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
    </div>
  );
}
