export const NAV = [
  ['dash', 'Dashboard', '📊'], ['dest', 'Destinations', '🌍'], ['trips', 'Trips', '🧳'],
  ['cust', 'Customers', '👥'], ['book', 'Bookings', '🎫'], ['pay', 'Payments', '💳'], ['cal', 'Calendar', '📅'],
];
export default function Sidebar({ route, onGo }) {
  return (
    <aside>
      <div className="logo">Vacation <span>Planners</span> ✈</div>
      <nav>
        {NAV.map(([id, label, icon]) => (
          <button key={id} className={id === route ? 'on' : ''} onClick={() => onGo(id)}>{icon} {label}</button>
        ))}
      </nav>
      <div className="profile"><span className="av" style={{ background: '#f59e0b' }}>VP</span><div><b>Travel Desk</b><small>Administrator</small></div></div>
    </aside>
  );
}
