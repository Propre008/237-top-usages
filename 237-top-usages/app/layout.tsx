import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "237 Top Usages — Ce que les Camerounais utilisent vraiment",
    template: "%s | 237 Top Usages",
  },
  description:
    "Décryptages, tops et solutions concrètes sur Internet, l'énergie et le business au Cameroun.",
  keywords: ["Cameroun", "Internet", "business", "énergie", "apps", "numérique", "Douala", "Yaoundé"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col text-surface-800">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
