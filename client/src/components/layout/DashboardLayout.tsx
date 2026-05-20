import { useState, type ReactNode } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--foreground)]">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar
            onOpenSidebar={() =>
              setSidebarOpen(true)
            }
          />

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
