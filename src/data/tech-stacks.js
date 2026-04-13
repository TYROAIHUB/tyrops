// Tech stack definitions grouped by category — icons from @iconify/react (logos / simple-icons sets)
export const TECH_STACK_GROUPS = [
  {
    group: "Frontend",
    items: [
      { value: "React",           label: "React",             icon: "logos:react",                  bg: "#20232a" },
      { value: "Next.js",         label: "Next.js",           icon: "logos:nextjs-icon",             bg: "#000000" },
      { value: "Vue.js",          label: "Vue.js",            icon: "logos:vue",                    bg: "#2c3e50" },
      { value: "Angular",         label: "Angular",           icon: "logos:angular-icon",           bg: "#ffffff" },
      { value: "Svelte",          label: "Svelte",            icon: "logos:svelte-icon",            bg: "#ffffff" },
      { value: "TypeScript",      label: "TypeScript",        icon: "logos:typescript-icon",        bg: "#3178C6" },
      { value: "JavaScript",      label: "JavaScript",        icon: "logos:javascript",             bg: "#F7DF1E" },
      { value: "Tailwind CSS",    label: "Tailwind CSS",      icon: "logos:tailwindcss-icon",       bg: "#ffffff" },
      { value: "Vite",            label: "Vite",              icon: "logos:vitejs",                 bg: "#ffffff" },
      { value: "Webpack",         label: "Webpack",           icon: "logos:webpack",                bg: "#ffffff" },
    ],
  },
  {
    group: "UI & Design",
    items: [
      { value: "shadcn/ui",       label: "shadcn/ui",         icon: null,                           bg: "#000000", abbr: "SH" },
      { value: "HeroUI",          label: "HeroUI / NextUI",   icon: null,                           bg: "#7928CA", abbr: "HU" },
      { value: "Material UI",     label: "Material UI",       icon: "logos:material-ui",            bg: "#ffffff" },
      { value: "Ant Design",      label: "Ant Design",        icon: "logos:ant-design",             bg: "#ffffff" },
      { value: "Chakra UI",       label: "Chakra UI",         icon: "logos:chakra-ui",              bg: "#ffffff" },
      { value: "Framer Motion",   label: "Framer Motion",     icon: "logos:framer",                 bg: "#000000" },
      { value: "Lucide React",    label: "Lucide React",      icon: null,                           bg: "#f97316", abbr: "LR" },
    ],
  },
  {
    group: "State & Data",
    items: [
      { value: "Zustand",         label: "Zustand",           icon: null,                           bg: "#433E38", abbr: "ZS" },
      { value: "Redux",           label: "Redux",             icon: "logos:redux",                  bg: "#764ABC" },
      { value: "React Query",     label: "React Query",       icon: "logos:react-query-icon",       bg: "#ffffff" },
      { value: "SWR",             label: "SWR",               icon: null,                           bg: "#000000", abbr: "SW" },
      { value: "Apollo",          label: "Apollo Client",     icon: "logos:apollostack",            bg: "#311C87" },
      { value: "Zod",             label: "Zod",               icon: null,                           bg: "#3E67B1", abbr: "ZD" },
      { value: "React Hook Form", label: "React Hook Form",   icon: null,                           bg: "#EC5990", abbr: "RF" },
    ],
  },
  {
    group: "Backend",
    items: [
      { value: "Node.js",         label: "Node.js",           icon: "logos:nodejs-icon",            bg: "#ffffff" },
      { value: "Python",          label: "Python",            icon: "logos:python",                 bg: "#ffffff" },
      { value: "FastAPI",         label: "FastAPI",           icon: "logos:fastapi-icon",           bg: "#ffffff" },
      { value: "Django",          label: "Django",            icon: "logos:django-icon",            bg: "#092E20" },
      { value: "Flask",           label: "Flask",             icon: "logos:flask",                  bg: "#ffffff" },
      { value: ".NET",            label: ".NET",              icon: "logos:dotnet",                 bg: "#ffffff" },
      { value: ".NET 8",          label: ".NET 8",            icon: "logos:dotnet",                 bg: "#ffffff" },
      { value: "Go",              label: "Go",                icon: "logos:go",                     bg: "#ffffff" },
      { value: "Java",            label: "Java",              icon: "logos:java",                   bg: "#ffffff" },
      { value: "Rust",            label: "Rust",              icon: "logos:rust",                   bg: "#ffffff" },
      { value: "Spring Boot",     label: "Spring Boot",       icon: "logos:spring-icon",            bg: "#ffffff" },
    ],
  },
  {
    group: "Database",
    items: [
      { value: "PostgreSQL",      label: "PostgreSQL",        icon: "logos:postgresql",             bg: "#ffffff" },
      { value: "MySQL",           label: "MySQL",             icon: "logos:mysql",                  bg: "#ffffff" },
      { value: "MongoDB",         label: "MongoDB",           icon: "logos:mongodb-icon",           bg: "#ffffff" },
      { value: "Redis",           label: "Redis",             icon: "logos:redis",                  bg: "#ffffff" },
      { value: "SQL Server",      label: "SQL Server",        icon: "logos:microsoft-sql-server",   bg: "#CC2927" },
      { value: "SQLite",          label: "SQLite",            icon: "logos:sqlite",                 bg: "#ffffff" },
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      { value: "Docker",          label: "Docker",            icon: "logos:docker-icon",            bg: "#ffffff" },
      { value: "Kubernetes",      label: "Kubernetes",        icon: "logos:kubernetes",             bg: "#ffffff" },
      { value: "AWS",             label: "AWS",               icon: "logos:aws",                    bg: "#232F3E" },
      { value: "Azure",           label: "Azure",             icon: "logos:microsoft-azure",        bg: "#ffffff" },
      { value: "GCP",             label: "GCP",               icon: "logos:google-cloud",           bg: "#ffffff" },
      { value: "GitHub Actions",  label: "GitHub Actions",    icon: "logos:github-actions",         bg: "#ffffff" },
      { value: "GitHub Pages",    label: "GitHub Pages",      icon: "logos:github-icon",            bg: "#000000" },
      { value: "Vercel",          label: "Vercel",            icon: "logos:vercel-icon",            bg: "#000000" },
    ],
  },
  {
    group: "Integration & API",
    items: [
      { value: "GraphQL",         label: "GraphQL",           icon: "logos:graphql",                bg: "#ffffff" },
      { value: "REST API",        label: "REST API",          icon: "logos:openapi-icon",           bg: "#6BA539" },
      { value: "gRPC",            label: "gRPC",              icon: null,                           bg: "#244C5A", abbr: "gR" },
      { value: "SAP RFC",         label: "SAP RFC",           icon: "logos:sap",                    bg: "#ffffff" },
      { value: "Azure MSAL",      label: "Azure MSAL",        icon: "logos:microsoft-azure",        bg: "#0078D4" },
      { value: "i18next",         label: "i18next",           icon: null,                           bg: "#26A69A", abbr: "i18" },
    ],
  },
  {
    group: "Other",
    items: [
      { value: "Recharts",        label: "Recharts",          icon: null,                           bg: "#22C55E", abbr: "RC" },
      { value: "D3.js",           label: "D3.js",             icon: "logos:d3",                     bg: "#ffffff" },
      { value: "ExcelJS",         label: "ExcelJS",           icon: null,                           bg: "#217346", abbr: "XL" },
      { value: "dnd-kit",         label: "dnd-kit",           icon: null,                           bg: "#7C3AED", abbr: "DN" },
      { value: "Prisma",          label: "Prisma",            icon: "logos:prisma",                 bg: "#000000" },
    ],
  },
]

// Flat array for lookup
export const TECH_STACKS = TECH_STACK_GROUPS.flatMap((g) => g.items)

export const getTechByValue = (value) =>
  TECH_STACKS.find((t) => t.value === value) ?? {
    value,
    label: value,
    icon: null,
    bg: "#e5e7eb",
    abbr: value.slice(0, 2).toUpperCase(),
  }
