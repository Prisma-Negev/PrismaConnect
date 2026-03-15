import { mergeTranslations } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import frenchMessages from "ra-language-french";
import { raSupabaseEnglishMessages } from "ra-supabase-language-english";
import { raSupabaseFrenchMessages } from "ra-supabase-language-french";
import { englishCrmMessages } from "./englishCrmMessages";
import { frenchCrmMessages } from "./frenchCrmMessages";
import { hebrewCrmMessages } from "./hebrewCrmMessages";
import { hebrewRaMessages } from "./hebrewRaMessages";

const raSupabaseEnglishMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset: "Check your emails for a Reset Password message.",
    },
  },
};

const raSupabaseFrenchMessagesOverride = {
  "ra-supabase": {
    auth: {
      password_reset:
        "Consultez vos emails pour trouver le message de reinitialisation du mot de passe.",
    },
  },
};

const raSupabaseHebrewMessages = {
  "ra-supabase": {
    auth: {
      email: "דוא״ל",
      password: "סיסמה",
      sign_in: "התחברות",
      sign_up: "הרשמה",
      forgot_password: "שכחת סיסמה?",
      reset_password: "איפוס סיסמה",
      password_reset: "בדוק את תיבת הדוא״ל שלך למייל איפוס סיסמה.",
    },
  },
};

const englishCatalog = mergeTranslations(
  englishMessages,
  raSupabaseEnglishMessages,
  raSupabaseEnglishMessagesOverride,
  englishCrmMessages,
);

const frenchCatalog = mergeTranslations(
  englishCatalog,
  frenchMessages,
  raSupabaseFrenchMessages,
  raSupabaseFrenchMessagesOverride,
  frenchCrmMessages,
);

const hebrewCatalog = mergeTranslations(
  englishCatalog,
  hebrewRaMessages,
  raSupabaseHebrewMessages,
  hebrewCrmMessages,
);

export const getInitialLocale = (): "en" | "fr" | "he" => {
  if (typeof navigator === "undefined") {
    return "he";
  }

  const browserLocale = navigator.languages?.[0] ?? navigator.language;
  if (browserLocale?.toLowerCase().startsWith("he")) {
    return "he";
  }
  if (browserLocale?.toLowerCase().startsWith("fr")) {
    return "fr";
  }

  return "he";
};

export const i18nProvider = polyglotI18nProvider(
  (locale) => {
    if (locale === "fr") {
      return frenchCatalog;
    }
    if (locale === "he") {
      return hebrewCatalog;
    }
    return englishCatalog;
  },
  getInitialLocale(),
  [
    { locale: "he", name: "עברית" },
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
  ],
  { allowMissing: true },
);
