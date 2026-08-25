"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Variant = "primary" | "secondary";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors duration-150 select-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "border-brass/70 bg-brass/15 text-brass hover:bg-brass/25 active:bg-brass/30",
  secondary:
    "border-rule bg-ink-800/70 text-paper-dim hover:border-rule hover:bg-ink-700 hover:text-paper",
};

/**
 * Writes to the clipboard, with a hidden-textarea fallback because iOS Safari
 * refuses navigator.clipboard on some non-secure or older contexts — and the
 * whole promise of this site is that two taps on a phone gets you the file.
 */
async function writeToClipboard(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the textarea path
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

export function CopyButton({
  text,
  label,
  doneLabel = "Copied",
  variant = "primary",
  className = "",
}: {
  text: string;
  label: string;
  doneLabel?: string;
  variant?: Variant;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onClick = useCallback(async () => {
    const ok = await writeToClipboard(text);
    setState(ok ? "done" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  }, [text]);

  const face =
    state === "done" ? doneLabel : state === "failed" ? "Select it below instead" : label;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      aria-live="polite"
    >
      <span aria-hidden="true" className="font-mono text-xs opacity-70">
        {state === "done" ? "OK" : state === "failed" ? "!" : "⎘"}
      </span>
      {face}
    </button>
  );
}
