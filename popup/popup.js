// Elementos do DOM
const salaryInput = document.getElementById('salary');
const workHoursInput = document.getElementById('workHours');
const enabledToggle = document.getElementById('enabled');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

// Formatar entrada de moeda brasileira
function formatCurrency(value) {
  // Remove tudo exceto números
  let numbers = value.replace(/\D/g, '');
  
  if (!numbers) return '';
  
  // Converte para número e formata
  const amount = parseInt(numbers, 10) / 100;
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Parse valor formatado para número
function parseCurrency(formatted) {
  if (!formatted) return 0;
  // Remove pontos de milhar e substitui vírgula por ponto
  return parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0;
}

// Aplicar formatação enquanto digita
salaryInput.addEventListener('input', (e) => {
  const cursorPos = e.target.selectionStart;
  const oldLength = e.target.value.length;
  
  e.target.value = formatCurrency(e.target.value);
  
  // Ajustar posição do cursor
  const newLength = e.target.value.length;
  const diff = newLength - oldLength;
  e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
});

// Carregar configurações salvas
async function loadSettings() {
  try {
    const data = await chrome.storage.sync.get(['monthlySalary', 'enabled', 'workHoursPerDay']);

    if (data.monthlySalary) {
      salaryInput.value = data.monthlySalary.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    workHoursInput.value = data.workHoursPerDay || 8;

    enabledToggle.checked = data.enabled !== false; // default true
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
  }
}

// Salvar configurações
async function saveSettings() {
  const salaryValue = parseCurrency(salaryInput.value);
  const workHoursValue = parseInt(workHoursInput.value, 10);

  // Validação
  if (!salaryValue || salaryValue <= 0) {
    showStatus('Por favor, insira um salário válido', 'error');
    salaryInput.focus();
    return;
  }

  if (salaryValue > 1000000) {
    showStatus('Valor muito alto. Por favor, verifique.', 'error');
    return;
  }

  if (!workHoursValue || workHoursValue < 1 || workHoursValue > 16) {
    showStatus('Por favor, insira uma jornada entre 1 e 16 horas', 'error');
    workHoursInput.focus();
    return;
  }
  
  try {
    // Salvar no Chrome Storage
    await chrome.storage.sync.set({
      monthlySalary: salaryValue,
      enabled: enabledToggle.checked,
      workHoursPerDay: workHoursValue
    });

    showStatus('\u2713 Configurações salvas com sucesso!', 'success');

    // Notificar content scripts para recarregar
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'settingsUpdated',
        monthlySalary: salaryValue,
        enabled: enabledToggle.checked,
        workHoursPerDay: workHoursValue
      }).catch(() => {
        // Ignora erro se a tab não tem content script
      });
    }
    
  } catch (error) {
    console.error('Erro ao salvar:', error);
    showStatus('Erro ao salvar configurações', 'error');
  }
}

// Mostrar mensagem de status
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  
  setTimeout(() => {
    statusDiv.classList.add('hidden');
  }, 3000);
}

// Event listeners
saveButton.addEventListener('click', saveSettings);

salaryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    saveSettings();
  }
});

// Carregar configurações ao abrir popup
loadSettings();
