import type { ReactNode } from "react";

export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="my-8 border-l-2 border-accent bg-panel px-5 py-4 text-ink">
      <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
        {title}
      </p>
      <div className="space-y-3 text-sm leading-7 text-ink/78">{children}</div>
    </aside>
  );
}

export function DoDont({
  doItems,
  avoidItems,
}: {
  doItems: string[];
  avoidItems: string[];
}) {
  return (
    <div className="my-8 grid gap-4 md:grid-cols-2">
      <div className="border border-ink/15 bg-panel p-5">
        <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          Do
        </p>
        <ul className="space-y-3 font-sans text-sm leading-6 text-ink/78">
          {doItems.map((item) => (
            <li key={item} className="border-t border-ink/10 pt-3 first:border-t-0 first:pt-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="border border-ink/15 bg-panel p-5">
        <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
          Avoid
        </p>
        <ul className="space-y-3 font-sans text-sm leading-6 text-ink/68">
          {avoidItems.map((item) => (
            <li key={item} className="border-t border-ink/10 pt-3 first:border-t-0 first:pt-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Rubric({
  rows,
}: {
  rows: Array<{ label: string; strong: string; weak: string }>;
}) {
  return (
    <div className="my-8 overflow-x-auto border border-ink/15 bg-panel">
      <table className="w-full min-w-[680px] border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-ink/15 text-left text-[11px] uppercase tracking-[0.18em] text-muted">
            <th className="px-4 py-3">Signal</th>
            <th className="px-4 py-3">Strong</th>
            <th className="px-4 py-3">Weak</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-ink/10 last:border-b-0">
              <th className="px-4 py-4 text-left font-bold text-ink">{row.label}</th>
              <td className="px-4 py-4 text-ink/78">{row.strong}</td>
              <td className="px-4 py-4 text-ink/58">{row.weak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChecklistBlock({ items }: { items: string[] }) {
  return (
    <ol className="my-8 divide-y divide-ink/10 border border-ink/15 bg-panel font-sans text-sm text-ink/78">
      {items.map((item, index) => (
        <li key={item} className="grid grid-cols-[3rem_1fr]">
          <span className="border-r border-ink/10 px-4 py-3 text-[11px] tabular-nums text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="px-4 py-3">{item}</span>
        </li>
      ))}
    </ol>
  );
}
