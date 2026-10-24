import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://erchetansoni.github.io",
    title: "Chetan Soni | Cloud & DevOps Engineering",
    description: "Lead DevOps Engineer, Cloud Platform Specialist & Gen-AI practitioner. Technical insights on Kubernetes, Multi-Cloud Architecture, Terraform, CI/CD and Platform Engineering.",
    author: "Chetan Soni",
    profile: "https://erchetansoni.github.io/about/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Kolkata",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/ErChetanSoni" },
    { name: "linkedin", url: "https://www.linkedin.com/in/sonichetan/" },
    { name: "mail", url: "mailto:ErChetanSoni@gmail.com" },
    { name: "whatsapp", url: "https://wa.me/+919770325511" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});