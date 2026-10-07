export default function PageHead({ title, sub, children }) {
  return <div className="head"><div><h1>{title}</h1><p>{sub}</p></div>{children}</div>;
}
