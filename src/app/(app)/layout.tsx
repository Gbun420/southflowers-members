import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="min-h-screen bg-brand-gray-light">
      <Navbar />
      <main className="p-4 sm:p-6 md:p-8 pb-20 md:pb-8">{children}</main>
    </div>
  );
}
