import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getGoogleSetupStatus } from "@/lib/google";
import { GoogleSetupClient } from "@/components/GoogleSetupClient";

export const dynamic = "force-dynamic";

export default async function GoogleSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [status, params] = await Promise.all([
    getGoogleSetupStatus(),
    searchParams,
  ]);

  return (
    <GoogleSetupClient
      initialStatus={status}
      connectedParam={params.connected}
      errorParam={params.error}
    />
  );
}

