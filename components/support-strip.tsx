"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "grokmd:signal";

/**
 * The file is never behind this. The strip asks once, remembers that you
 * answered, and then gets out of the way — a gate that hides the work would
 * defeat the point of publishing the work.
 */
export function SupportStrip({
  followHref,
  tweetHref,
  prompt,
}: {
  followHref: string;
  tweetHref: string;
  prompt: string;
}) {
  const [signalled, setSignalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setSignalled(window.localStorage.getItem(KEY) === "1");
    } catch {
      setSignalled(false);
    }
  }, []);

  const remember = useCallback(() => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      // A private window that refuses storage still gets the link. Fine.
    }
    setSignalled(true);
  }, []);

  if (mounted && signalled) {
    return (
      <div className="rounded-md border border-rule-soft bg-ink-850/60 px-4 py-3 text-sm text-paper-faint">
        Thanks — that&rsquo;s the whole business model. Nothing here was ever locked.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-rule-soft bg-ink-850/60 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-paper-dim">{prompt}</p>
      <div className="flex shrink-0 gap-2">
        <a
          href={followHref}
          target="_blank"
          rel="noreferrer"
          onClick={remember}
          className="rounded border border-rule bg-ink-800 px-3 py-1.5 text-sm text-paper-dim transition-colors hover:border-brass/60 hover:text-paper"
        >
          Follow
        </a>
        <a
          href={tweetHref}
          target="_blank"
          rel="noreferrer"
          onClick={remember}
          className="rounded border border-brass/60 bg-brass/10 px-3 py-1.5 text-sm text-brass transition-colors hover:bg-brass/20"
        >
          Post it
        </a>
      </div>
    </div>
  );
}
