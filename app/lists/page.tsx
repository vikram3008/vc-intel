"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type ListType = {
  id: string;
  name: string;
  companies: string[];
};

export default function ListsPage() {
  const [lists, setLists] = useState<ListType[]>([]);
  const [newListName, setNewListName] = useState("");

  // Load lists from localStorage
  useEffect(() => {
    const loadLists = () => {
      const stored = localStorage.getItem("vcLists");
      if (stored) {
        setLists(JSON.parse(stored));
      } else {
        setLists([]);
      }
    };

    loadLists();

    // Reload when returning to page
    window.addEventListener("focus", loadLists);

    return () => {
      window.removeEventListener("focus", loadLists);
    };
  }, []);

  const createList = () => {
    if (!newListName.trim()) return;

    const newList: ListType = {
      id: Date.now().toString(),
      name: newListName,
      companies: [],
    };

    const updatedLists = [...lists, newList];

    setLists(updatedLists);
    localStorage.setItem("vcLists", JSON.stringify(updatedLists));
    setNewListName("");
  };

  const deleteList = (id: string) => {
    const updatedLists = lists.filter((l) => l.id !== id);

    setLists(updatedLists);
    localStorage.setItem("vcLists", JSON.stringify(updatedLists));
  };

  const exportJSON = (list: ListType) => {
    const blob = new Blob([JSON.stringify(list, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name}.json`;
    a.click();
  };

  const exportCSV = (list: ListType) => {
    const csv = "Company ID\n" + list.companies.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name}.csv`;
    a.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Lists</h1>

      {/* Create List */}
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 bg-gray-800 px-4 py-2 rounded"
          placeholder="New list name..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button
          onClick={createList}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Lists */}
      <div className="space-y-4">
        {lists.map((list) => (
          <Link key={list.id} href={`/lists/${list.id}`}>
            <div className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 transition">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">{list.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      exportJSON(list);
                    }}
                    className="bg-green-600 px-3 py-1 rounded text-sm"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      exportCSV(list);
                    }}
                    className="bg-yellow-600 px-3 py-1 rounded text-sm"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteList(list.id);
                    }}
                    className="bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-2">
                {list.companies.length} companies
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
