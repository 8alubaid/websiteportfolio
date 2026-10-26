import type { Metadata } from "next";
import { TerminalApp } from "@/components/terminal/TerminalApp";

export const metadata: Metadata = {
  title: "Operator Console",
  description: "Explore Faris Balubaid's portfolio through an interactive, read-only command-line interface.",
  alternates: { canonical: "/terminal" },
};

export default function TerminalPage() {
  return (
    <>
      <h1 className="sr-only">Operator Console: terminal mode</h1>
      <TerminalApp />
    </>
  );
}
