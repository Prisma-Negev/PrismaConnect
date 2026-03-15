import type { ConfigurationContextValue } from "./ConfigurationContext";

export const defaultDarkModeLogo = "./logos/logo_atomic_crm_dark.svg";
export const defaultLightModeLogo = "./logos/logo_atomic_crm_light.svg";

export const defaultCurrency = "ILS";

export const defaultTitle = "Prisma Negev CRM";

export const defaultCompanySectors = [
  { value: "industrial-engineering", label: "הנדסת תעשייה וניהול" },
  { value: "mechanical-engineering", label: "הנדסת מכונות" },
  { value: "electrical-engineering", label: "הנדסת חשמל" },
  { value: "computer-science", label: "מדעי המחשב" },
  { value: "biomedical-engineering", label: "הנדסה ביו-רפואית" },
  { value: "chemistry", label: "כימיה" },
  { value: "materials-engineering", label: "הנדסת חומרים" },
  { value: "civil-engineering", label: "הנדסה אזרחית" },
  { value: "education", label: "חינוך" },
  { value: "psychology", label: "פסיכולוגיה" },
  { value: "other", label: "אחר" },
];

export const defaultDealStages = [
  { value: "not-contacted", label: "טרם פנייה" },
  { value: "email-sent", label: "נשלח מייל" },
  { value: "interested", label: "מעוניין" },
  { value: "confirmed", label: "אישר השתתפות" },
  { value: "attended", label: "השתתף" },
  { value: "declined", label: "סירב" },
  { value: "no-response", label: "לא ענה" },
];

export const defaultDealPipelineStatuses = ["confirmed", "attended"];

export const defaultDealCategories = [
  { value: "industry-conference", label: "כנס תעשייה" },
  { value: "education-forum", label: "פורום חינוך" },
  { value: "workshop", label: "סדנה" },
  { value: "meetup", label: "מפגש" },
  { value: "webinar", label: "וובינר" },
  { value: "other", label: "אחר" },
];

export const defaultNoteStatuses = [
  { value: "initial", label: "פנייה ראשונית", color: "#7dbde8" },
  { value: "in-progress", label: "בתהליך", color: "#e8cb7d" },
  { value: "positive", label: "תגובה חיובית", color: "#a4e87d" },
  { value: "negative", label: "תגובה שלילית", color: "#e88b7d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "ללא" },
  { value: "cold-email", label: "מייל ראשוני" },
  { value: "follow-up", label: "מעקב" },
  { value: "phone-call", label: "שיחת טלפון" },
  { value: "meeting", label: "פגישה" },
  { value: "cris-check", label: "בדיקת CRIS" },
  { value: "secretary-contact", label: "פנייה למזכירות" },
  { value: "confirmation", label: "אישור השתתפות" },
  { value: "thank-you", label: "מייל תודה" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
