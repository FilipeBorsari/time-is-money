/**
 * Utilitário para gerenciar armazenamento da extensão
 */

const StorageHelper = {
  /**
   * Carrega as configurações do usuário
   * @returns {Promise<{monthlySalary: number, enabled: boolean}>}
   */
  async getSettings() {
    try {
      const data = await chrome.storage.sync.get(['monthlySalary', 'enabled', 'workHoursPerDay']);
      return {
        monthlySalary: data.monthlySalary || 0,
        enabled: data.enabled !== false, // default true
        workHoursPerDay: data.workHoursPerDay || 8 // default 8h
      };
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return { monthlySalary: 0, enabled: true, workHoursPerDay: 8 };
    }
  },

  /**
   * Salva as configurações do usuário
   * @param {number} monthlySalary - Salário mensal líquido
   * @param {boolean} enabled - Se a extensão está ativa
   */
  async saveSettings(monthlySalary, enabled, workHoursPerDay) {
    try {
      await chrome.storage.sync.set({ monthlySalary, enabled, workHoursPerDay });
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  },

  /**
   * Escuta mudanças nas configurações
   * @param {Function} callback - Função chamada quando há mudança
   */
  onSettingsChanged(callback) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        const settings = {};
        if (changes.monthlySalary) {
          settings.monthlySalary = changes.monthlySalary.newValue;
        }
        if (changes.enabled) {
          settings.enabled = changes.enabled.newValue;
        }
        if (changes.workHoursPerDay) {
          settings.workHoursPerDay = changes.workHoursPerDay.newValue;
        }
        if (Object.keys(settings).length > 0) {
          callback(settings);
        }
      }
    });
  }
};

