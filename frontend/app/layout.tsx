import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import GlobalGovernanceTracker from "../components/GlobalGovernanceTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Trust Console IQ — Enterprise AI Governance Platform",
  description:
    "Trust Console IQ audits, challenges, simulates, and governs generative AI recommendations before they reach your customers, employees, vendors, regulators, or critical production systems.",
  openGraph: {
    title: "Trust Console IQ — Enterprise AI Governance Platform",
    description:
      "Enterprise-grade AI governance: constitutional audit, adversarial stress-testing, regulatory compliance, and board-level decision oversight.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-text font-sans">
        <Navbar />
        <GlobalGovernanceTracker />
        {children}
      </body>
    </html>
  );
}