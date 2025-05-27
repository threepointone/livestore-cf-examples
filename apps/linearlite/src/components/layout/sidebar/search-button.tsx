import { MenuContext } from "@/app/contexts";
import { useFilterState } from "@/lib/livestore/queries";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import React from "react";
import { Link } from "react-router-dom";

export const SearchButton = () => {
  const [, setFilterState] = useFilterState();
  const { setShowMenu } = React.useContext(MenuContext)!;

  return (
    <Link
      to="/search"
      aria-label="Open search page"
      onClick={() => {
        setFilterState({ query: null });
        setShowMenu(false);
      }}
      className="rounded-lg size-8 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800"
    >
      <MagnifyingGlassIcon className="size-4" />
    </Link>
  );
};
