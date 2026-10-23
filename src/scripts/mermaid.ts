import mermaid from "mermaid";

const m = (mermaid as any).default ?? mermaid;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function renderMermaidDiagrams() {
  const blocks = document.querySelectorAll<HTMLElement>("[data-mermaid-block]");
  if (!blocks.length) return;

  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const isDark = currentTheme === "dark";

  try {
    m.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-app, system-ui, sans-serif)",
      themeVariables: {
        fontSize: "14px",
        darkMode: isDark,
      },
    });
  } catch (initErr) {
    console.warn("Failed to initialize Mermaid:", initErr);
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const codeEl = block.querySelector<HTMLElement>(".mermaid-src");
    const targetEl = block.querySelector<HTMLElement>(".mermaid-render-target");
    if (!codeEl || !targetEl) continue;

    const rawCode = (codeEl.textContent || "").trim();
    if (!rawCode) {
      targetEl.innerHTML = "";
      continue;
    }

    const uniqueId = `mermaid-svg-${i}-${Date.now().toString(36)}`;

    try {
      const { svg } = await m.render(uniqueId, rawCode);
      targetEl.innerHTML = svg;
      block.setAttribute("data-rendered", "true");
    } catch (err: any) {
      console.warn("Mermaid diagram rendering error for diagram index", i, err);
      block.setAttribute("data-rendered", "error");
      targetEl.innerHTML = `
        <div class="mermaid-fallback-box w-full max-w-2xl mx-auto my-4 p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10 text-left text-sm">
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold mb-2">
            <svg class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>Diagram Syntax Notice</span>
          </div>
          <p class="text-xs text-muted-foreground mb-3">The diagram syntax could not be visually rendered. Fenced diagram source is preserved below:</p>
          <pre class="bg-black/10 dark:bg-black/30 text-foreground p-3 rounded text-xs font-mono overflow-x-auto whitespace-pre">${escapeHtml(rawCode)}</pre>
        </div>
      `;
    }
  }
}

// Automatically render on DOM ready and after Astro page transitions
if (typeof window !== "undefined") {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    renderMermaidDiagrams();
  }
  document.addEventListener("DOMContentLoaded", () => renderMermaidDiagrams());
  document.addEventListener("astro:page-load", () => renderMermaidDiagrams());
  document.addEventListener("astro:after-swap", () => renderMermaidDiagrams());

  // Also re-render if theme toggled
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.attributeName === "data-theme") {
        renderMermaidDiagrams();
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
}
