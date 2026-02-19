"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { companies } from "@/data/companies";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 3;

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "sector" | "founded">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();

  // 🔎 Filter
  const filtered = useMemo(() => {
    return companies.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

// 🔃 Sort
const sorted = useMemo(() => {
  const sortedData = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (sortKey === "founded") {
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return sortedData;
}, [filtered, sortKey, sortAsc]);


  // 📄 Pagination
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
  }, [sorted, page]);

  // 💾 Save Search
  const saveSearch = () => {
    const saved = JSON.parse(localStorage.getItem("savedSearches") || "[]");
    const newSearch = { search, sortKey, sortAsc };
    localStorage.setItem("savedSearches", JSON.stringify([...saved, newSearch]));
    alert("Search saved!");
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
  const searchParam = searchParams.get("search");
  const sortKeyParam = searchParams.get("sortKey") as any;
  const sortAscParam = searchParams.get("sortAsc");

  if (searchParam !== null) setSearch(searchParam);
  if (sortKeyParam) setSortKey(sortKeyParam);
  if (sortAscParam !== null) setSortAsc(sortAscParam === "true");
}, [searchParams]);

  const toggleSort = (key: "name" | "sector" | "founded") => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Companies</h1>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 bg-gray-800 px-4 py-2 rounded"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={saveSearch}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Save Search
        </button>
      </div>

      {/* Table */}
      <table className="w-full bg-gray-800 rounded">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            <th
              className="p-3 cursor-pointer"
              onClick={() => toggleSort("name")}
            >
              Name
            </th>
            <th
              className="cursor-pointer"
              onClick={() => toggleSort("sector")}
            >
              Sector
            </th>
            <th>Location</th>
            <th
              className="cursor-pointer"
              onClick={() => toggleSort("founded")}
            >
              Founded
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((c) => (
            <tr
              key={c.id}
              className="border-b border-gray-700 hover:bg-gray-700"
            >
              <td className="p-3">{c.name}</td>
              <td>{c.sector}</td>
              <td>{c.location}</td>
              <td>{c.founded}</td>
              <td>
                <Link
                  href={`/companies/${c.id}`}
                  className="text-blue-400"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 rounded ${
              page === num ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
