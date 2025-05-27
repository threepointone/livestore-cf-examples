import { Column } from "@/components/layout/board/column";
import { Filters } from "@/components/layout/filters";
import { statusOptions } from "@/data/status-options";
import { filterState$ } from "@/lib/livestore/queries";
import { tables } from "@/lib/livestore/schema";
import {
  filterStateToOrderBy,
  filterStateToWhere
} from "@/lib/livestore/utils";
import { Status } from "@/types/status";
import { queryDb } from "@livestore/livestore";
import { useStore } from "@livestore/react";
import React from "react";

const filteredIssueIds$ = queryDb(
  (get) =>
    tables.issue
      .select("id")
      .where({ ...filterStateToWhere(get(filterState$)), deleted: null })
      .orderBy(filterStateToOrderBy(get(filterState$))),
  { label: "Board.visibleIssueIds" }
);

export const Board = () => {
  const { store } = useStore();
  const filteredIssueIds = store.useQuery(filteredIssueIds$);

  return (
    <>
      <Filters
        filteredCount={filteredIssueIds.length}
        hideStatusFilter
        hideSorting
      />
      <div className="grow overflow-x-auto">
        <div className="flex gap-4 p-4 h-full">
          {statusOptions.map((statusDetails, statusOption) => (
            <Column
              key={statusOption}
              status={statusOption as Status}
              statusDetails={statusDetails}
            />
          ))}
          <div className="w-4 -ml-4 shrink-0" />
        </div>
      </div>
    </>
  );
};
