import { BudgetList } from "../components/BudgetList";
import type { BudgetItem } from "@/types/budget";

const fetchBudgets = async (): Promise<BudgetItem[]> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${baseUrl}/api/budgets`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      console.error("Failed to load budgets", await res.text());
      return [];
    }
    const payload = await res.json();
    return payload.data ?? [];
  } catch (error) {
    console.error("Budgets fetch error", error);
    return [];
  }
};

export default async function BudgetsPage() {
  const budgets = await fetchBudgets();

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col gap-10 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
          Module 2
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Budgets</h1>
        <p className="text-slate-500">
          Designed budgets with people and resource costs.
        </p>
      </header>
      <BudgetList budgets={budgets} />
    </main>
  );
}

