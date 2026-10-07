export const money = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
export const fd = (s) =>
  s ? new Date(s + 'T00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const COL = {
  Confirmed: '#0e7490', Pending: '#d97706', Cancelled: '#dc2626', Completed: '#2563eb',
  Paid: '#16a34a', Success: '#16a34a', Failed: '#dc2626', Partial: '#d97706', Unpaid: '#dc2626', Refunded: '#7c3aed',
};
export const today = () => new Date().toISOString().slice(0, 10);

export const GRADS = [['#2563eb', '#06b6d4'], ['#0ea5e9', '#6366f1'], ['#059669', '#22d3ee'], ['#f59e0b', '#ef4444'],
  ['#8b5cf6', '#ec4899'], ['#14b8a6', '#3b82f6'], ['#f97316', '#f43f5e'], ['#6366f1', '#0ea5e9']];
export const grad = (id) => GRADS[id % GRADS.length];
export const gradCss = (id) => `linear-gradient(135deg, ${grad(id)[0]}, ${grad(id)[1]})`;
export const METHOD_ICON = { UPI: '📱', 'Credit Card': '💳', 'Debit Card': '💳', 'Net Banking': '🏦', Cash: '💵' };
