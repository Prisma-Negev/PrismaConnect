import { useRecordContext, useTranslate } from "ra-core";
import {
  ExternalLink,
  GraduationCap,
  FlaskConical,
  Building2,
  Star,
} from "lucide-react";
import type { Contact } from "../types";

const priorityConfig: Record<number, { label: string; color: string }> = {
  1: { label: "דחוף", color: "text-red-600" },
  2: { label: "גבוה", color: "text-orange-500" },
  3: { label: "בינוני", color: "text-yellow-500" },
  4: { label: "נמוך", color: "text-gray-400" },
};

const academicTitleLabels: Record<string, string> = {
  prof: "פרופ׳ מן המניין",
  assoc_prof: "פרופ׳ חבר",
  senior_lecturer: "מרצה בכיר",
  dr: 'ד"ר',
  postdoc: "פוסט-דוק",
  student: "סטודנט",
};

export const ContactResearcherInfo = () => {
  const record = useRecordContext<Contact>();
  const translate = useTranslate();

  if (!record) return null;

  const priority = record.priority ? priorityConfig[record.priority] : null;

  return (
    <div>
      {record.academic_title && (
        <InfoRow
          icon={<GraduationCap className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.academic_title")}
          value={
            academicTitleLabels[record.academic_title] ?? record.academic_title
          }
        />
      )}
      {record.department && (
        <InfoRow
          icon={<Building2 className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.department")}
          value={record.department}
        />
      )}
      {record.research_focus && (
        <InfoRow
          icon={<FlaskConical className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.research_focus")}
          value={record.research_focus}
        />
      )}
      {record.cris_profile && (
        <div className="flex flex-row items-center gap-x-2 py-1 min-h-6">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
          <a
            className="underline hover:no-underline text-sm text-muted-foreground"
            href={record.cris_profile}
            target="_blank"
            rel="noopener noreferrer"
          >
            {translate("resources.contacts.fields.cris_profile")}
          </a>
        </div>
      )}
      {priority && (
        <div className="flex flex-row items-center gap-x-2 py-1 min-h-6">
          <Star className={`w-4 h-4 ${priority.color}`} />
          <span className="text-sm">
            {translate("resources.contacts.fields.priority")}:{" "}
            <span className={priority.color}>{priority.label}</span>
          </span>
        </div>
      )}
      {record.sector && (
        <InfoRow
          icon={<FlaskConical className="w-4 h-4 text-muted-foreground" />}
          label={translate("resources.contacts.fields.sector")}
          value={record.sector}
        />
      )}
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-row items-center gap-x-2 py-1 min-h-6">
    {icon}
    <span className="text-sm">
      {label}: {value}
    </span>
  </div>
);
