import { COL } from '../utils.js';
export default function Badge({ text }) {
  return <span className="bd" style={{ '--c': COL[text] || '#64748b' }}>{text}</span>;
}
