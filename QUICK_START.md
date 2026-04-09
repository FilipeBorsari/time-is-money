# ⚡ Quick Start

## Instalação Rápida (2 minutos)

1. **Abra o Chrome** e vá para: `chrome://extensions/`

2. **Ative "Modo do desenvolvedor"** (toggle no canto superior direito)

3. **Clique em "Carregar sem compactação"**

4. **Selecione esta pasta**: `/home/filipeborsari/chrome-extensao`

5. **Configure o salário**:
   - Clique no ícone da extensão (⏱️)
   - Digite seu salário mensal (ex: 3000)
   - Clique em "Salvar Configurações"

6. **Teste**:
   - Abra `test-page.html` no Chrome
   - OU visite: https://www.mercadolivre.com.br/
   - Você verá badges verdes ⏱️ ao lado dos preços!

## Como Funciona

A extensão automaticamente:
- ✅ Detecta preços em R$ em qualquer site
- ✅ Calcula horas de trabalho necessárias
- ✅ Mostra badge verde ao lado do preço
- ✅ Atualiza quando a página carrega conteúdo dinâmico

## Exemplo de Cálculo

**Salário configurado**: R$ 3.000/mês (≈ R$ 13,64/hora)

| Preço no Site | Badge Mostrado |
|---------------|----------------|
| R$ 89,90 | ⏱️ 6,6 horas |
| R$ 249,99 | ⏱️ 1 dia 8,3 horas |
| R$ 599,00 | ⏱️ 2 dias 3,9 horas |
| R$ 3.899,00 | ⏱️ 1 semana 3 dias 5,7 horas |
| R$ 8.990,00 | ⏱️ 2 semanas 4 dias 5,9 horas |

## Solução Rápida de Problemas

**Não vejo os badges?**
1. Verifique se configurou o salário
2. Confirme que o toggle está verde (ativado)
3. Recarregue a página (F5)

**Quer desativar temporariamente?**
- Clique no ícone da extensão
- Toggle para "desativado"

## Arquivos Principais

```
chrome-extensao/
├── manifest.json          # Configuração da extensão
├── popup/                 # Interface de configuração
│   ├── popup.html         # Formulário de salário
│   ├── popup.css          # Estilos da popup
│   └── popup.js           # Lógica da popup
├── content/               # Script executado nas páginas
│   └── price-detector.js  # Detector de preços
├── utils/                 # Utilitários
│   ├── calculator.js      # Cálculo de conversão
│   └── storage.js         # Gerenciamento de dados
├── styles/                # Estilos injetados
│   └── injected.css       # Estilos dos badges
├── assets/                # Ícones
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── test-page.html         # Página de teste
└── INSTALACAO.md          # Guia completo
```

## Documentação Completa

Para mais detalhes, consulte:
- **[INSTALACAO.md](INSTALACAO.md)** - Guia detalhado com troubleshooting
- **[README.md](README.md)** - Visão geral do projeto

---

**Versão**: 1.0.0  
**Desenvolvido em**: Abril 2026
