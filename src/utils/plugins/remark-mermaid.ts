import { visit } from "unist-util-visit";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function remarkMermaid() {
  return (tree: any) => {
    visit(tree, "code", (node: any, index?: number, parent?: any) => {
      if (node.lang === "mermaid" && typeof index === "number" && parent) {
        const rawCode = node.value ?? "";
        parent.children.splice(index, 1, {
          type: "html",
          value: `<div class="mermaid-block my-8 overflow-x-auto text-center" data-mermaid-block><div class="mermaid-src hidden" style="display:none">${escapeHtml(rawCode)}</div><div class="mermaid-render-target flex justify-center py-2"><span class="text-sm text-muted-foreground animate-pulse">Rendering diagram...</span></div></div>`,
        });
      }
    });
  };
}
