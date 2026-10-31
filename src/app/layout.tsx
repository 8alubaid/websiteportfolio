import type { Metadata, Viewport } from "next";
import { Fragment_Mono, Inter, Inter_Tight, Silkscreen } from "next/font/google";
import { ogImage, profile, site } from "@/data";
import { InlineScript } from "@/components/layout/InlineScript";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { THEME_COLOR, themeBootScript } from "@/lib/theme-boot";
import "./globals.css";

// Interface typeface: monospaced, used for nearly all text. Swap it here and in globals.css (--font-mono).
const fragmentMono = Fragment_Mono({ variable: "--font-fragment-mono", weight: "400", subsets: ["latin"], display: "swap" });
// Display face for the name and page titles, set light.
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap" });
// Only the /compare/ page's recreation of the old site uses Inter.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
// Pixel face: decorative, short labels only.
const silkscreen = Silkscreen({ variable: "--font-silkscreen", weight: "400", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${profile.name} · ${profile.headline}`,
    template: `%s · ${profile.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: profile.name, url: profile.contact.github ?? undefined }],
  keywords: ["Faris Balubaid", "portfolio", "cloud engineering", "AI", "Kubernetes", "AWS", "embedded systems", "CU Boulder"],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: profile.name,
    description: site.description,
    url: "/",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.name,
    description: site.description,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  // The boot script and theme store keep this in step with the active theme.
  themeColor: THEME_COLOR.dark,
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the boot script sets data-theme before React hydrates.
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${fragmentMono.variable} ${interTight.variable} ${inter.variable} ${silkscreen.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeBootScript} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes into <body>. */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <a href="#main" className="sr-only-focusable inverse fixed left-3 top-3 z-[60] px-3 py-2 text-meta">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
