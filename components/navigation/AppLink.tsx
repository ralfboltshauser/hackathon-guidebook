import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export function AppLink({ scroll = false, children, ...props }: AppLinkProps) {
  return (
    <Link scroll={scroll} {...props}>
      {children}
    </Link>
  );
}
