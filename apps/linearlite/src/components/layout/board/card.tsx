import { Avatar } from "@/components/common/avatar";
import { PriorityMenu } from "@/components/common/priority-menu";
import { StatusMenu } from "@/components/common/status-menu";
import { Issue, events } from "@/lib/livestore/schema";
import { Priority } from "@/types/priority";
import { Status } from "@/types/status";
import { getIssueTag } from "@/utils/get-issue-tag";
import { useStore } from "@livestore/react";
import React from "react";
import { Button } from "react-aria-components";
import { useNavigate } from "react-router-dom";

export const Card = ({
  issue,
  className
}: {
  issue: Issue;
  className?: string;
}) => {
  const navigate = useNavigate();
  const { store } = useStore();

  const handleChangeStatus = (status: Status) =>
    store.commit(
      events.updateIssueStatus({ id: issue.id, status, modified: new Date() })
    );

  const handleChangePriority = (priority: Priority) =>
    store.commit(
      events.updateIssuePriority({
        id: issue.id,
        priority,
        modified: new Date()
      })
    );

  return (
    <div
      className={`p-2 text-sm bg-white dark:bg-neutral-900 rounded-md shadow-sm dark:shadow-none border border-transparent dark:border-neutral-700/50 cursor-pointer h-full ${className ?? ""}`}
      onClick={() => navigate(`/issue/${issue.id}`)}
    >
      <Button slot="drag" className="size-0 absolute left-0 top-0" />
      <div className="flex items-center justify-between pl-2 pt-1 pr-1 mb-0.5">
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {getIssueTag(issue.id)}
        </div>
        <Avatar name={issue.creator} />
      </div>
      <div className="flex items-center gap-px my-px">
        <StatusMenu status={issue.status} onStatusChange={handleChangeStatus} />
        <div className="font-medium grow line-clamp-1">{issue.title}</div>
      </div>
      <PriorityMenu
        showLabel
        priority={issue.priority}
        onPriorityChange={handleChangePriority}
      />
    </div>
  );
};
