import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { site, repoUrl, followUrl } from "@/config/site";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: `@${site.xHandle}`,
  },
};

const NAV = [
  { href: "/", label: "Library" },
  { href: "/spec", label: "Spec" },
  { href: "/coming", label: "Coming" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-rule-soft/70">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Link href="/" className="group flex items-baseline gap-2.5">
              <span className="font-mono text-[0.95rem] font-medium tracking-tight text-paper">
                grok<span className="text-brass">md</span>
              </span>
              <span className="hidden font-serif text-sm italic text-paper-faint sm:inline">
                {site.tagline}
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded px-2.5 py-1.5 text-paper-dim transition-colors hover:bg-ink-800 hover:text-paper"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded px-2.5 py-1.5 text-paper-dim transition-colors hover:bg-ink-800 hover:text-paper"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-24 border-t border-rule-soft/70">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-paper-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>{site.footer}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a href={followUrl()} target="_blank" rel="noreferrer" className="hover:text-paper">
                @{site.xHandle}
              </a>
              <a href={repoUrl} target="_blank" rel="noreferrer" className="hover:text-paper">
                Source
              </a>
              <Link href="/spec" className="hover:text-paper">
                The spec
              </Link>
              <span className="font-mono text-xs text-paper-faint/70">MIT / CC0 text</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
