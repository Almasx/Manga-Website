import { signOut, useSession } from "next-auth/react";
import { Book1, Logout, Notification, Setting2 } from "iconsax-react";

import CheckBox from "../../../components/atoms/CheckBoxField";
import SideBar from "../../../components/organisms/SideBar";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const AccountBar = () => {
  const router = useRouter();
  const session = useSession();
  const { data } = trpc.auth.getBookmarks.useQuery();

  return (
    <SideBar.Wrapper className="col-span-2 ">
      <section className="flex flex-row items-center gap-4 px-5 py-8">
        {session.data?.user?.image && (
          <img
            src={session.data?.user?.image}
            alt=""
            className="h-12 w-12 rounded-full"
          />
        )}

        <div className="flex flex-col ">
          <h4 className="text-xl font-bold">{session.data?.user?.name}</h4>
          <p className="text-white/33 -mt-1">Привет 👋</p>
        </div>
      </section>
      <SideBar.Section.Wrapper>
        <SideBar.Section.Header text="Главное" />
        <SideBar.Section.Tab active={false}>
          <Notification size="24" />
          Уведомления
        </SideBar.Section.Tab>
        <SideBar.Section.Tab active={false}>
          <Setting2 size="24" />
          Настройки
        </SideBar.Section.Tab>
      </SideBar.Section.Wrapper>

      {session.data?.user?.role === "ADMIN" && (
        <SideBar.Section.Wrapper>
          <SideBar.Section.Header text="Манги" />
          <SideBar.Section.Tab
            active={false}
            onClick={() =>
              !router.asPath.endsWith("/add-comics") &&
              router.push(router.asPath + "/add-comics", undefined, {
                shallow: true,
              })
            }
          >
            <Book1 size="24" />
            Добавить мангу
          </SideBar.Section.Tab>
        </SideBar.Section.Wrapper>
      )}

      {session.data?.user?.role === "USER" && (
        <SideBar.Section.Wrapper>
          <SideBar.Section.Header text="Сохранённые" />
          {data?.bookmarks.map((bookmark, index: number) => (
            <SideBar.Section.Tab
              key={index}
              active={false}
              classNames="rounded-xl"
              onClick={() => {
                !router.asPath.includes("/bookmarks/") &&
                  router.push(
                    router.asPath + `/bookmarks/${bookmark.id}`,
                    undefined,
                    {
                      shallow: true,
                    }
                  );
              }}
            >
              {bookmark.title}
            </SideBar.Section.Tab>
          ))}
        </SideBar.Section.Wrapper>
      )}

      {session.data?.user?.role === "USER" && (
        <SideBar.Section.Wrapper>
          <SideBar.Section.Header text="Сортировка" />
          <ul className="flex flex-col px-5 pb-3">
            <CheckBox active={true}>По дате добавления</CheckBox>
            <CheckBox active={false}>По дате обновления</CheckBox>
          </ul>
        </SideBar.Section.Wrapper>
      )}

      <section
        className="mt-8 flex flex-row items-center gap-3 border-t border-stroke-100
                   py-4 px-5 text-lg font-medium text-white/30"
        onClick={() => signOut()}
      >
        <Logout size="24" />
        Выход
      </section>
    </SideBar.Wrapper>
  );
};

export default AccountBar;
