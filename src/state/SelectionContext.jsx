import { createContext, useContext, useMemo, useState } from 'react';

// District selected on the Dashboard, shared with the Farmer Alert page.
const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);
  const value = useMemo(() => ({ selectedId, setSelectedId }), [selectedId]);
  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used inside <SelectionProvider>');
  return ctx;
}
