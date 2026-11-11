window.KodeCupidFormat = {
  formatAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const age = new Date(Date.now() - birthDate.getTime());
    return Math.abs(age.getUTCFullYear() - 1970);
  },
  formatDistance(distance) {
    return `${distance} mi`;
  },
  formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  },
  formatMoney(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
};
