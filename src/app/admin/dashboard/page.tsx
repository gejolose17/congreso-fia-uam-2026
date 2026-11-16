import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";
import { ensureFreshSheetData } from "@/lib/google";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  await ensureFreshSheetData(5000);
  const initialStats = await getDashboardStats();
  return <DashboardClient initialStats={initialStats} />;
}
