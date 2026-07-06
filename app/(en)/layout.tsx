import type { ReactNode } from "react";
import { RootShell } from "@/components/layout/RootShell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("en");
export { viewport } from "@/lib/seo";

export default function EnLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>;
}
