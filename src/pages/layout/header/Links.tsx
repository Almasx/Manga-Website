import Link from "next/link";
import React from "react";

const Links = () => {
  return (
    <>
      <Link href="/" className="text-xs text-white/60">
        Главная
      </Link>
      <Link href="/catalog" className="text-xs text-white/60">
        Каталог
      </Link>
    </>
  );
};

export default Links;
