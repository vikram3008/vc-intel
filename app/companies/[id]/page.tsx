"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { companies } from "@/data/companies";
import ScoreCard from "@/components/ScoreCard";

export default function CompanyProfile() {
  const params = useParams();
  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const company = companies.find(
    (c) => String(c.id) === String(id)
  );

  const [enriched, setEnriched] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Lists state
  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("vcLists");
    if (stored) {
      setLists(JSON.parse(stored));
    }
  }, []);

  if (!company) return <div>Not found</div>;

  const handleEnrich = async () => {
    setLoading(true);

    try {
      const enrichRes = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: company.website }),
      });

      const enrichData = await enrichRes.json();
      setEnriched(enrichData);

      const thesis = localStorage.getItem("fund-thesis") || "";

      const scoreRes = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thesis,
          companyData: enrichData,
        }),
      });

      const scoreData = await scoreRes.json();
      setScore(scoreData);
    } catch (err) {
      console.error("Error during enrichment:", err);
    }

    setLoading(false);
  };

  const addToList = () => {
    if (!selectedList) return;

    const updatedLists = lists.map((list) => {
      if (list.id === selectedList) {
        if (!list.companies.includes(company.id)) {
          return {
            ...list,
            companies: [...list.companies, company.id],
          };
        }
      }
      return list;
    });

    setLists(updatedLists);
    localStorage.setItem("vcLists", JSON.stringify(updatedLists));
    alert("Added to list!");
  };

  return (
    <div>
      {/* ===================== */}
      {/* BASIC INFO (ADDED) */}
      {/* ===================== */}
      <h1 className="text-3xl font-bold mb-4">
        {company.name}
      </h1>

      <div className="mb-6 text-gray-300 space-y-1">
        <p><strong>Sector:</strong> {company.sector}</p>
        <p><strong>Location:</strong> {company.location}</p>
        <p><strong>Founded:</strong> {company.founded}</p>
        {company.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={company.website}
              target="_blank"
              className="text-blue-400"
            >
              {company.website}
            </a>
          </p>
        )}
      </div>

      {/* ===================== */}
      {/* SAVE TO LIST */}
      {/* ===================== */}
      <div className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="font-semibold mb-2">Save to List</h2>
        <div className="flex gap-3">
          <select
            className="bg-gray-700 px-3 py-2 rounded"
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            <option value="">Select list</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

          <button
            onClick={addToList}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* ===================== */}
      {/* ENRICH BUTTON */}
      {/* ===================== */}
      <button
        onClick={handleEnrich}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 rounded"
      >
        {loading ? "Enriching..." : "Enrich & Score"}
      </button>

      {/* ===================== */}
      {/* ENRICHED SECTION */}
      {/* ===================== */}
      {enriched && (
        <div className="mt-6 bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Live Enrichment
          </h2>

          <p className="mb-6 text-gray-200">
            {enriched.summary}
          </p>

          {enriched.whatTheyDo?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2 text-white">
                What They Do
              </h3>
              <ul className="list-disc ml-6 mb-6 text-gray-300">
                {enriched.whatTheyDo.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {enriched.keywords?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2 text-white">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {enriched.keywords.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-600 px-3 py-1 rounded text-sm"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}

          {enriched.derivedSignals?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2 text-white">
                Derived Signals
              </h3>
              <ul className="list-disc ml-6 mb-6 text-gray-300">
                {enriched.derivedSignals.map((signal: string, i: number) => (
                  <li key={i}>{signal}</li>
                ))}
              </ul>
            </>
          )}

          {enriched.sources?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2 text-white">
                Sources
              </h3>
              <ul className="list-disc ml-6 mb-4 text-gray-400">
                {enriched.sources.map((src: string, i: number) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </>
          )}

          {enriched.timestamp && (
            <p className="text-sm text-gray-500">
              Generated at: {enriched.timestamp}
            </p>
          )}
        </div>
      )}

      {/* ===================== */}
      {/* SCORE SECTION */}
      {/* ===================== */}
      {score && (
        <div className="mt-6 bg-gray-800 p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">
            Thesis Match Score
          </h2>

          <p className="text-4xl font-bold mb-4">
            {score.score} / 100
          </p>

          <h3 className="font-semibold mb-2">
            Reasoning
          </h3>
          <p className="mb-4 text-gray-300">
            {score.reasoning}
          </p>

          {score.matchedSignals?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">
                Matched Signals
              </h3>
              <ul className="list-disc ml-6 text-gray-300">
                {score.matchedSignals.map((signal: string, i: number) => (
                  <li key={i}>{signal}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
