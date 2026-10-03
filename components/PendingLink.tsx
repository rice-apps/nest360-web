import type { ReactNode } from "react";

// Stand-in for a link whose destination page hasn't been built yet. Renders
// underlined text with a hover note instead of an <a>. `to` records where the
// link should eventually point; swap this for <Link href={to}> once that page
// exists.
export default function PendingLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <span
      title="Hyperlink must be added"
      data-link-to={to}
      style={{ textDecoration: "underline", cursor: "help" }}
    >
      {children}
    </span>
  );
}
