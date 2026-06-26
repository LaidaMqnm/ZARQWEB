"use client";

/* ------------------------------------------------------------
   Personalización: guarda el nombre del visitante (puerta de
   nombre) y lo expone a toda la app. Persiste en localStorage
   para que su nombre siga apareciendo al volver.
------------------------------------------------------------ */

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Visitor = {
  name: string | null;
  setName: (n: string) => void;
  hasName: boolean;
  clear: () => void;
};

const KEY = "nm4m_visitor_name";
const Ctx = createContext<Visitor | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState<string | null>(null);

  // Cargar al montar (cliente)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setNameState(stored);
    } catch {}
  }, []);

  const setName = (n: string) => {
    const clean = n.trim().slice(0, 40);
    setNameState(clean);
    try {
      localStorage.setItem(KEY, clean);
    } catch {}
  };

  const clear = () => {
    setNameState(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  return (
    <Ctx.Provider value={{ name, setName, hasName: !!name, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useVisitor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVisitor debe usarse dentro de <VisitorProvider>");
  return ctx;
}
