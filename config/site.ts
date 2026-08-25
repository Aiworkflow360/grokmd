export const site = {
  name: "grokmd",
  tagline: "Minds you install.",
  description:
    "Twenty open-source GROK.md files that give Grok Bot a named teammate with a real voice. Free, forkable, not affiliated with xAI.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://grokmd.vercel.app",
  xHandle: process.env.NEXT_PUBLIC_X_HANDLE || "grokmd",
  repo: {
    owner: process.env.NEXT_PUBLIC_REPO_OWNER || "Aiworkflow360",
    name: process.env.NEXT_PUBLIC_REPO_NAME || "grokmd",
    branch: "main",
  },
  footer: "Built for Grok Bot. Not affiliated with xAI.",
};

export const repoUrl = `https://github.com/${site.repo.owner}/${site.repo.name}`;

export function blobUrl(path: string) {
  return `${repoUrl}/blob/${site.repo.branch}/${path}`;
}

export function rawUrl(path: string) {
  return `https://raw.githubusercontent.com/${site.repo.owner}/${site.repo.name}/${site.repo.branch}/${path}`;
}

export function followUrl() {
  return `https://x.com/intent/follow?screen_name=${site.xHandle}`;
}

export function tweetUrl(text: string, url: string) {
  const params = new URLSearchParams({ text, url });
  return `https://x.com/intent/tweet?${params.toString()}`;
}
