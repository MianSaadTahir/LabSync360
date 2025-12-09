import { AllocationList } from "../components/AllocationList";
import type { BudgetAllocationItem } from "@/types/allocation";

const fetchAllocations = async (): Promise<BudgetAllocationItem[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${baseUrl}/api/allocations`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("Failed to load allocations", await res.text());
      return [];
    }
    const payload = await res.json();
    return payload.data ?? [];
  } catch (error) {
    console.error("Allocations fetch error", error);
    return [];
  }
};

export default async function AllocationsPage() {
  const allocations = await fetchAllocations();

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Module 3
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Budget Allocations</h1>
        <p className="text-slate-500">
          Track budget allocation to actual resources used.
        </p>
      </header>
      <AllocationList allocations={allocations} />
    </main>
  );
}



