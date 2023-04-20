import GridLayout from "core/ui/templates/GridLayout";
import type { IThumbnail } from "components/molecules/ComicsCard";
import Navigation from "core/ui/templates/Navigation";
import type { ReactNode } from "react";
import useScreen from "lib/hooks/useScreen";

type IComicsLayoutProps = {
  children: ReactNode;
} & IThumbnail;

export default function ComicsLayout({
  children,
  thumbnail,
  external_link,
}: IComicsLayoutProps) {
  const { isSmallDevice } = useScreen();

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark text-light ">
      <Navigation.Wrapper className="fixed z-20">
        <Navigation.Links />
        <Navigation.Auth />
      </Navigation.Wrapper>
      {isSmallDevice && (
        <img
          src={
            external_link ??
            `https://darkfraction.s3.eu-north-1.amazonaws.com/thumbnails/${thumbnail?.id}`
          }
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
