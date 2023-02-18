import GridLayout from "core/ui/templates/GridLayout";
import Navigation from "core/ui/templates/Navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Navigation.Wrapper auth={true}>
        <Navigation.Links />
      </Navigation.Wrapper>
      <GridLayout>{children}</GridLayout>
    </div>
  );
}
