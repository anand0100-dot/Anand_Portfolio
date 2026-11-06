/*
  ─────────────────────────────────────────────────────────────
  PORTFOLIO CONTENT — edit this file to change anything on the site.
  Saari details yahin se badlo; index.html / script.js chhune ki zaroorat nahi.
  ─────────────────────────────────────────────────────────────
*/
window.PORTFOLIO = {
  name: "Anand Tiwari",
  firstName: "Anand",
  initials: "AT",
  role: "DevOps Engineer",
  tagline: "MCA — Cloud Computing · AWS · Linux · DevOps",

  // Optional media (see README.md). Leave "" if you don't have it yet.
  heroVideo: "assets/hero.mp4", // 3D character intro video — auto-used if the file exists
  heroImage: "assets/anand-cutout.webp", // real photo (2x sharpened, background removed) shown in the hero; "" = illustrated character
  photo: "assets/anand-photo.webp",      // sharpened photo on the Developer ID card ("" = illustrated avatar)
  resume: "",                   // e.g. "assets/resume.pdf" — Resume buttons appear when set

  github: "https://github.com/anand0100-dot",
  githubUser: "anand0100-dot",  // used to fetch the live repository count
  linkedin: "",                 // e.g. "https://www.linkedin.com/in/your-handle"
  email: "",                    // e.g. "you@example.com"
  formEndpoint: "https://formspree.io/f/mbdzapov", // contact form (from Anand's earlier portfolio)

  about: {
    lead:
      "MCA student specialising in Cloud Computing. I like taking an app all the way from code to cloud — containerising it with Docker, wrapping it in a Jenkins pipeline and running it on Linux and AWS.",
    more:
      "I work across cloud, CI/CD and full-stack web, and I learn by building in public — 38 repositories and counting.",
  },

  idCard: { id: "AT-0001", dept: "MCA · Cloud", valid: "2027", issued: "Portfolio · 2026" },

  facts: [
    ["Based in", "India"],
    ["Studying", "MCA — Cloud Computing"],
    ["Batch", "2025 – 2027"],
    ["Focus", "AWS · Linux · DevOps"],
    ["Building", "CI/CD pipelines · Docker"],
  ],
  quote: "From the first commit to the last deploy.",

  /* ── Skills: "periodic table" ──
     Families are in order of importance: the first family gets the darkest tiles.
     The table uses 8 columns, or 7 when that fills the last row better (e.g. 27 skills → rows of 7, 7, 7, 6).
     f = family id, icon = devicon path (optional) */
  families: [
    { id: "cloud", name: "Cloud & DevOps" },
    { id: "lang", name: "Languages" },
    { id: "front", name: "Frontend" },
    { id: "db", name: "Databases" },
    { id: "core", name: "Core" },
  ],
  elements: [
    { s: "Aw", n: "AWS", f: "cloud", icon: "amazonwebservices/amazonwebservices-original-wordmark" },
    { s: "Lx", n: "Linux", f: "cloud", icon: "linux/linux-original" },
    { s: "Dk", n: "Docker", f: "cloud", icon: "docker/docker-original" },
    { s: "Jk", n: "Jenkins", f: "cloud", icon: "jenkins/jenkins-original" },
    { s: "Ng", n: "Nginx", f: "cloud", icon: "nginx/nginx-original" },
    { s: "Sh", n: "Bash / Shell", f: "cloud", icon: "bash/bash-original" },
    { s: "Gt", n: "Git", f: "cloud", icon: "git/git-original" },
    { s: "Gh", n: "GitHub", f: "cloud", icon: "github/github-original" },
    { s: "Py", n: "Python", f: "lang", icon: "python/python-original" },
    { s: "Js", n: "JavaScript", f: "lang", icon: "javascript/javascript-original" },
    { s: "Jv", n: "Java", f: "lang", icon: "java/java-original" },
    { s: "C++", n: "C / C++", f: "lang", icon: "cplusplus/cplusplus-original" },
    { s: "Ts", n: "TypeScript", f: "lang", icon: "typescript/typescript-original" },
    { s: "Ht", n: "HTML5", f: "front", icon: "html5/html5-original" },
    { s: "Cs", n: "CSS3", f: "front", icon: "css3/css3-original" },
    { s: "Sq", n: "SQL", f: "db" },
    { s: "Mg", n: "MongoDB", f: "db", icon: "mongodb/mongodb-original" },
    { s: "Sb", n: "Supabase", f: "db", icon: "supabase/supabase-original" },
    { s: "Cc", n: "Cloud Computing", f: "core" },
    { s: "Ci", n: "CI/CD", f: "core" },
    { s: "Ds", n: "Data Structures", f: "core" },
    { s: "Al", n: "Algorithms", f: "core" },
    { s: "Op", n: "OOP", f: "core" },
    { s: "St", n: "Software Testing", f: "core" },
  ],

  /* ── Projects: "Things I've built." ── visual = arcade | food | quickcart | path | tests */
  projectsNote: "Five builds across DevOps, realtime and full-stack web. Hover a panel to open it.",
  projects: [
    {
      title: "Mini Arcade",
      short: "Mini Arcade",
      meta: "DevOps · Realtime · Web",
      desc: "Multiplayer browser games on Node.js, Express and Socket.IO — shipped through a Jenkins pipeline that tests, containerises and health-checks every release.",
      points: ["4 realtime multiplayer games", "Socket.IO game rooms", "Jenkins CI/CD pipeline", "Dockerised behind Nginx"],
      tech: ["Node.js", "Express", "Socket.IO", "Docker", "Jenkins", "Nginx", "Node test runner"],
      repo: "https://github.com/anand0100-dot/mini-arcade",
      visual: "arcade",
    },
    {
      title: "Food Delivery System",
      short: "Food Delivery",
      meta: "Full stack · Web",
      desc: "A responsive food-ordering app with live search, multi-criteria menu filters, a cart and regex-validated forms, backed by an Express REST API.",
      points: ["Veg / cuisine / price filters", "Live cart with badge", "REST API for orders", "Postman-tested endpoints"],
      tech: ["JavaScript", "Bootstrap 5", "Node.js", "Express", "MongoDB", "Postman"],
      repo: "https://github.com/anand0100-dot/Food-delivery",
      visual: "food",
    },
    {
      title: "QuickCart",
      short: "QuickCart",
      meta: "E-commerce · Web",
      desc: "Browser-based grocery delivery app with product browsing, search and category filters, coupon offers and live order tracking — served by a Python HTTP server.",
      points: ["Search & category filters", "Coupon offers", "Live order tracking", "JSON product catalogue"],
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "Python", "JSON"],
      repo: "https://github.com/anand0100-dot/Quick-cart-online-shopping-",
      visual: "quickcart",
    },
    {
      title: "Dijkstra Path Finder",
      short: "Path Finder",
      meta: "Algorithms · Python",
      desc: "A shortest-route finder for the Varanasi region built on Dijkstra's algorithm — places become a weighted graph, and the cheapest path between any two falls out.",
      points: ["Weighted graph of places", "Dijkstra shortest path", "Distance & hop count", "Pure Python"],
      tech: ["Python", "Graphs", "Dijkstra", "DSA"],
      repo: "https://github.com/anand0100-dot/Dijkstra-s-Path-Finder---Varanasi-Region-",
      visual: "path",
    },
    {
      title: "Test Results Dashboard",
      short: "Test Dashboard",
      meta: "Software testing · Web",
      desc: "A UI dashboard that charts which test cases pass and which fail, with an Express + Axios backend feeding it results.",
      points: ["Pass / fail charts", "Suite-level breakdown", "Express API", "Axios data layer"],
      tech: ["JavaScript", "Node.js", "Express", "Axios", "Charts"],
      repo: "https://github.com/anand0100-dot/Software-testing-project",
      visual: "tests",
    },
  ],

  /* ── "Always learning." — swap these for real certifications whenever you have them ── */
  learningLabel: "Learning log",
  learningNote: "8 tracks across DevOps, cloud, web and core CS — mostly learned in public, on GitHub.",
  learning: [
    { t: "Jenkins & CI/CD pipelines", s: "Jenkinsfiles, SCM polling, staged builds", href: "https://github.com/anand0100-dot/jenkins-first" },
    { t: "Docker & containers", s: "Dockerfile, Nginx, candidate-container checks", href: "https://github.com/anand0100-dot/mini-arcade" },
    { t: "Git & GitHub workflows", s: "Branching, merging, practice repositories", href: "https://github.com/anand0100-dot/Git-and-GitHub-1" },
    { t: "Linux & AWS fundamentals", s: "Shell, EC2 instance setup and testing", href: "https://github.com/anand0100-dot" },
    { t: "Data structures in C++", s: "Technical training — Pathfinder", href: "https://github.com/anand0100-dot/Technical-training-path-finder-c-" },
    { t: "Software testing", s: "Node test runner, pass / fail dashboards", href: "https://github.com/anand0100-dot/Software-testing-project" },
    { t: "Realtime JavaScript", s: "Node.js, Express and Socket.IO", href: "https://github.com/anand0100-dot/mini-arcade" },
    { t: "Daily learning log", s: "Notes and exercises, committed regularly", href: "https://github.com/anand0100-dot/daily-learning" },
  ],

  /* ── "Education & experience." ── */
  journeyNote: "From the first repository to CI/CD pipelines — one year of building in public.",
  timeline: [
    {
      year: "2025",
      tag: "Education",
      title: "MCA — Cloud Computing",
      org: "Master of Computer Applications",
      dates: "2025 — 2027",
      points: ["Cloud computing, Linux and AWS foundations", "Java, data structures and software engineering"],
      chips: ["Cloud", "Linux", "AWS"],
    },
    {
      year: "2025",
      tag: "Milestone",
      title: "Started building in public",
      org: "GitHub · first repository",
      dates: "Oct 2025",
      points: ["Dijkstra Path Finder for the Varanasi region, in Python"],
      chips: ["Python", "Graphs"],
    },
    {
      year: "2026",
      tag: "Training",
      title: "Technical training & projects",
      org: "Coursework and labs",
      dates: "Jan — Jun 2026",
      points: ["C++ Pathfinder, a quiz app and a test-results dashboard", "Portfolio and e-commerce builds in HTML, CSS and JS"],
      chips: ["C++", "JavaScript", "Testing"],
    },
    {
      year: "2026",
      tag: "DevOps",
      title: "CI/CD & DevOps practice",
      org: "Self-driven",
      dates: "Jul — Nov 2026",
      points: ["Jenkins pipelines that test, build Docker images and deploy", "Shipped Mini Arcade, Food Delivery and QuickCart"],
      chips: ["Jenkins", "Docker", "Nginx"],
    },
  ],

  /* ── "Proud moments." ── icon: github | jenkins | game | code | calendar */
  achievements: [
    { icon: "github", title: "GitHub", label: "Public repositories", desc: "Projects, labs and daily practice — all in public.", value: 38, suffix: "+", live: "repos" },
    { icon: "jenkins", title: "Jenkins", label: "CI/CD pipelines", desc: "Pipelines that test, build Docker images and deploy.", value: 6, suffix: "+" },
    { icon: "game", title: "Mini Arcade", label: "Multiplayer games", desc: "Realtime browser games over Socket.IO rooms.", value: 4, suffix: "" },
    { icon: "code", title: "Polyglot", label: "Languages shipped", desc: "Python, JavaScript, TypeScript, Java and C++.", value: 5, suffix: "" },
    { icon: "calendar", title: "Building in public", label: "Year on GitHub", desc: "Committing steadily since October 2025.", value: 1, prefix: "Yr", suffix: "" },
  ],

  contactNote:
    "Open to cloud, DevOps and CI/CD internships, plus freelance builds and collaborations. Drop a message and I'll get back to you.",
};
