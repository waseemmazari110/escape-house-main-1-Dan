import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as any;
  const role = user?.role;

  // Redirect if not authenticated or not an owner
  if (!user || (role !== "owner" && role !== "admin")) {
    redirect("/owner/login");
  }

  return <>{children}</>;
}
