import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-6 text-4xl leading-[0.95] text-ink sm:text-6xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 border-t border-ink/15 pt-8 font-sans text-2xl font-bold text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-sans text-lg font-bold text-ink">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-5 text-lg leading-8 text-ink/76">{children}</p>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-accent underline underline-offset-4 transition-colors hover:text-accent-strong"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mt-5 list-disc space-y-3 pl-6 text-lg leading-8 text-ink/76">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-3 pl-6 text-lg leading-8 text-ink/76">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent bg-panel px-5 py-4 text-ink/76">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-panel-strong px-1.5 py-0.5 font-mono text-sm text-accent-strong">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-8 overflow-x-auto border border-ink/15 bg-panel p-5 text-sm text-ink">
        {children}
      </pre>
    ),
    hr: () => <hr className="my-10 border-ink/15" />,
    ...components,
  };
}
