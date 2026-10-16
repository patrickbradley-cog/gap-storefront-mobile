"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ChevronLeftIcon, HeartIcon, SearchIcon } from "./icons";

export function MobileHeader({
  title,
  back = true,
  actions,
  children,
}: {
  title: ReactNode;
  back?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="safe-top sticky top-0 z-30 bg-white/95 backdrop-blur md:hidden">
      <div className="flex h-14 items-center px-3">
        {back ? (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full"
          >
            <ChevronLeftIcon />
          </button>
        ) : (
          <span className="w-2" />
        )}
        <h1 className={`flex-1 truncate text-[15px] font-medium ${back ? "text-center" : "text-left"}`}>{title}</h1>
        <div className="flex items-center gap-1">
          {actions ?? (
            <>
              <HeartIcon width={22} height={22} />
              <Link href="/c/all" aria-label="Search" className="flex h-10 w-10 items-center justify-center">
                <SearchIcon width={22} height={22} />
              </Link>
            </>
          )}
        </div>
      </div>
      {children}
    </header>
  );
}
