"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { companies } from "@/data/companies";

type ListType = {
  id: string;
  name: string;
  companies: string[];
};

export default function ListDetailPage() {
  const { id } = useParams();
  const [list, setList] = useState<ListType | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("vcLists");
    if (!stored) return;

    const parsed: ListType[] = JSON.parse(stored);
    const found = parsed.find((l) => l.id === id);

    if (found) {
      setList(found);
    }
  }, [id]);

  const removeCompany = (companyId: string) => {
    if (!list) return;

    const updatedCompanies = list.companies.filter(
      (c) => c !== companyId
    );

    const updatedList = { ...list, companies: updatedCompanies };
    setList(updatedList);

    const stored = localStorage.getItem("vcLists");
    if (!stored) return;

    const parsed: ListType[] = JSON.parse(stored);
    const updatedAll = parsed.map((l) =>
      l.id === id ? updatedList : l
    );

    localStorage.setItem("vcLists", JSON.stringify(updatedAll));
  };

  if (!list) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {list.name}
      </h1>

      <p className="mb-6 text-gray-400">
        {list.companies.length} companies
      </p>

      <div className="space-y-4">
        {list.companies.map((companyId) => {
          const company = companies.find(
            (c) => c.id === companyId
          );

          if (!company) return null;

          return (
            <div
              key={company.id}
              className="bg-gray-800 p-4 rounded flex justify-between items-center"
            >
              <span>{company.name}</span>

              <button
                onClick={() => removeCompany(company.id)}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
