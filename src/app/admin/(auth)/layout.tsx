export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No authentication check - this is for login page
  return <>{children}</>;
}
