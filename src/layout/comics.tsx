import GridLayout from "core/ui/templates/GridLayout";
import Navigation from "core/ui/templates/Navigation";
import type { ReactNode } from "react";
import useScreen from "lib/hooks/useScreen";

interface IComicsLayoutProps {
  children: ReactNode;
  thumbnailId: string;
}

export default function ComicsLayout({
  children,
  thumbnailId,
}: IComicsLayoutProps) {
  const { isSmallDevice } = useScreen();

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light ">
      <Navigation.Wrapper auth={true} className="fixed z-20">
        <Navigation.Links />
      </Navigation.Wrapper>
      {isSmallDevice && (
        <img
          src={`https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnailId}`}
          alt="lol"
          className="fixed aspect-[3/4] w-screen"
        />
      )}

      <GridLayout className="z-10 mt-[45vh] rounded-t-2xl bg-dark md:mt-16 lg:pr-0">
        {children}
      </GridLayout>
    </div>
  );
}
