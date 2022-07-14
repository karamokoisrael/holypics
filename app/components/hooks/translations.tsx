import i18n, { t } from 'i18n-js';
import * as Localization from 'expo-localization';
i18n.translations = {
    fr: { welcome: 'Salut' },
    en: { welcome: 'hello' },
};
// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
// When a value is missing from a language it'll fallback to another language with the key present.
i18n.fallbacks = true;

// export default i18n;
// export const i18n.t;
export default function useTranslation() {
    return t;
}
