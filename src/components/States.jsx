export const Skeleton = () => (
  <div className="card">{Array.from({ length: 6 }, (_, i) => <div key={i} className="sk" />)}</div>
);
export const Empty = ({ message }) => <div className="es"><b>🧭</b>{message}</div>;
export const ErrorState = ({ onRetry }) => (
  <div className="card es er"><b>⚠️</b>Something went wrong while loading this page.<br /><br />
    <button className="btn" onClick={onRetry}>Retry</button></div>
);
