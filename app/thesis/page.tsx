"use client";

import { useState, useEffect } from "react";

export default function ThesisPage() {
  const [thesis, setThesis] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("fund-thesis");
    if (stored) setThesis(stored);
  }, []);

  const saveThesis = () => {
    localStorage.setItem("fund-thesis", thesis);
    alert("Thesis saved!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Investment Thesis
      </h1>

      <textarea
        className="w-full bg-gray-800 p-4 rounded mb-4"
        rows={6}
        value={thesis}
        onChange={(e) => setThesis(e.target.value)}
        placeholder="Enter your investment thesis..."
      />

      <button
        onClick={saveThesis}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Save Thesis
      </button>
    </div>
  );
}
