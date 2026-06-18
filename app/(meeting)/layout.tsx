import type { ReactNode } from "react";
import DashboardShell from "./_components/dashboardShell";

export default function MeetingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
