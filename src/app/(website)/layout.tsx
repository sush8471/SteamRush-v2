import type { Metadata } from "next";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";

export const metadata: Metadata = {
  title: "Steam Rush - Online Gaming Store",
  description:
    "Your ultimate destination for Steam games. Best deals, exclusive titles, and instant delivery.",
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14]">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}
