// src/app/page.tsx
import ThemeSwitch from "@/components/ThemeSwitch";
// import MLImageClassifier from "@/components/MLImageClassifier";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Next.js ML Demo</h1>
      <ThemeSwitch />
      <div>Hello World</div>
      <button
        type="button"
        className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      >
        Purple
      </button>
    </main>
  );
}
