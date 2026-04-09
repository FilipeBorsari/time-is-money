# tempo é dinheiro - Extensão Chrome

Extensão do Chrome que converte preços em R$ para o tempo de trabalho necessário para comprá-los.

## Funcionalidades

- 🕐 Converte automaticamente preços em qualquer site para horas/dias/semanas de trabalho
- ⚙️ Configuração personalizada do salário líquido mensal
- 🌐 Funciona em todos os sites brasileiros com preços em R$
- 📊 Formato inteligente: horas → dias+horas → semanas+dias+horas

## Como usar

1. Clone este repositório
2. Abra o Chrome e vá para `chrome://extensions/`
3. Ative o "Modo do desenvolvedor"
4. Clique em "Carregar sem compactação"
5. Selecione a pasta da extensão
6. Clique no ícone da extensão e configure seu salário líquido mensal
7. Navegue em sites de e-commerce e veja os preços convertidos em tempo!

## Exemplo

Se você configurou um salário de R$ 3.000/mês:
- R$ 150,00 → **11 horas**
- R$ 600,00 → **2 dias 4 horas**
- R$ 6.000,00 → **2 semanas 2 dias 16 horas**

## Estrutura do Projeto

```
chrome-extensao/
├── manifest.json          # Configuração da extensão
├── popup/                 # Interface de configuração
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/              # Scripts executados nas páginas
│   └── price-detector.js
├── utils/                # Utilitários
│   ├── calculator.js     # Lógica de conversão
│   └── storage.js        # Gerenciamento de armazenamento
├── styles/               # Estilos CSS
│   └── injected.css
└── assets/               # Ícones e imagens
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Licença

MIT
