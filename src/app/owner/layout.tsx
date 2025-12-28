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

  // Redirect if not authenticated
  if (!user) {
    redirect("/owner/login");
  }

  // STRICT: Only owners can access owner routes (not even admins)
  if (role !== "owner") {
    // Redirect non-owners to their appropriate dashboard
    if (role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/");
    }
  }

  return <>{children}</>;
}
