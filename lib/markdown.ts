/**
 * A small markdown renderer for the subset this repo actually writes.
 *
 * Every file it renders is authored in-repo, so this trades generality for zero
 * dependencies and a build that cannot break on a transitive update. It escapes
 * HTML first, so a stray angle bracket in a mind file renders as text rather
 * than markup.
 */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ESCAPES[char]);
}

const CODE_SENTINEL = (index: number) => `@@GROKMD_CODE_${index}@@`;

function inline(value: string) {
  const codeSpans: string[] = [];
  let text = escapeHtml(value).replace(/`([^`]+)`/g, (_match, code: string) => {
    codeSpans.push(code);
    return CODE_SENTINEL(codeSpans.length - 1);
  });

  text = text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
      const safe = /^(https?:|\/|#|mailto:)/.test(href) ? href : "#";
      const external = /^https?:/.test(safe);
      return `<a href="${safe}"${external ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[\s(])_([^_\n]+)_/g, "$1<em>$2</em>");

  return text.replace(/@@GROKMD_CODE_(\d+)@@/g, (_m, index: string) => `<code>${codeSpans[Number(index)]}</code>`);
}

type ListState = { tag: "ul" | "ol"; items: string[] } | null;

export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let list: ListState = null;
  let paragraph: string[] = [];
  let quote: string[] = [];
  let fence: string[] | null = null;

  const closeParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const closeList = () => {
    if (list) {
      const items = list.items.map((item) => `<li>${inline(item)}</li>`).join("");
      out.push(`<${list.tag}>${items}</${list.tag}>`);
      list = null;
    }
  };
  const closeQuote = () => {
    if (quote.length) {
      out.push(`<blockquote>${renderMarkdown(quote.join("\n"))}</blockquote>`);
      quote = [];
    }
  };
  const closeAll = () => {
    closeParagraph();
    closeList();
    closeQuote();
  };

  for (const line of lines) {
    if (fence) {
      if (line.trim().startsWith("```")) {
        out.push(`<pre><code>${escapeHtml(fence.join("\n"))}</code></pre>`);
        fence = null;
      } else {
        fence.push(line);
      }
      continue;
    }

    if (/^```/.test(line.trim())) {
      closeAll();
      fence = [];
      continue;
    }

    if (!line.trim()) {
      closeAll();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      closeAll();
      const level = Math.min(heading[1].length + 1, 6);
      out.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      continue;
    }

    if (/^(\*\*\*|---|___)\s*$/.test(line.trim())) {
      closeAll();
      out.push("<hr />");
      continue;
    }

    const blockquote = /^>\s?(.*)$/.exec(line);
    if (blockquote) {
      closeParagraph();
      closeList();
      quote.push(blockquote[1]);
      continue;
    }
    closeQuote();

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      closeParagraph();
      if (!list || list.tag !== "ul") {
        closeList();
        list = { tag: "ul", items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (numbered) {
      closeParagraph();
      if (!list || list.tag !== "ol") {
        closeList();
        list = { tag: "ol", items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }

    closeList();
    paragraph.push(line.trim());
  }

  if (fence) out.push(`<pre><code>${escapeHtml(fence.join("\n"))}</code></pre>`);
  closeAll();
  return out.join("\n");
}
