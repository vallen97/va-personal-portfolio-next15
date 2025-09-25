import React, { useState } from "react";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const NAV_LINKS: NavItem[] = [
  { label: "Sort Algorithms", href: "/SortAlgorithm" },
  // { label: "Path Finding", href: "/Pathfinding" },
  { label: "Snake AI", href: "/SnakeAI" },
  { label: "Flappy Birds AI", href: "/FlappyBirds" },
  { label: "GitHub", href: "https://github.com/vallen97", external: true },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-materialUI-LightPrimary dark:bg-materialUI-DarkOnPrimaryContainer shadow px-6 py-4 flex items-center justify-between flex-wrap sticky top-0 z-50">
      <div className="flex items-center text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary mr-6">
        <Link
          href="/"
          className="font-semibold text-xl tracking-tight hover:font-bold hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary"
        >
          Home
        </Link>
      </div>
      <button
        aria-label="Toggle navigation menu"
        className="block lg:hidden bg-materialUI-LightPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer flex items-center px-3 py-2 border rounded"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg
          className="fill-current h-5 w-5 text-white"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } w-full lg:flex lg:items-center lg:w-auto`}
      >
        <nav className="flex flex-col lg:flex-row lg:ml-4">
          {NAV_LINKS.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 lg:mt-0 lg:ml-6 text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary hover:font-bold hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary transition"
                tabIndex={0}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                className="mt-2 lg:mt-0 lg:ml-6 text-materialUI-LightOnPrimary dark:text-materialUI-DarkOnPrimary hover:font-bold hover:text-materialUI-LightOnSecondary dark:hover:text-materialUI-DarkTertiary transition"
                tabIndex={0}
              >
                {label}
              </Link>
            )
          )}
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
