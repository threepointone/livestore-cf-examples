import * as eventsDefs from "@/lib/livestore/events";
import { comment, type Comment } from "@/lib/livestore/schema/comment";
import {
  description,
  type Description
} from "@/lib/livestore/schema/description";
import {
  filterState,
  type FilterState
} from "@/lib/livestore/schema/filter-state";
import {
  frontendState,
  type FrontendState
} from "@/lib/livestore/schema/frontend-state";
import { issue, type Issue } from "@/lib/livestore/schema/issue";
import { makeSchema, State } from "@livestore/livestore";
import { scrollState, type ScrollState } from "./scroll-state";

export {
  comment,
  description,
  filterState,
  frontendState,
  issue,
  scrollState,
  type Comment,
  type Description,
  type FilterState,
  type FrontendState,
  type Issue,
  type ScrollState
};

export const events = {
  ...eventsDefs,
  frontendStateSet: frontendState.set,
  filterStateSet: filterState.set,
  scrollStateSet: scrollState.set
};

export const tables = {
  issue,
  description,
  comment,
  filterState,
  frontendState,
  scrollState
};

const materializers = State.SQLite.materializers(events, {
  "v1.CreateIssueWithDescription": (data) => [
    tables.issue.insert({
      id: data.id,
      title: data.title,
      priority: data.priority,
      status: data.status,
      created: data.created,
      modified: data.modified,
      kanbanorder: data.kanbanorder,
      creator: data.creator
    }),
    tables.description.insert({ id: data.id, body: data.description })
  ],
  "v1.CreateComment": (data) =>
    tables.comment.insert({
      id: data.id,
      body: data.body,
      issueId: data.issueId,
      created: data.created,
      creator: data.creator
    }),
  "v1.DeleteIssue": (data) =>
    tables.issue.update({ deleted: data.deleted }).where({ id: data.id }),
  "v1.DeleteDescription": (data) =>
    tables.description.update({ deleted: data.deleted }).where({ id: data.id }),
  "v1.DeleteComment": (data) =>
    tables.comment.update({ deleted: data.deleted }).where({ id: data.id }),
  "v1.DeleteCommentsByIssueId": (data) =>
    tables.comment
      .update({ deleted: data.deleted })
      .where({ issueId: data.issueId }),
  "v1.UpdateIssue": (data) =>
    tables.issue
      .update({
        title: data.title,
        priority: data.priority,
        status: data.status,
        modified: data.modified
      })
      .where({
        id: data.id
      }),
  "v1.UpdateIssueStatus": ({ id, status, modified }) =>
    tables.issue.update({ status, modified }).where({ id }),
  "v1.UpdateIssueKanbanOrder": ({ id, status, kanbanorder, modified }) =>
    tables.issue.update({ status, kanbanorder, modified }).where({ id }),
  "v1.UpdateIssueTitle": ({ id, title, modified }) =>
    tables.issue.update({ title, modified }).where({ id }),
  "v1.MoveIssue": ({ id, kanbanorder, status, modified }) =>
    tables.issue.update({ kanbanorder, status, modified }).where({ id }),
  "v1.UpdateIssuePriority": ({ id, priority, modified }) =>
    tables.issue.update({ priority, modified }).where({ id }),
  "v1.UpdateDescription": ({ id, body }) =>
    tables.description.update({ body }).where({ id })
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
