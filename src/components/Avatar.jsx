import { grad } from '../utils.js';
export default function Avatar({ name }) {
  const h = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const ini = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return <span className="av" style={{ background: grad(h)[0] }}>{ini}</span>;
}
