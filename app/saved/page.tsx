"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SavedSearch = {
  search: string;
  sortKey: string;
  sortAsc: boolean;
};

export default function SavedPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("savedSearches");
    if (stored) {
      setSavedSearches(JSON.parse(stored));
    }
  }, []);

  const runSearch = (search: SavedSearch) => {
    const params = new URLSearchParams({
      search: search.search,
      sortKey: search.sortKey,
      sortAsc: search.sortAsc.toString(),
    });

    router.push(`/companies?${params.toString()}`);
  };

  const deleteSearch = (index: number) => {
    const updated = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Saved Searches</h1>

      {savedSearches.length === 0 && (
        <p className="text-gray-400">No saved searches yet.</p>
      )}

      <div className="space-y-4">
        {savedSearches.map((search, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p><strong>Query:</strong> {search.search || "All companies"}</p>
              <p className="text-sm text-gray-400">
                Sort: {search.sortKey} ({search.sortAsc ? "ASC" : "DESC"})
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => runSearch(search)}
                className="bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Run
              </button>

              <button
                onClick={() => deleteSearch(index)}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
