/**
 * Content Script - Detector e conversor de preços em tempo de trabalho
 */

(function() {
  'use strict';

  let settings = {
    monthlySalary: 0,
    enabled: true,
    workHoursPerDay: 8
  };

  let processedElements = new WeakSet();
  let injectedPoints = new WeakSet();
  
  const PRICE_REGEX = /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)/gi;

  /**
   * Verifica se a página atual é uma página de produto/e-commerce
   */
  function isProductPage() {
    // 1. Open Graph type = product
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType && ogType.getAttribute('content') === 'product') return true;

    // 2. JSON-LD com @type Product ou Offer
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (const script of jsonLdScripts) {
      try {
        const data = JSON.parse(script.textContent);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item['@type'] === 'Product' || item['@type'] === 'Offer') return true;
          if (item['@graph']) {
            for (const g of item['@graph']) {
              if (g['@type'] === 'Product' || g['@type'] === 'Offer') return true;
            }
          }
        }
      } catch (e) { /* JSON inválido, ignorar */ }
    }

    // 3. Indicadores comuns de página de produto
    const productSelectors = [
      '[class*="product-price"]',
      '[class*="productPrice"]',
      '[class*="product_price"]',
      '[class*="buy-button"]',
      '[class*="buyButton"]',
      '[class*="add-to-cart"]',
      '[class*="addToCart"]',
      '[id*="add-to-cart"]',
      '[class*="comprar"]',
      '[id*="comprar"]',
      '[data-testid*="product-price"]',
      '[data-testid*="add-to-cart"]',
    ];
    for (const selector of productSelectors) {
      if (document.querySelector(selector)) return true;
    }

    return false;
  }

  /**
   * Inicializa a extensão
   */
  async function init() {
    console.log('🕐 Preço em Tempo - Iniciando...');
    
    
    await loadSettings();
    
    if (!settings.enabled) {
      console.log('🕐 Preço em Tempo - Desabilitado');
      return;
    }
    
    if (!settings.monthlySalary || settings.monthlySalary <= 0) {
      console.log('🕐 Preço em Tempo - Salário não configurado');
      return;
    }

    processAllPrices();
    
    observeDOMChanges();
    
    console.log('🕐 Preço em Tempo - Ativo');
  }

  /**
   * Carrega configurações do Chrome Storage
   */
  async function loadSettings() {
    try {
      const data = await StorageHelper.getSettings();
      settings = data;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }

  function processAllPrices(root) {
    if (!settings.enabled || !settings.monthlySalary) {
      return;
    }

    const walker = document.createTreeWalker(
      root || document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          const parent = node.parentElement;
          if (!parent || 
              parent.tagName === 'SCRIPT' || 
              parent.tagName === 'STYLE' ||
              parent.tagName === 'NOSCRIPT' ||
              parent.classList.contains('price-time-injected') ||
              processedElements.has(parent)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          if (PRICE_REGEX.test(node.textContent)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToProcess = [];
    let node;
    
    while (node = walker.nextNode()) {
      nodesToProcess.push(node);
    }

    nodesToProcess.forEach(processTextNode);
  }

  function processTextNode(textNode) {
    const parent = textNode.parentElement;
    
    if (!parent || processedElements.has(parent)) {
      return;
    }

    const text = textNode.textContent;
    const matches = [...text.matchAll(PRICE_REGEX)];

    if (matches.length === 0) {
      return;
    }

    processedElements.add(parent);

    matches.forEach(match => {
      const priceText = match[0];
      const workTime = PriceCalculator.convertPriceToTime(priceText, settings.monthlySalary, settings.workHoursPerDay);
      
      if (workTime) {
        injectWorkTime(parent, priceText, workTime);
      }
    });
  }

  /**
   * Sobe na árvore DOM até encontrar um ancestral sem overflow:hidden,
   * para evitar que o badge seja cortado ou que desloque o preço original.
   */
  function findSafeInsertionPoint(element) {
    let target = element;
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (
        style.overflow === 'hidden' ||
        style.overflowX === 'hidden' ||
        style.overflowY === 'hidden'
      ) {
        target = parent;
        parent = parent.parentElement;
      } else {
        break;
      }
    }
    return target;
  }

  function injectWorkTime(element, priceText, workTime) {
    // Sobe até o ponto seguro de inserção (fora de containers com overflow:hidden)
    const insertionTarget = findSafeInsertionPoint(element);

    // Verifica se já foi injetado neste ponto de inserção
    if (injectedPoints.has(insertionTarget)) {
      return;
    }
    injectedPoints.add(insertionTarget);

    const badge = document.createElement('span');
    badge.className = 'price-time-badge';

    const icon = document.createElement('span');
    icon.className = 'price-time-icon';
    icon.textContent = '⏱️';

    const timeText = document.createElement('span');
    timeText.className = 'price-time-text';
    timeText.textContent = workTime;

    badge.appendChild(icon);
    badge.appendChild(timeText);
    badge.title = `Tempo de trabalho necessário para ${priceText}`;

    try {
      const computedStyle = window.getComputedStyle(insertionTarget);
      const isBlock = computedStyle.display === 'block' ||
                      computedStyle.display === 'flex' ||
                      computedStyle.display === 'grid';

      if (isBlock) {
        const wrapper = document.createElement('div');
        wrapper.className = 'price-time-wrapper';
        wrapper.appendChild(badge);
        insertionTarget.insertAdjacentElement('afterend', wrapper);
      } else {
        badge.style.marginLeft = '6px';
        insertionTarget.insertAdjacentElement('afterend', badge);
      }
    } catch (error) {
      console.error('Erro ao injetar badge:', error);
    }
  }

  function observeDOMChanges() {
    let timeoutId = null;
    const pendingNodes = new Set();
    
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            pendingNodes.add(node);
          }
        }
      }

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (!settings.enabled || !settings.monthlySalary) {
          pendingNodes.clear();
          return;
        }

        const nodesToProcess = [...pendingNodes];
        pendingNodes.clear();

        for (const node of nodesToProcess) {
          // Processa apenas nós ainda presentes no DOM
          if (document.body.contains(node)) {
            processAllPrices(node);
          }
        }
      }, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'settingsUpdated') {
      sendResponse({ success: true });
    }
  });

  StorageHelper.onSettingsChanged((newSettings) => {
    Object.assign(settings, newSettings);
    
    if (settings.enabled && settings.monthlySalary) {
      document.querySelectorAll('.price-time-badge, .price-time-wrapper').forEach(el => el.remove());
      processedElements = new WeakSet();
      injectedPoints = new WeakSet();
      processAllPrices();
    } else {
      document.querySelectorAll('.price-time-badge, .price-time-wrapper').forEach(el => el.remove());
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
