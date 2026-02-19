"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [thesis, setThesis] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("fund-thesis");
    if (saved) setThesis(saved);
  }, []);

  const save = () => {
    localStorage.setItem("fund-thesis", thesis);
    alert("Thesis saved");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Fund Thesis</h1>

      <textarea
        className="w-full bg-gray-800 p-4 rounded h-40"
        value={thesis}
        onChange={(e) => setThesis(e.target.value)}
        placeholder="Describe your investment thesis..."
      />

      <button
        onClick={save}
        className="mt-4 px-4 py-2 bg-blue-600 rounded"
      >
        Save Thesis
      </button>
    </div>
  );
}
