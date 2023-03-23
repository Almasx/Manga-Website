import GridLayout from "core/ui/templates/GridLayout";
import Navigation from "core/ui/templates/Navigation";
import type { ReactNode } from "react";

export default function MainLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light">
      <Navigation.Wrapper>
        <Navigation.Links />
        <Navigation.Auth />
      </Navigation.Wrapper>
      <GridLayout className={className}>{children}</GridLayout>
    </div>
  );
}

export function DenseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light">
      <Navigation.Wrapper className="px-[10vw]">
        <Navigation.Links />
        <Navigation.Auth />
      </Navigation.Wrapper>
      <GridLayout className="!w-[80vw] !px-0">{children}</GridLayout>
    </div>
  );
}
