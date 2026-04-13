import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // ── Data ──────────────────────────────────────────────
      projects: [],
      agents: [],
      automations: [],
      users: [],

      // ── Project actions ───────────────────────────────────
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: crypto.randomUUID(),
              name: '',
              description: '',
              status: 'planned',
              type: 'web-app',
              stack: [],
              team: [],
              repo: '',
              database: 'None',
              startDate: new Date().toISOString().split('T')[0],
              endDate: null,
              costSpent: 0,
              monthlyRecurring: 0,
              valueGenerated: 0,
              notes: '',
              createdAt: new Date().toISOString(),
              ...project,
            },
          ],
        })),

      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // ── Agent actions ─────────────────────────────────────
      addAgent: (agent) =>
        set((state) => ({
          agents: [
            ...state.agents,
            {
              id: crypto.randomUUID(),
              name: '',
              description: '',
              status: 'planned',
              platform: 'Custom',
              model: '',
              hostingLocation: '',
              monthlyCost: 0,
              monthlyRevenue: 0,
              activeUsers: 0,
              repo: '',
              stack: [],
              team: [],
              notes: '',
              createdAt: new Date().toISOString(),
              ...agent,
            },
          ],
        })),

      updateAgent: (id, data) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),

      deleteAgent: (id) =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
        })),

      // ── Automation actions ────────────────────────────────
      addAutomation: (automation) =>
        set((state) => ({
          automations: [
            ...state.automations,
            {
              id: crypto.randomUUID(),
              name: '',
              description: '',
              status: 'planned',
              platform: 'Other',
              trigger: '',
              frequency: 'on-demand',
              monthlyCost: 0,
              monthlyTimeSaved: 0,
              connectedServices: [],
              owner: '',
              notes: '',
              createdAt: new Date().toISOString(),
              ...automation,
            },
          ],
        })),

      updateAutomation: (id, data) =>
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),

      deleteAutomation: (id) =>
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        })),

      // ── Language ─────────────────────────────────────────
      language: "TR",
      setLanguage: (lang) => set({ language: lang }),

      // ── Account profile ───────────────────────────────────
      userProfile: {
        firstName: "Cenk",
        lastName: "Şayli",
        email: "cenk.sayli@tiryaki.com.tr",
        username: "cenk.sayli",
      },
      updateUserProfile: (data) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...data },
        })),

      // ── User actions ─────────────────────────────────────
      setUsers: (users) => set({ users }),

      addUser: (user) =>
        set((state) => ({
          users: [{ id: Math.max(0, ...state.users.map((u) => u.id)) + 1, ...user }, ...state.users],
        })),

      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
    }),
    {
      name: 'tyro-ops-store-v2',
    }
  )
);

export { useStore };
export default useStore;
