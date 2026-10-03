export const manilaTime = () =>
  new Intl.DateTimeFormat('en-PH', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit', weekday: 'long' }).format(new Date());
