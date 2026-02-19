"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `block px-4 py-2 rounded transition ${
      pathname?.startsWith(path)
        ? "bg-gray-800 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <aside className="w-64 h-screen bg-gray-950 p-6">
      <h1 className="text-xl font-bold mb-8">
        VC Intel
      </h1>

      <nav className="space-y-2">
        <Link href="/companies" className={linkStyle("/companies")}>
          Companies
        </Link>

        <Link href="/saved" className={linkStyle("/saved")}>
          Saved Searches
        </Link>

        <Link href="/lists" className={linkStyle("/lists")}>
          Lists
        </Link>

        <Link href="/thesis" className={linkStyle("/thesis")}>
          Investment Thesis
        </Link>
      </nav>
    </aside>
  );
}
