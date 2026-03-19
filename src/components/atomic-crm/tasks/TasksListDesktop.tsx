import { type ReactNode } from "react";
import type { InputProps } from "ra-core";
import { useGetIdentity, useTranslate } from "ra-core";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { SelectInput } from "@/components/admin/select-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { FilterButton } from "@/components/admin/filter-form";
import { TopToolbar } from "../layout/TopToolbar";
import { CreateButton } from "@/components/admin/create-button";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { GlobalTasksGrid } from "./GlobalTasksGrid";

export const TasksListDesktop = () => {
  const { identity } = useGetIdentity();
  const { dealCategories } = useConfigurationContext();
  const translate = useTranslate();

  if (!identity) return null;

  const taskFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="sales_id" reference="sales">
      <AutocompleteInput
        label={false}
        placeholder={translate("resources.tasks.filters.assigned_to")}
        optionText={(choice) => `${choice.first_name || ""} ${choice.last_name || ""}`.trim() || choice.email}
      />
    </ReferenceInput>,
    <WrapperField source="deal_project_type" label="resources.deals.fields.category">
      <SelectInput
        source="deal_project_type"
        label={false}
        emptyText="resources.deals.fields.category"
        choices={dealCategories}
        optionText="label"
        optionValue="value"
      />
    </WrapperField>,
  ];

  return (
    <List
      resource="tasks_summary"
      perPage={100}
      title="מרכז משימות (Task HQ)"
      sort={{ field: "due_date", order: "ASC" }}
      filters={taskFilters}
      actions={<TaskActions />}
      pagination={null}
      empty={<div className="p-8 text-center text-slate-500">אין משימות מתאימות לסינון.</div>}
    >
      <GlobalTasksGrid />
    </List>
  );
};

const TaskActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton label="resources.tasks.action.new" />
  </TopToolbar>
);

const WrapperField = ({ children }: InputProps & { children: ReactNode }) => children;
