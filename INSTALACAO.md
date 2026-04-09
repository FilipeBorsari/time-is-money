# Guia de Instalação e Teste

## 📦 Instalação da Extensão

### Passo 1: Preparar o Chrome
1. Abra o Google Chrome
2. Digite `chrome://extensions/` na barra de endereços
3. Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)

### Passo 2: Carregar a Extensão
1. Clique em **"Carregar sem compactação"** (ou "Load unpacked")
2. Navegue até a pasta `/home/filipeborsari/chrome-extensao`
3. Selecione a pasta e clique em "Selecionar pasta"
4. A extensão "tempo é dinheiro" aparecerá na lista

### Passo 3: Fixar a Extensão (Opcional)
1. Clique no ícone de quebra-cabeça (🧩) na barra de ferramentas do Chrome
2. Encontre "tempo é dinheiro"
3. Clique no ícone de alfinete para fixá-la na barra

## ⚙️ Configuração Inicial

### Configurar Salário
1. Clique no ícone da extensão (⏱️) na barra de ferramentas
2. Digite seu salário líquido mensal no campo (exemplo: 3000)
3. O valor será formatado automaticamente (R$ 3.000,00)
4. Clique em **"Salvar Configurações"**
5. Você verá uma mensagem de confirmação em verde

### Toggle On/Off
- Use o botão de toggle na popup para ativar/desativar temporariamente
- A extensão permanece instalada, mas não processa preços quando desativada

## 🧪 Testando a Extensão

### Teste 1: Página de Teste Local
1. Abra o arquivo `test-page.html` no Chrome:
   - Clique com botão direito no arquivo
   - Selecione "Abrir com" > "Google Chrome"
   - Ou arraste o arquivo para uma janela do Chrome
2. Você deve ver badges verdes (⏱️) ao lado de cada preço
3. Clique em "Carregar Mais Produtos" para testar detecção dinâmica

### Teste 2: Sites Reais
Teste em sites brasileiros de e-commerce:

**Mercado Livre**
- URL: https://www.mercadolivre.com.br/
- Busque por qualquer produto
- Os preços devem mostrar os badges automaticamente

**Amazon Brasil**
- URL: https://www.amazon.com.br/
- Navegue por produtos
- Badges aparecerão nos resultados de busca e páginas de produto

**Magazine Luiza**
- URL: https://www.magazineluiza.com.br/
- Explore categorias e produtos
- Verifique se os badges aparecem

### Teste 3: Diferentes Valores
Com salário configurado de **R$ 3.000/mês** (~220h/mês = R$ 13,64/hora):

| Preço | Tempo Esperado | Explicação |
|-------|---------------|------------|
| R$ 89,90 | ~6,6 horas | Valores < 24h mostram apenas horas |
| R$ 249,99 | ~1 dia 8,3 horas | 24h-168h mostram dias + horas |
| R$ 599,00 | ~2 dias 3,9 horas | Formato dias + horas |
| R$ 3.899,00 | ~1 semana 3 dias 5,7 horas | >168h mostram semanas + dias + horas |
| R$ 8.990,00 | ~2 semanas 4 dias 5,9 horas | Formato completo |

## 🐛 Solução de Problemas

### Badges não aparecem
**Problema**: Não vejo badges verdes ao lado dos preços

**Soluções**:
1. Verifique se configurou o salário na popup
2. Confirme que o toggle está ATIVADO (verde)
3. Recarregue a página (F5 ou Ctrl+R)
4. Verifique o console do DevTools (F12) por erros
5. Tente em uma nova aba/janela

### Salário não salva
**Problema**: Configuração não persiste

**Soluções**:
1. Verifique permissões da extensão em `chrome://extensions/`
2. Certifique-se de clicar em "Salvar Configurações"
3. Aguarde a mensagem de confirmação verde
4. Tente desinstalar e reinstalar a extensão

### Badges em lugares errados
**Problema**: Badges aparecem em elementos não relacionados a preços

**Soluções**:
- Isso pode ocorrer em sites com formatação incomum
- A extensão usa regex para detectar padrões de R$
- Falsos positivos são esperados em alguns casos
- Versões futuras podem ter lista de seletores específicos por site

