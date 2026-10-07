const dest = [
  ['Maldives', 'Maldives', 'Asia', '🏝️', 4.9], ['Ooty', 'India', 'India', '🌿', 4.6],
  ['Switzerland', 'Switzerland', 'Europe', '🏔️', 4.9], ['Thailand', 'Thailand', 'Asia', '🛕', 4.7],
  ['Goa', 'India', 'India', '🏖️', 4.6], ['Paris', 'France', 'Europe', '🗼', 4.8],
  ['Kashmir', 'India', 'India', '❄️', 4.8], ['Kerala', 'India', 'India', '🛶', 4.8],
  ['Jaipur', 'India', 'India', '🏰', 4.5], ['Andaman', 'India', 'India', '🐠', 4.7],
  ['Dubai', 'UAE', 'Middle East', '🌆', 4.7], ['Bali', 'Indonesia', 'Asia', '🌴', 4.8],
].map((d, i) => ({ id: i + 1, name: d[0], country: d[1], region: d[2], emoji: d[3], rating: d[4] }));

// [title, destId, start, end, price per person (INR), seats]
const trips = [
  ['Ooty Hill Station Escape', 2, '2026-10-12', '2026-10-15', 12500, 20],
  ['Kerala Backwater Houseboat', 8, '2026-10-20', '2026-10-25', 24500, 14],
  ['Goa Beach Carnival', 5, '2026-11-03', '2026-11-07', 18000, 18],
  ['Munnar Tea Valley Trek', 8, '2026-11-08', '2026-11-11', 14500, 16],
  ['Kashmir Paradise Tour', 7, '2026-11-15', '2026-11-21', 32000, 16],
  ['Bangkok & Phuket Holiday', 4, '2026-11-22', '2026-11-28', 52000, 15],
  ['Maldives Island Retreat', 1, '2026-12-05', '2026-12-10', 85000, 8],
  ['Paris Romantic Getaway', 6, '2026-12-20', '2026-12-27', 145000, 10],
  ['Swiss Alps Adventure', 3, '2027-01-10', '2027-01-17', 165000, 8],
  ['Jaipur Heritage Trail', 9, '2027-02-02', '2027-02-06', 15500, 20],
  ['Andaman Island Hopping', 10, '2027-02-14', '2027-02-20', 38000, 12],
  ['Dubai Desert & City Tour', 11, '2027-03-06', '2027-03-10', 48000, 14],
  ['Bali Wellness Retreat', 12, '2027-03-15', '2027-03-21', 62000, 10],
].map((t, i) => ({ id: i + 1, title: t[0], destId: t[1], start: t[2], end: t[3], price: t[4], seats: t[5] }));

const names = ['Bharath Kumar', 'Sarvesh Raj', 'Boopathy Raja', 'Dhivya Lakshmi', 'Saran Raj', 'Tamilselvan', 'Surya Prakash', 'Deva Nandhan', 'Kavin Raj', 'Praveen Kumar', 'Meena Priya', 'Anitha Devi'];
const cities = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Chennai', 'Bengaluru', 'Hyderabad', 'Puducherry', 'Vellore'];
const cust = names.map((n, i) => ({
  id: i + 1, name: n, email: n.toLowerCase().replace(/\s+/g, '.') + '@gmail.com',
  phone: '+91 9' + String(876540000 + i * 13791), city: cities[i],
}));

const st = ['Confirmed', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
const payStates = ['Paid', 'Partial', 'Unpaid', 'Paid', 'Refunded'];
const book = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, custId: (i % 12) + 1, tripId: ((i * 5) % 13) + 1, n: 1 + (i % 4),
  status: st[i % 5], payment: payStates[(i * 2) % 5], date: '2026-09-' + String(i + 1).padStart(2, '0'),
}));

const methods = ['UPI', 'Credit Card', 'Net Banking', 'Debit Card', 'Cash'];
const pay = book.map((b, i) => {
  const total = trips.find((t) => t.id === b.tripId).price * b.n;
  const map = { Paid: ['Success', total], Partial: ['Success', Math.round(total / 2)], Unpaid: ['Pending', total], Refunded: ['Refunded', total] };
  const [status, amount] = map[b.payment];
  return { id: i + 1, bookId: b.id, amount, method: methods[(i * 2) % 5], status, date: b.date, ref: 'TXN' + (48210000 + i * 7919) };
});

export const seed = { dest, trips, cust, book, pay };
