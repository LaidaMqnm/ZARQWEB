import Link from "next/link";

/* Etiqueta de navegación tipo caja negra con glitch en hover (ver globals.css). */
export default function NavTag({
  label,
  href,
  style,
}: {
  label: string;
  href: string;
  style?: React.CSSProperties;
}) {
  const external = href.startsWith("http");
  const cls = "tag";
  const content = label;
  if (external) {
    return (
      <a className={cls} href={href} data-text={content} style={style} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link className={cls} href={href} data-text={content} style={style}>
      {content}
    </Link>
  );
}
