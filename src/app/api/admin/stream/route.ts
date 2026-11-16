import { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats } from "@/lib/db";
import { dashboardEmitter } from "@/lib/events";
import { ensureFreshSheetData } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const sendStats = async (forcePull = false) => {
        if (closed) return;
        try {
          if (forcePull) {
            await ensureFreshSheetData(6000);
          }
          const stats = await getDashboardStats();
          controller.enqueue(
            encoder.encode(`event: stats\ndata: ${JSON.stringify(stats)}\n\n`)
          );
        } catch {
          // ignore transient stream errors
        }
      };

      await sendStats(true);

      const onUpdate = () => {
        void sendStats(false);
      };
      dashboardEmitter.on("update", onUpdate);

      // Periodic auto-sync with Google Sheets & refresh
      const timer = setInterval(() => {
        void sendStats(true);
      }, 6000);

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
