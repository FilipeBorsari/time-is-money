/**
 * Utilitário para cálculos de conversão de preço em tempo de trabalho (tempo é dinheiro)
 */

const PriceCalculator = {
  WORKING_DAYS_PER_MONTH: 22,
  DAYS_PER_WEEK: 5,
  DEFAULT_HOURS_PER_DAY: 8,

  /**
   * Parse preço em formato brasileiro para número
   * Aceita formatos: R$ 1.234,56 | R$1.234,56 | R$ 1234,56 | 1.234,56
   * @param {string} priceText - Texto contendo o preço
   * @returns {number|null} - Valor numérico ou null se inválido
   */
  parseBrazilianPrice(priceText) {
    if (!priceText || typeof priceText !== 'string') {
      return null;
    }

    // Remove espaços extras e normaliza
    let cleaned = priceText.trim();
    
    // Remove símbolo R$ e espaços
    cleaned = cleaned.replace(/R\$\s*/gi, '');
    
    // Remove pontos (separadores de milhar)
    cleaned = cleaned.replace(/\./g, '');
    
    // Substitui vírgula (separador decimal) por ponto
    cleaned = cleaned.replace(',', '.');
    
    // Tenta converter para número
    const value = parseFloat(cleaned);
    
    // Valida se é um número válido e positivo
    if (isNaN(value) || value <= 0) {
      return null;
    }
    
    // Valida range razoável (0.01 a 10.000.000)
    if (value < 0.01 || value > 10000000) {
      return null;
    }
    
    return value;
  },

  /**
   * Calcula horas de trabalho necessárias para determinado preço
   * @param {number} price - Preço do produto
   * @param {number} monthlySalary - Salário mensal líquido
   * @returns {number} - Horas de trabalho necessárias
   */
  calculateWorkHours(price, monthlySalary, workHoursPerDay) {
    if (!price || !monthlySalary || monthlySalary <= 0) {
      return 0;
    }

    const hoursPerDay = workHoursPerDay || this.DEFAULT_HOURS_PER_DAY;
    const hoursPerMonth = hoursPerDay * this.WORKING_DAYS_PER_MONTH;
    const hourlyRate = monthlySalary / hoursPerMonth;
    return price / hourlyRate;
  },

  /**
   * Formata horas em formato legível (horas/dias/semanas)
   * Formato: até 24h = "X horas"
   *          24h-168h = "X dias Y horas"
   *          >168h = "X semanas Y dias Z horas"
   * @param {number} hours - Número de horas
   * @returns {string} - Texto formatado
   */
  formatWorkTime(hours, workHoursPerDay) {
    if (!hours || hours <= 0) {
      return '0 horas';
    }

    const hoursPerDay = workHoursPerDay || this.DEFAULT_HOURS_PER_DAY;
    const hoursPerWeek = hoursPerDay * this.DAYS_PER_WEEK;

    // Converte para minutos totais para evitar erros de ponto flutuante
    const totalMinutes = Math.round(hours * 60);

    // Menos de 1 hora: mostrar em minutos
    if (totalMinutes < 60) {
      return totalMinutes === 1 ? '1 minuto' : `${totalMinutes} minutos`;
    }

    // Helper para formatar horas + minutos restantes
    const formatHoursMinutes = (totalMins) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      let s = h === 1 ? '1 hora' : `${h} horas`;
      if (m > 0) s += m === 1 ? ' e 1 minuto' : ` e ${m} minutos`;
      return s;
    };

    // Menos de 1 dia de trabalho: mostrar horas e minutos
    if (totalMinutes < hoursPerDay * 60) {
      return formatHoursMinutes(totalMinutes);
    }

    // Menos de 1 semana de trabalho: mostrar dias trabalhados e horas
    if (totalMinutes < hoursPerWeek * 60) {
      const days = Math.floor(totalMinutes / (hoursPerDay * 60));
      const remainingMins = totalMinutes % (hoursPerDay * 60);

      let result = days === 1 ? '1 dia trabalhado' : `${days} dias trabalhados`;

      if (remainingMins >= 1) {
        result += ' e ' + formatHoursMinutes(remainingMins);
      }

      return result;
    }

    // Mais de 1 semana: mostrar semanas, dias trabalhados e horas
    const weeks = Math.floor(totalMinutes / (hoursPerWeek * 60));
    const remainingAfterWeeks = totalMinutes % (hoursPerWeek * 60);
    const days = Math.floor(remainingAfterWeeks / (hoursPerDay * 60));
    const remainingMins = remainingAfterWeeks % (hoursPerDay * 60);

    let result = weeks === 1 ? '1 semana' : `${weeks} semanas`;

    if (days > 0) {
      result += days === 1 ? ' 1 dia trabalhado' : ` ${days} dias trabalhados`;
    }

    if (remainingMins >= 1) {
      result += ' e ' + formatHoursMinutes(remainingMins);
    }

    return result;
  },

  /**
   * Converte preço para tempo de trabalho (função principal)
   * @param {string} priceText - Texto contendo o preço
   * @param {number} monthlySalary - Salário mensal líquido
   * @returns {string|null} - Tempo formatado ou null se inválido
   */
  convertPriceToTime(priceText, monthlySalary, workHoursPerDay) {
    const price = this.parseBrazilianPrice(priceText);

    if (!price || !monthlySalary || monthlySalary <= 0) {
      return null;
    }

    const hours = this.calculateWorkHours(price, monthlySalary, workHoursPerDay);
    return this.formatWorkTime(hours, workHoursPerDay);
  }
};

