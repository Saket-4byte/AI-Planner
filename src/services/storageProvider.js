/**
 * StorageProvider abstracts data access for the workspace state.
 * Currently uses localStorage, making it cloud-ready for Firebase/Supabase migrations.
 */
export const StorageProvider = {
  loadWorkspace(username) {
    const nameKey = username.toLowerCase();
    const saved = localStorage.getItem(`saver_workspace_${nameKey}`);
    return saved ? JSON.parse(saved) : null;
  },

  saveWorkspace(username, workspace) {
    const nameKey = username.toLowerCase();
    const updatedWorkspace = {
      ...workspace,
      metadata: {
        ...workspace.metadata,
        updatedAt: new Date().toISOString(),
        lastSync: new Date().toISOString()
      }
    };
    localStorage.setItem(`saver_workspace_${nameKey}`, JSON.stringify(updatedWorkspace));
    localStorage.setItem('saver_current_user', username);
    return updatedWorkspace;
  },

  deleteWorkspace(username) {
    const nameKey = username.toLowerCase();
    localStorage.removeItem(`saver_workspace_${nameKey}`);
    if (localStorage.getItem('saver_current_user') === username) {
      localStorage.removeItem('saver_current_user');
    }
  },

  getCurrentUser() {
    return localStorage.getItem('saver_current_user') || null;
  }
};
