"use client";

import { useSyncExternalStore } from "react";
import { HOME } from "./filesystem";
import type { Block } from "./types";

/**
 * Client-side terminal session. Lives at module scope so the transcript survives
 * switching to Portfolio and back within the same tab. Only command history is
 * persisted (sessionStorage), never anything personal.
 */

export interface Entry {
  id: number;
  /** `null` marks output printed without a prompt line. */
  input: string | null;
  cwd: string;
  blocks: Block[];
}

interface SessionState {
  entries: Entry[];
  cwd: string;
  history: string[];
  announce: string;
}

const HISTORY_KEY = "fb:history";
const MAX_HISTORY = 50;

let nextId = 1;
let state: SessionState = { entries: [], cwd: HOME, history: loadHistory(), announce: "" };
const listeners = new Set<() => void>();
const serverState: SessionState = { entries: [], cwd: HOME, history: [], announce: "" };

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((h): h is string => typeof h === "string").slice(-MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function update(patch: Partial<SessionState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export const session = {
  get: () => state,

  push(entry: Omit<Entry, "id">, announce?: string) {
    update({ entries: [...state.entries, { ...entry, id: nextId++ }], announce: announce ?? state.announce });
  },

  clear() {
    update({ entries: [], announce: "Terminal cleared" });
  },

  setCwd(cwd: string) {
    update({ cwd });
  },

  remember(command: string) {
    if (!command || state.history[state.history.length - 1] === command) return;
    const history = [...state.history, command].slice(-MAX_HISTORY);
    update({ history });
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      /* storage unavailable */
    }
  },
};

export function useSession(): SessionState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => serverState,
  );
}
