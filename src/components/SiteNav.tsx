"use client";

/* ------------------------------------------------------------
   Navegación persistente (sticky) presente en todas las páginas.
   Barra fina translúcida: marca a la izquierda (vuelve al inicio)
   y secciones a la derecha. Resuelve la falta de navegación al
   hacer scroll y unifica el recorrido en desktop/tablet/móvil.
------------------------------------------------------------ */

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "MÚSICA", href: "/musica" },
  { label: "GALERÍA", href: "/galeria" },
  { label: "PRÓXIMO", href: "/proximo-lanzamiento" },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label="Navegación principal">
      <Link href="/" className="site-nav__brand">
        needmoney4music<span className="site-nav__caret">_</span>
      </Link>
      <ul className="site-nav__links">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href}>
              <Link href={l.href} aria-current={active ? "page" : undefined} data-active={active}>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
