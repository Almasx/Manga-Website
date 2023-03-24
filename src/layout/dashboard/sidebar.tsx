import { Book1, Logout, Notification, Setting2 } from "iconsax-react";
import { signOut, useSession } from "next-auth/react";

import CheckBoxField from "core/ui/fields/CheckBoxField";
import Link from "next/link";
import SideBar from "core/ui/templates/SideBar";
import { api } from "utils/api";
import { useRouter } from "next/router";

const AccountBar = () => {
  const { asPath } = useRouter();
  const session = useSession();
  const { data } = api.user.getBookmarks.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <SideBar.Wrapper className="scrollbar-hide fixed z-10 !w-64 bg-dark/40 backdrop-blur-xl">
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
          <p className="text-light/33 -mt-1">Привет 👋</p>
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
          <Link href={`${asPath}/add-comics`}>
            <SideBar.Section.Tab active={false}>
              <Book1 size="24" />
              Добавить мангу
            </SideBar.Section.Tab>
          </Link>
        </SideBar.Section.Wrapper>
      )}

      {session.data?.user?.role === "USER" && (
        <SideBar.Section.Wrapper>
          <SideBar.Section.Header text="Сохранённые" />
          {data?.bookmarks.map((bookmark) => (
            <Link
              href={`${asPath.replace(/\/bookmarks\/.*/, "")}/bookmarks/${
                bookmark.id
              }`}
              key={bookmark.id}
            >
              <SideBar.Section.Tab
                active={asPath.includes(bookmark.id)}
                className="rounded-xl"
              >
                {bookmark.title}
              </SideBar.Section.Tab>
            </Link>
          ))}
        </SideBar.Section.Wrapper>
      )}

      {session.data?.user?.role === "USER" && (
        <SideBar.Section.Wrapper>
          <SideBar.Section.Header text="Сортировка" />
          <ul className="flex flex-col px-5 pb-3">
            <CheckBoxField active={true}>По дате добавления</CheckBoxField>
            <CheckBoxField active={false}>По дате обновления</CheckBoxField>
          </ul>
        </SideBar.Section.Wrapper>
      )}

      <section
        className="mt-8 flex flex-row items-center gap-3 border-t border-gray-dark-secondary
                   py-4 px-5 text-lg font-medium text-light/30"
        onClick={() => signOut()}
      >
        <Logout size="24" />
        Выход
      </section>
    </SideBar.Wrapper>
  );
};

export default AccountBar;