### Performance lenta
**Problema**: Página carrega devagar com a extensão

**Soluções**:
1. Desative temporariamente usando o toggle
2. A extensão usa throttling (500ms) para evitar sobrecarga
3. Em páginas com muitos elementos, pode haver pequeno delay inicial
4. Considere aumentar o debounce no código se necessário

## 📊 Verificação de Funcionamento

### Console do DevTools
Abra o console (F12 > Console) na página e procure por:

✅ Mensagens esperadas:
```
🕐 Preço em Tempo - Iniciando...
🕐 Preço em Tempo - Ativo (Salário: R$ 3000)
```

❌ Se ver:
```
🕐 Preço em Tempo - Desabilitado
🕐 Preço em Tempo - Salário não configurado
```
Significa que precisa configurar na popup.

### Inspecionar Badges
1. Clique com botão direito em um badge verde
2. Selecione "Inspecionar"
3. Verifique se tem classe `price-time-badge`
4. Confira os estilos CSS aplicados

### Chrome Storage
Verifique dados salvos:
1. Abra DevTools (F12)
2. Vá em "Application" > "Storage" > "Chrome Storage"
3. Procure por:
   - `monthlySalary`: seu valor configurado
   - `enabled`: true/false

## 🎯 Casos de Uso

### Exemplo Prático 1: Salário R$ 3.000
- **Preço**: R$ 300
- **Cálculo**: R$ 3.000/220h = R$ 13,64/h
- **Resultado**: R$ 300 / 13,64 = **22 horas**
- **Exibição**: "⏱️ 22,0 horas"

### Exemplo Prático 2: Salário R$ 5.000
- **Preço**: R$ 1.500
- **Cálculo**: R$ 5.000/220h = R$ 22,73/h
- **Resultado**: R$ 1.500 / 22,73 = **66 horas** = 6,6 dias
- **Exibição**: "⏱️ 6 dias 6,0 horas"

### Exemplo Prático 3: Salário R$ 10.000
- **Preço**: R$ 10.000
- **Cálculo**: R$ 10.000/220h = R$ 45,45/h
- **Resultado**: R$ 10.000 / 45,45 = **220 horas** = 4,4 semanas
- **Exibição**: "⏱️ 4 semanas 2 dias 0,0 horas"

## 📝 Notas Adicionais

### Cálculo de Horas
A extensão usa:
- **220 horas/mês**: Padrão conservador (~22 dias úteis × 10h)
- **10 horas/dia**: Inclui tempo produtivo
- **5 dias/semana**: Semana de trabalho padrão

### Limitações Conhecidas
1. Detecta apenas preços em formato brasileiro (R$)
2. Pode ter falsos positivos em textos com números formatados
3. Alguns sites com carregamento complexo podem precisar de refresh
4. Não funciona em iframes de outros domínios (limitação do Chrome)

### Próximas Melhorias Planejadas
- [ ] Configuração customizada de horas/mês
- [ ] Lista de sites favoritos
- [ ] Histórico de produtos visualizados
- [ ] Comparação de preços
- [ ] Exportação de dados
- [ ] Suporte a outras moedas

## 🆘 Suporte

Se encontrar bugs ou tiver sugestões:
1. Verifique primeiro este guia
2. Teste na página `test-page.html`
3. Verifique logs no console do DevTools
4. Documente o problema com screenshots
5. Informe qual site e qual preço não funcionou

## ✅ Checklist de Teste Completo

- [ ] Extensão instalada e visível em chrome://extensions/
- [ ] Salário configurado e salvo
- [ ] Toggle está verde (ativado)
- [ ] test-page.html mostra badges em todos os preços
- [ ] Botão "Carregar Mais" funciona e novos badges aparecem
- [ ] Testado em pelo menos 1 site real (Mercado Livre, Amazon, etc.)
- [ ] Badges têm visual verde com ícone ⏱️
- [ ] Hover nos badges mostra tooltip
- [ ] DevTools console mostra mensagem de ativação
- [ ] Mudança de salário atualiza badges (após refresh)
- [ ] Toggle off remove badges, toggle on reativa

---

**Versão**: 1.0.0  
**Data**: Abril 2026  
**Última atualização**: 08/04/2026
