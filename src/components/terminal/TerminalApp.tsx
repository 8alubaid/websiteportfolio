"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { profile } from "@/data";
import { site } from "@/data/site";
import { complete } from "@/lib/terminal/autocomplete";
import { execute } from "@/lib/terminal/engine";
import { displayPath } from "@/lib/terminal/filesystem";
import { session, useSession } from "@/lib/terminal/session";
import { getFocusProject, setFocusProject } from "@/lib/focus";
import { TerminalOutput } from "./TerminalOutput";

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="mr-2.5 shrink-0 select-none">
      <span className="font-bold">
        {profile.handle}@{site.hostname}
      </span>
      <span className="font-light">:</span>
      <span className="font-bold">{displayPath(cwd)}</span>
      <span className="font-light">$</span>
    </span>
  );
}

/** Tracks the visual viewport so the prompt stays above mobile keyboards and browser chrome. */
function useVisualViewport() {
  const [box, setBox] = useState<{ height: number; top: number } | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setBox({ height: vv.height, top: vv.offsetTop });
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return box;
}

/**
 * Fullscreen operator console. Opens to an empty prompt; all guidance lives behind `help`.
 * Command logic is in `src/lib/terminal` (pure TypeScript); this component only renders
 * output blocks and applies effects.
 */
export function TerminalApp() {
  const router = useRouter();
  const { entries, cwd, history, announce } = useSession();
  const viewport = useVisualViewport();
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [focused, setFocused] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const historyIndex = useRef<number | null>(null);
  const draft = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingRun = useRef<string | null>(null);

  const replaceValue = (next: string) => {
    setValue(next);
    setCaret(next.length);
  };

  const run = useCallback(
    (raw: string) => {
      const command = raw.trim();
      const { cwd: currentCwd, history: currentHistory } = session.get();
      const { result } = execute(command, { cwd: currentCwd, history: currentHistory, focusProject: getFocusProject() });

      session.remember(command);
      historyIndex.current = null;
      setOptions([]);
      setValue("");
      setCaret(0);

      const effects = result.effects ?? [];
      if (effects.some((e) => e.type === "clear")) {
        session.clear();
        return;
      }

      session.push({ input: command, cwd: currentCwd, blocks: result.blocks }, result.announce);

      for (const effect of effects) {
        if (effect.type === "cwd") session.setCwd(effect.path);
        if (effect.type === "focus-project") setFocusProject(effect.slug);
        if (effect.type === "navigate") {
          const { href, external } = effect;
          setTimeout(() => {
            if (href.startsWith("mailto:")) window.location.href = href;
            else if (external) window.open(href, "_blank", "noopener,noreferrer");
            else router.push(href);
          }, 350);
        }
      }
      inputRef.current?.focus({ preventScroll: true });
    },
    [router],
  );

  // A real console never scrolls the page behind it.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  // Deep links (/terminal?run=projects%20stm32-tetris) run once, then the URL is cleaned.
  // `??=` keeps the command if this effect runs twice (React StrictMode) after the URL was cleaned.
  useEffect(() => {
    pendingRun.current ??= new URLSearchParams(window.location.search).get("run");
    if (pendingRun.current) {
      const cmd = pendingRun.current;
      window.history.replaceState(null, "", window.location.pathname);
      pendingRun.current = null;
      run(cmd);
    }
    inputRef.current?.focus({ preventScroll: true });
  }, [run]);

  // Follow the newest output, like a real terminal.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [entries.length, options.length, viewport?.height]);

  const syncCaret = (e: SyntheticEvent<HTMLInputElement>) => setCaret(e.currentTarget.selectionStart ?? e.currentTarget.value.length);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const result = complete(value, { cwd, history });
      replaceValue(result.value);
      setOptions(result.options);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      if (historyIndex.current === null) draft.current = value;
      const current = historyIndex.current ?? history.length;
      const next = e.key === "ArrowUp" ? Math.max(0, current - 1) : current + 1;
      if (next >= history.length) {
        historyIndex.current = null;
        replaceValue(draft.current);
      } else {
        historyIndex.current = next;
        replaceValue(history[next]);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      session.clear();
    } else if (e.key.toLowerCase() === "c" && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault();
      session.push({ input: `${value}^C`, cwd, blocks: [] });
      replaceValue("");
      setOptions([]);
    } else if (e.key === "Escape") {
      setOptions([]);
    }
  };

  // Clicking anywhere in the console focuses the prompt, without stealing a text selection.
  const focusInput = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  const before = value.slice(0, caret);
  const at = value.slice(caret, caret + 1);
  const after = value.slice(caret + 1);

  return (
    <section
      aria-label="Operator console"
      className="fixed inset-x-0 top-0 z-40 flex h-dvh flex-col bg-bg font-mono text-[0.9rem] leading-relaxed sm:text-sm"
      style={viewport ? { height: viewport.height, top: viewport.top } : undefined}
    >
      <div
        ref={scrollRef}
        onClick={focusInput}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-2"
      >
        <div role="log" aria-live="off" aria-label="Terminal output" className="grid gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="grid gap-2">
              {entry.input !== null && (
                <p className="flex flex-wrap break-all">
                  <Prompt cwd={entry.cwd} />
                  <span>{entry.input}</span>
                </p>
              )}
              {entry.blocks.length > 0 && <TerminalOutput blocks={entry.blocks} run={run} />}
            </div>
          ))}
        </div>

        <div className={entries.length ? "mt-4" : undefined}>
          <label htmlFor="terminal-input" className="flex items-start">
            <Prompt cwd={cwd} />
            <span className="sr-only">Command</span>
            <span className="relative min-w-0 flex-1 text-base sm:text-sm">
              {/* Visible mirror with a block cursor; the real input sits on top, transparent. */}
              <span aria-hidden="true" className="pointer-events-none block min-h-[1.6em] whitespace-pre-wrap break-all">
                {before}
                <span className={focused ? "animate-blink inverse" : "outline outline-1 -outline-offset-1 outline-fg"}>
                  {at || " "}
                </span>
                {after}
              </span>
              <input
                ref={inputRef}
                id="terminal-input"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  syncCaret(e);
                  if (options.length) setOptions([]);
                }}
                onSelect={syncCaret}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                aria-describedby="terminal-help"
                className="absolute inset-0 h-full w-full bg-transparent text-transparent caret-transparent outline-none selection:bg-surface"
              />
            </span>
          </label>

          {options.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-light" aria-label="Completions">
              {options.map((o) => (
                <li key={o}>
                  <button
                    type="button"
                    className="hover:inverse"
                    onClick={() => {
                      const tokens = value.split(/\s+/);
                      tokens[tokens.length - 1] = o;
                      replaceValue(tokens.join(" ") + (o.endsWith("/") ? "" : " "));
                      setOptions([]);
                      inputRef.current?.focus();
                    }}
                  >
                    {o}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p id="terminal-help" className="sr-only">
        Command line. Type help and press Enter to list commands.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>
    </section>
  );
}
