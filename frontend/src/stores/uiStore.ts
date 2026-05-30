import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  newTaskModalOpen: boolean;
  prefilledDeadline: string;
  searchQuery: string;
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setSidebarOpen: (open: boolean) => void;
  openNewTaskModal: (prefilledDate?: string) => void;
  closeNewTaskModal: () => void;
  setPrefilledDeadline: (date: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  newTaskModalOpen: false,
  prefilledDeadline: '',
  searchQuery: '',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openNewTaskModal: (prefilledDate) => set({
    newTaskModalOpen: true,
    prefilledDeadline: prefilledDate || '',
  }),
  closeNewTaskModal: () => set({ newTaskModalOpen: false, prefilledDeadline: '' }),
  setPrefilledDeadline: (date) => set({ prefilledDeadline: date }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

