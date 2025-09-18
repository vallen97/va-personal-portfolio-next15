import React from "react";

export default function Footer() {
  return (
    <footer
      className="
        w-full mt-auto px-4 py-6 
        bg-materialUI-LightPrimary dark:bg-materialUI-DarkOnPrimaryContainer
        text-center rounded-t-lg shadow
        text-materialUI-LightOnSecondary dark:text-materialUI-DarkTertiary
        flex flex-col items-center
      "
      aria-label="Site footer"
    >
      <span className="block mb-1">
        © 2025&nbsp;
        <span className="inline-block align-middle">Contact:</span>&nbsp;
        <a
          href="mailto:vaughnallen97@gmail.com"
          className="underline hover:text-blue-700 focus:outline-none focus-visible:ring-2"
          aria-label="Email Vaughn Allen"
        >
          vaughnallen97@gmail.com
        </a>
      </span>
    </footer>
  );
}
