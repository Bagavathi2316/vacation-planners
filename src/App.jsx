import { useEffect, useMemo, useState } from 'react';
import { seed } from './data/seed.js';
import { buildConfig, recalc } from './config.jsx';
import PaymentSummary from './components/PaymentSummary.jsx';
import { ToastProvider, useToast } from './components/Toast.jsx';
import Sidebar, { NAV } from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import DataTable from './components/DataTable.jsx';
import CalendarView from './components/CalendarView.jsx';
import EntityForm from './components/EntityForm.jsx';
import { ConfirmDialog, DetailsDialog } from './components/Dialogs.jsx';
import { Skeleton } from './components/States.jsx';
import PageHead from './components/PageHead.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

function Dashboard360() {
  const toast = useToast();
  const [S, setS] = useState(seed);
  const [route, setRoute] = useState('dash');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [modal, setModal] = useState(null); // {type:'view'|'edit'|'delete', e, id}
  const cfg = useMemo(() => buildConfig(S), [S]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [route, attempt]);

  const find = (e, id) => S[e].find((x) => x.id === id);
  const close = () => setModal(null);

  const save = (e, id, vals) => {
    const old = id ? find(e, id) : null;
    setS((p) => {
      let n = {
        ...p,
        [e]: id ? p[e].map((x) => (x.id === id ? { ...x, ...vals } : x))
                : [...p[e], { id: Math.max(0, ...p[e].map((x) => x.id)) + 1, ...vals }],
      };
      if (e === 'pay') { n = recalc(n, vals.bookId); if (old && old.bookId !== vals.bookId) n = recalc(n, old.bookId); }
      return n;
    });
    toast(`${cap(cfg[e].noun)} ${id ? 'updated' : 'created'} successfully`);
    close();
  };

  const askDelete = (e, row) => {
    const why = cfg[e].canDelete(row);
    if (why) return toast('Cannot delete: ' + why, true);
    setModal({ type: 'delete', e, id: row.id });
  };
  const doDelete = () => {
    const { e, id } = modal;
    setS((p) => {
      let n = { ...p, [e]: p[e].filter((x) => x.id !== id) };
      if (e === 'book') n.pay = p.pay.filter((x) => x.bookId !== id);
      if (e === 'pay') n = recalc(n, p.pay.find((x) => x.id === id).bookId);
      return n;
    });
    toast(`${cap(cfg[e].noun)} deleted`);
    close();
  };

  const openView = (e, row) => setModal({ type: 'view', e, id: row.id });
  const openEdit = (e, row) => setModal({ type: 'edit', e, id: row?.id });

  let page;
  if (loading) {
    const title = cfg[route]?.title || NAV.find((n) => n[0] === route)[1];
    page = <><PageHead title={title} sub="Loading…" /><Skeleton /></>;
  } else if (route === 'dash') {
    page = <Dashboard S={S} onNewBooking={() => { setRoute('book'); setModal({ type: 'edit', e: 'book' }); }} onViewBooking={(b) => openView('book', b)} onGo={setRoute} />;
  } else if (route === 'cal') {
    page = <CalendarView trips={S.trips} onViewTrip={(t) => openView('trips', t)} />;
  } else {
    page = (
      <DataTable key={route} cfg={cfg[route]} rows={S[route]} top={route === 'pay' ? <PaymentSummary S={S} /> : null}
        onNew={() => openEdit(route)} onView={(r) => openView(route, r)}
        onEdit={(r) => openEdit(route, r)} onDelete={(r) => askDelete(route, r)} />
    );
  }

  const row = modal && modal.id ? find(modal.e, modal.id) : null;
  return (
    <>
      <Sidebar route={route} onGo={setRoute} />
      <main>
        <ErrorBoundary key={route + attempt} onRetry={() => setAttempt((a) => a + 1)}><div className="page" key={route}>{page}</div></ErrorBoundary>
      </main>
      {modal?.type === 'view' && row && (
        <DetailsDialog cfg={cfg[modal.e]} row={row} onClose={close} onEdit={() => setModal({ type: 'edit', e: modal.e, id: row.id })} />
      )}
      {modal?.type === 'edit' && (
        <EntityForm cfg={cfg[modal.e]} row={row} onClose={close} onSave={(v) => save(modal.e, modal.id, v)} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmDialog message={`This ${cfg[modal.e].noun} will be permanently removed${modal.e === 'book' ? ', along with its payments' : ''}.`} onCancel={close} onConfirm={doDelete} />
      )}
    </>
  );
}

export default function App() {
  return <ToastProvider><Dashboard360 /></ToastProvider>;
}
