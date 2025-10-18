/**
 * Main Layout (Landing Page Layout)
 * Includes Header, Footer, and Bottom Navigation
 */

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNavigation />
    </div>
  );
}
