import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "customer" | "vendor" | "admin";

// Connection closed hole ekbar retry
async function getSessionSafe() {
  const h = await headers();
  try {
    return await auth.api.getSession({ headers: h });
  } catch {
    return await auth.api.getSession({ headers: h });
  }
}

// roles faka dile: shudhu login check. Role na mille /dashboard e pathay
export async function requireRole(roles: Role[] = []) {
  const session = await getSessionSafe();
  if (!session) redirect("/sign-in");

  const user = session.user as any;
  if (user.isBlocked) redirect("/blocked");
  if (roles.length && !roles.includes(user.role)) redirect("/dashboard");

  return session;
}

// Login lagbe emon public-looking page er jonno (jemon /menu/[id])
export async function requireLogin(redirectTo: string) {
  const session = await getSessionSafe();
  if (!session) redirect(`/sign-in?redirect=${encodeURIComponent(redirectTo)}`);
  if ((session.user as any).isBlocked) redirect("/blocked");
  return session;
}