import Navigation from "./header";

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
      <main
        className="relative mx-auto grid
       w-full grid-cols-4 gap-5 px-4  md:grid-cols-8 lg:grid-cols-12"
      >
        {children}
      </main>
    </div>
  );
}
