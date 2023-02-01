import Link from "next/link";
import React from "react";

const Links = () => {
  return (
    <div className="flex flex-row gap-5">
      <Link href="/" className="text-xs text-white/60">
        Главная
      </Link>
      <Link href="/catalog" className="text-xs text-white/60">
        Каталог
      </Link>
    </div>
  );
};

export default Links;
