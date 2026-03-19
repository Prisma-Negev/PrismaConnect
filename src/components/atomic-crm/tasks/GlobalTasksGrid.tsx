import { ReferenceField, useListContext } from "ra-core";
import { TextField } from "@/components/admin/text-field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckSquare, Clock, Square, User as UserIcon } from "lucide-react";

// For custom formatting, we'll build a custom grid or use react-admin's Datagrid if available in our custom UI library.
// The project uses its own custom list components often, but let's build a clean Tailwind table here.

export const GlobalTasksGrid = () => {
  const { data, isPending } = useListContext();

  if (isPending) return <div className="p-4 text-center text-slate-500">טוען משימות...</div>;
  if (!data?.length) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-4 shadow-sm" dir="rtl">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[50px] text-center"></TableHead>
            <TableHead className="font-semibold text-slate-600">משימה</TableHead>
            <TableHead className="font-semibold text-slate-600">פרויקט</TableHead>
            <TableHead className="font-semibold text-slate-600">איש קשר</TableHead>
            <TableHead className="font-semibold text-slate-600">תאריך יעד</TableHead>
            <TableHead className="font-semibold text-slate-600">אחראי</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((task) => (
            <TableRow key={task.id} className="hover:bg-slate-50 transition-colors">
              <TableCell className="text-center">
                {task.completed ? (
                  <CheckSquare className="text-emerald-500 inline-block" size={18} />
                ) : (
                  <Square className="text-slate-300 inline-block" size={18} />
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium text-slate-800">{task.text}</div>
                {task.note && <div className="text-xs text-slate-500 mt-1 line-clamp-1">{task.note.replace("[IN_PROGRESS]", "").trim()}</div>}
              </TableCell>
              <TableCell>
                {task.deal_name ? (
                  <div>
                    <div className="text-sm font-medium">{task.deal_name}</div>
                    {task.deal_project_type && (
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                        {task.deal_project_type}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </TableCell>
              <TableCell>
                {task.contact_id ? (
                  <ReferenceField source="contact_id" reference="contacts" record={task} link="show">
                    <TextField source="first_name" className="text-sm font-medium hover:underline text-blue-600" />
                  </ReferenceField>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Clock size={14} className={new Date(task.due_date) < new Date() && !task.completed ? "text-red-500" : "text-slate-400"} />
                  <span className={new Date(task.due_date) < new Date() && !task.completed ? "text-red-600 font-medium" : ""}>
                    {new Date(task.due_date).toLocaleDateString("he-IL")}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {task.sales_id && (
                  <ReferenceField source="sales_id" reference="sales" record={task}>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-full w-max text-xs font-medium text-slate-700 border border-slate-200">
                      <UserIcon size={12} className="text-slate-400" />
                      <TextField source="first_name" />
                    </div>
                  </ReferenceField>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
