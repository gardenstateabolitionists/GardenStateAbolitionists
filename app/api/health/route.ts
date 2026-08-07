import { NextResponse } from 'next/server';

// Liveness check for external uptime monitoring (UptimeRobot). Confirms the
// app is up and serving — it deliberately does NOT touch the database.
//
// WHY (do not re-add a DB query here): Neon auto-suspends the compute after
// a few minutes with no SQL. A monitor polling this route every 5 min used
// to run `SELECT 1` each time, which reset Neon's idle timer forever — the
// compute never suspended and billed 24/7 regardless of real traffic. Same
// mechanism that burned MRA earlier this month. Keeping this route DB-free
// lets Neon scale to zero while the site is idle; the compute wakes on real
// visits + ISR revalidation, which is what we actually want to pay for.
//
// If DB-down alerting is ever needed, do it as a LOW-frequency (hourly)
// cron that only alerts on failure, not a short poll.
//
// Point UptimeRobot (or any external monitor) at /api/health, never at /,
// /news, or any ISR page.
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    { status: 'ok', time: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
