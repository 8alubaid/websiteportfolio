import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono, Silkscreen } from "next/font/google";
import { ogImage, profile, site } from "@/data";
import { ModeSwitch } from "@/components/layout/ModeSwitch";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap" });
// Pixel face: decorative, short labels only.
const silkscreen = Silkscreen({ variable: "--font-silkscreen", weight: "400", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

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
  themeColor: "#0b0b0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${interTight.variable} ${jetbrains.variable} ${silkscreen.variable} antialiased`}>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes into <body>. */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <a href="#main" className="sr-only-focusable inverse fixed left-3 top-3 z-[60] px-3 py-2 font-mono text-xs">
          Skip to content
        </a>
        <ModeSwitch />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
