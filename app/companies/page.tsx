"use client";

import { Suspense } from "react";
import CompaniesContent from "./CompaniesContent";

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <CompaniesContent />
    </Suspense>
  );
}
