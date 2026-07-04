declare module "*.md" {
  import type { ComponentType } from "react";

  const MD: ComponentType;
  export default MD;
}

declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDX: ComponentType;
  export default MDX;
}
