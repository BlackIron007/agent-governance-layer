"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { label: "Home", path: "/" },
    { label: "Command Center", path: "/command-center" },
    { label: "Decision History", path: "/decision-history" },
    { label: "Intelligence Hub", path: "/intelligence" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#fff9ee]/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-[#b9b29c]/15">
      <div className="flex justify-between items-center px-12 h-16 w-full max-w-[1600px] mx-auto">
        <Link href="/" className="flex items-center gap-2 text-[#715b3e] dark:text-[#ebe2cb] hover:opacity-80 transition-opacity">
          <ShieldCheck strokeWidth={1.5} className="w-5 h-5" />
          <div className="text-lg font-normal tracking-tighter">Trust Console IQ</div>
        </Link>

        <div className="flex gap-8 items-center">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`font-light tracking-tight text-xs uppercase transition-colors hover:text-[#715b3e] ${
                  isActive
                    ? "text-[#715b3e] border-b border-[#715b3e] pb-0.5 font-medium"
                    : "text-[#6b5d4f]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
