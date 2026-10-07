import { createContext, useCallback, useContext, useState } from 'react';

const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const toast = useCallback((msg, error = false) => {
    const id = Math.random();
    setItems((a) => [...a, { id, msg, error }]);
    setTimeout(() => setItems((a) => a.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div id="toasts" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className={'t' + (t.error ? ' e' : '')}>{t.msg}</div>)}
      </div>
    </Ctx.Provider>
  );
}
