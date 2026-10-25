import { test, expect } from "@playwright/test";

test.describe("Modern Personal Blog & Portfolio E2E Test Suite", () => {
  test("1. Homepage loads with correct branding, verified profile, and content sections", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Chetan Soni/i);

    // Hero intro headline
    const heading = page.locator("main h1").first();
    await expect(heading).toContainText("Architecting resilient cloud platforms");

    // Profile badge & Identity
    await expect(page.locator("text=Chetan Soni").first()).toBeVisible();
    await expect(page.locator("text=Lead DevOps").first()).toBeVisible();
    await expect(page.locator("text=Available for Leadership").first()).toBeVisible();

    // Hero Avatar image
    const avatar = page.locator('img[alt*="Chetan Soni"]').first();
    await expect(avatar).toBeVisible();

    // CTA links
    await expect(page.locator('a:has-text("Explore My Work")')).toBeVisible();
    await expect(page.locator('a:has-text("Résumé"), a:has-text("Resume")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Schedule Call")')).toBeVisible();

    // Proof points
    await expect(page.locator("text=Cloud Cost Reduction")).toBeVisible();
    await expect(page.locator("text=Multi-Region Uptime")).toBeVisible();

    // Key Content sections
    await expect(page.locator("#work")).toBeVisible();
    await expect(page.locator("text=Systems with receipts")).toBeVisible();

    await expect(page.locator("#skills")).toBeVisible();
    await expect(page.locator("text=Depth across the whole cloud stack")).toBeVisible();

    await expect(page.locator("#writing")).toBeVisible();
    await expect(page.locator("text=Field notes on production systems")).toBeVisible();

    await expect(page.locator("#experience")).toBeVisible();
    await expect(page.locator("text=Career progression & leadership")).toBeVisible();

    await expect(page.locator("#contact")).toBeVisible();
    await expect(page.locator("text=Let's build something")).toBeVisible();
  });

  test("2. About page loads and retains verified profile links and resume", async ({ page }) => {
    await page.goto("/about/");
    await expect(page).toHaveTitle(/About Me/i);

    // Verified profile details
    await expect(page.locator("text=Lead DevOps Engineer").first()).toBeVisible();
    await expect(page.locator("text=Bhopal, India").first()).toBeVisible();

    // Social and direct contact links inside main content
    await expect(page.locator('main a[href*="github.com/ErChetanSoni"]').first()).toBeVisible();
    await expect(page.locator('main a[href*="linkedin.com/in/sonichetan"]').first()).toBeVisible();
    await expect(page.locator('main a[href*="mailto:ErChetanSoni1@gmail.com"]').first()).toBeVisible();
    await expect(page.locator('main a[href*="t.me/ErChetanSoni"]').first()).toBeVisible();
    await expect(page.locator('main a[href*="calendar.app.google"]').first()).toBeVisible();

    // Resume download link verification
    const resumeLink = page.locator('a[href*="Resume%20DevOps.pdf"], a[href*="Resume DevOps.pdf"]').first();
    await expect(resumeLink).toBeVisible();

    // Verify resume static file is accessible
    const response = await page.request.get("/resume/CHETAN%20SONI%20Resume%20DevOps.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });

  test("3. Blog routes, Categories, Tags, and Projects pages work", async ({ page }) => {
    // Blog list
    await page.goto("/posts/");
    await expect(page.locator("main h1").first()).toContainText(/Posts|All Posts/i);
    const postCards = page.locator("li.my-6");
    expect(await postCards.count()).toBeGreaterThanOrEqual(1);

    // Reading time displayed on cards
    const cardReadingTime = postCards.first().locator(".reading-time");
    await expect(cardReadingTime).toBeVisible();
    await expect(cardReadingTime).toContainText(/min read/i);

    // Categories index
    await page.goto("/categories/");
    await expect(page.locator("main h1").first()).toContainText("Categories");
    await expect(page.locator('a[href*="/categories/kubernetes/"]').first()).toBeVisible();
    await expect(page.locator('a[href*="/categories/devops/"]').first()).toBeVisible();

    // Category detail page
    await page.goto("/categories/kubernetes/");
    await expect(page.locator("main h1").first()).toContainText("Category: Kubernetes");
    await expect(page.locator('a:has-text("Architecting Multi-Cloud Kubernetes at Scale")').first()).toBeVisible();

    // Tags index
    await page.goto("/tags/");
    await expect(page.locator("main h1").first()).toContainText("Tags");
    await expect(page.locator('a[href*="/tags/kubernetes/"]').first()).toBeVisible();

    // Tag detail page
    await page.goto("/tags/kubernetes/");
    await expect(page.locator("main h1").first()).toContainText("Tag: kubernetes");

    // Projects page
    await page.goto("/projects/");
    await expect(page.locator("main h1").first()).toContainText("Projects");
    await expect(page.locator("text=Particle41 DevOps Challenge").first()).toBeVisible();
    await expect(page.locator("text=Chaos Monkey").first()).toBeVisible();
  });

  test("4. Article page loads with TOC, syntax highlighting, and reading time", async ({ page }) => {
    await page.goto("/posts/multi-cloud-kubernetes-architecture/");
    await expect(page.locator("main h1").first()).toContainText("Architecting Multi-Cloud Kubernetes at Scale");

    // Reading time visible on article
    const articleReadingTime = page.locator(".reading-time");
    await expect(articleReadingTime).toBeVisible();
    await expect(articleReadingTime).toContainText(/min read/i);

    // Table of contents heading exists
    const tocHeading = page.locator("#table-of-contents");
    await expect(tocHeading).toBeVisible();

    // Expand TOC details
    const tocSummary = page.locator('summary:has-text("Table of contents")');
    await expect(tocSummary).toBeVisible();
    await tocSummary.click();
    const tocLink = page.locator('a[href*="#multi-cloud-architecture-overview"]').first();
    await expect(tocLink).toBeVisible();

    // Syntax-highlighted code block (YAML & Bash)
    const codeBlocks = page.locator("pre code");
    expect(await codeBlocks.count()).toBeGreaterThanOrEqual(1);
  });

  test("5. Mermaid renders valid diagram into SVG and handles invalid diagram gracefully", async ({
    page,
  }) => {

    await page.goto("/posts/resilient-diagrams-and-diagram-fallback/");
    await expect(page.locator("main h1").first()).toContainText("Testing Resilient Mermaid Diagrams and Error Handling");

    // Wait for client-side Mermaid rendering to finish
    await page.waitForFunction(() => {
      const blocks = document.querySelectorAll("[data-mermaid-block]");
      return blocks.length >= 2 && Array.from(blocks).every(b => b.hasAttribute("data-rendered"));
    }, { timeout: 15000 });

    const blocks = page.locator("[data-mermaid-block]");
    expect(await blocks.count()).toBe(2);

    // Block 1 (valid diagram): data-rendered="true" and contains rendered SVG
    const validBlock = blocks.nth(0);
    expect(await validBlock.getAttribute("data-rendered")).toBe("true");
    const svg = validBlock.locator("svg");
    await expect(svg).toBeVisible();

    // Block 2 (deliberately malformed diagram): data-rendered="error" and displays syntax notice banner
    const invalidBlock = blocks.nth(1);
    expect(await invalidBlock.getAttribute("data-rendered")).toBe("error");
    const notice = invalidBlock.locator(".mermaid-fallback-box");
    await expect(notice).toBeVisible();
    await expect(notice).toContainText("Diagram Syntax Notice");

    // Ensure entire page remains completely functional
    await expect(page.getByRole("heading", { name: "Expected Resilient Behavior" })).toBeVisible();
  });

  test("6. Search index works and returns published articles", async ({ page }) => {
    await page.goto("/search/");
    await expect(page.locator("main h1").first()).toContainText("Search");

    // Wait for Pagefind UI input
    const searchInput = page.locator(".pagefind-ui__search-input");
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // Type query
    await searchInput.fill("Kubernetes");
    await page.waitForTimeout(1000);

    // Verify search results exist and contain link to published post
    const resultLink = page.locator('.pagefind-ui__result-link[href*="multi-cloud-kubernetes-architecture"]');
    await expect(resultLink.first()).toBeVisible({ timeout: 10000 });
  });

  test("7. Draft articles are excluded from public lists, search, RSS, and sitemap", async ({
    page,
  }) => {
    // 1. Not in /posts/
    await page.goto("/posts/");
    const draftInPosts = page.locator("text=Draft: The Future of Internal Developer Platforms");
    expect(await draftInPosts.count()).toBe(0);

    // 2. Not in /search/
    await page.goto("/search/?q=Future+of+Internal+Developer");
    await page.waitForTimeout(1500);
    const draftInSearch = page.locator('.pagefind-ui__result-link:has-text("Internal Developer Platforms")');
    expect(await draftInSearch.count()).toBe(0);

    // 3. Not in /rss.xml
    const rssResponse = await page.request.get("/rss.xml");
    expect(rssResponse.status()).toBe(200);
    const rssText = await rssResponse.text();
    expect(rssText).not.toContain("Draft: The Future of Internal Developer Platforms");
    expect(rssText).toContain("Architecting Multi-Cloud Kubernetes at Scale");

    // 4. Not in /sitemap-0.xml or /sitemap-index.xml
    const sitemapResponse = await page.request.get("/sitemap-0.xml");
    if (sitemapResponse.status() === 200) {
      const sitemapText = await sitemapResponse.text();
      expect(sitemapText).not.toContain("draft-platform-engineering-roadmap");
      expect(sitemapText).toContain("multi-cloud-kubernetes-architecture");
    }
  });

  test("8. SEO metadata, canonical domain, and Open Graph tags are valid", async ({ page }) => {
    await page.goto("/posts/multi-cloud-kubernetes-architecture/");

    // Canonical link
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("https://erchetansoni.github.io/posts/multi-cloud-kubernetes-architecture");

    // Open Graph
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toContain("Architecting Multi-Cloud Kubernetes at Scale");

    const ogType = await page.locator('meta[property="og:type"]').getAttribute("content");
    expect(ogType).toBe("article");

    // JSON-LD schema
    const jsonLd = page.locator('script[type="application/ld+json"]');
    expect(await jsonLd.count()).toBeGreaterThanOrEqual(1);
    const schemaContent = await jsonLd.first().textContent();
    expect(schemaContent).toContain("BlogPosting");
    expect(schemaContent).toContain("Chetan Soni");
  });

  test("9. Theme toggle (light/dark mode) works and updates data-theme attribute", async ({ page }) => {
    await page.goto("/");

    const themeBtn = page.locator("#theme-btn");
    await expect(themeBtn).toBeVisible();

    const initialTheme = await page.locator("html").getAttribute("data-theme");
    await themeBtn.click();
    await page.waitForTimeout(300);

    const toggledTheme = await page.locator("html").getAttribute("data-theme");
    expect(toggledTheme).not.toBe(initialTheme);
  });

  test("10. Custom 404 page loads for non-existent route", async ({ page }) => {
    const response = await page.goto("/non-existent-route-404-test");
    expect(response?.status()).toBe(404);
    await expect(page.locator("main h1").first()).toContainText(/404|Page Not Found/i);
  });
});
