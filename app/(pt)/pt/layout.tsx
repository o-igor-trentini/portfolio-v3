import type { ReactNode } from "react";
import { RootShell } from "@/components/layout/RootShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("pt");
export { viewport } from "@/lib/seo";

export default function PtLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell lang="pt">{children}</RootShell>;
}
