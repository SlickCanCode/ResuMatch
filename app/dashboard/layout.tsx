import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-w-0 min-h-screen">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <Header />
          <main className="flex-1 min-w-0 p-4 lg:p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
