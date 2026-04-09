const PriceCalculator = {
  WORKING_DAYS_PER_MONTH: 22,
  DAYS_PER_WEEK: 5,
  DEFAULT_HOURS_PER_DAY: 8,

  parseBrazilianPrice(priceText) {
    if (!priceText || typeof priceText !== 'string') {
      return null;
    }

    let cleaned = priceText.trim();
    cleaned = cleaned.replace(/R\$\s*/gi, '');
    cleaned = cleaned.replace(/\./g, '');
    cleaned = cleaned.replace(',', '.');
    const value = parseFloat(cleaned);

    if (isNaN(value) || value <= 0) {
      return null;
    }

    if (value < 0.01 || value > 10000000) {
      return null;
    }
    
    return value;
  },

  calculateWorkHours(price, monthlySalary, workHoursPerDay) {
    if (!price || !monthlySalary || monthlySalary <= 0) {
      return 0;
    }

    const hoursPerDay = workHoursPerDay || this.DEFAULT_HOURS_PER_DAY;
    const hoursPerMonth = hoursPerDay * this.WORKING_DAYS_PER_MONTH;
    const hourlyRate = monthlySalary / hoursPerMonth;
    return price / hourlyRate;
  },

  formatWorkTime(hours, workHoursPerDay) {
    if (!hours || hours <= 0) {
      return '0 horas';
    }

    const hoursPerDay = workHoursPerDay || this.DEFAULT_HOURS_PER_DAY;
    const hoursPerWeek = hoursPerDay * this.DAYS_PER_WEEK;

    const totalMinutes = Math.round(hours * 60);

    if (totalMinutes < 60) {
      return totalMinutes === 1 ? '1 minuto' : `${totalMinutes} minutos`;
    }

    const formatHoursMinutes = (totalMins) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      let s = h === 1 ? '1 hora' : `${h} horas`;
      if (m > 0) s += m === 1 ? ' e 1 minuto' : ` e ${m} minutos`;
      return s;
    };

    if (totalMinutes < hoursPerDay * 60) {
      return formatHoursMinutes(totalMinutes);
    }

    if (totalMinutes < hoursPerWeek * 60) {
      const days = Math.floor(totalMinutes / (hoursPerDay * 60));
      const remainingMins = totalMinutes % (hoursPerDay * 60);

      let result = days === 1 ? '1 dia trabalhado' : `${days} dias trabalhados`;

      if (remainingMins >= 1) {
        result += ' e ' + formatHoursMinutes(remainingMins);
      }

      return result;
    }

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

  convertPriceToTime(priceText, monthlySalary, workHoursPerDay) {
    const price = this.parseBrazilianPrice(priceText);

    if (!price || !monthlySalary || monthlySalary <= 0) {
      return null;
    }

    const hours = this.calculateWorkHours(price, monthlySalary, workHoursPerDay);
    return this.formatWorkTime(hours, workHoursPerDay);
  }
};

