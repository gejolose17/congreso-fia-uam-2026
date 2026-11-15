import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats, getStorageMode } from "@/lib/db";
import { dashboardEmitter } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const sendStats = async () => {
        if (closed) return;
        try {
          const stats = await getDashboardStats();
          controller.enqueue(
            encoder.encode(`event: stats\ndata: ${JSON.stringify(stats)}\n\n`)
          );
        } catch {
          // ignore transient stream errors
        }
      };

      await sendStats();

      const onUpdate = () => {
        void sendStats();
      };
      dashboardEmitter.on("update", onUpdate);

      // Periodic refresh (especially useful when running in Supabase serverless mode)
      const intervalMs = getStorageMode() === "supabase" ? 3000 : 8000;
      const timer = setInterval(() => {
        void sendStats();
      }, intervalMs);

      const heartbeat = setInterval(() => {
        if (!closed) {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        }
      }, 20000);

      req.signal.addEventListener("abort", () => {
        closed = true;
        dashboardEmitter.off("update", onUpdate);
        clearInterval(timer);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

