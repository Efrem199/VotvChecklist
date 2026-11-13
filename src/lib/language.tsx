import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { WikiLanguage } from '@/data/wikiTranslations';

export const LANGUAGE_KEY = 'votv-checklist-language';
interface LanguageContextValue { language: WikiLanguage; setLanguage: (language: WikiLanguage) => void; storageError: boolean }
const LanguageContext = createContext<LanguageContextValue>({ language: 'ru', setLanguage: () => {}, storageError: false });

function initialLanguage(): WikiLanguage {
 try {
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return saved === 'ru' || saved === 'en' ? saved : 'en';
 } catch { return 'en'; }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
 const [language, updateLanguage] = useState<WikiLanguage>(initialLanguage);
 const [storageError, setStorageError] = useState(false);
 const setLanguage = (next: WikiLanguage) => {
  updateLanguage(next);
  try { window.localStorage.setItem(LANGUAGE_KEY, next); setStorageError(false); }
  catch { setStorageError(true); }
 };
 useEffect(() => {
  document.documentElement.lang = language;
  document.title = language === 'en' ? 'VoTV · Field Journal — Dunkeltaler Forest' : 'VoTV · Журнал обхода — Dunkeltaler Forest';
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description) description.content = language === 'en'
   ? 'A field journal for Voices of the Void: dishes, transformers, radars and points of interest in Dunkeltaler Forest. Track cameras, server upgrades and visited locations.'
   : 'Журнал обхода для Voices of the Void: тарелки, трансформаторы, радары и точки интереса Dunkeltaler Forest. Отмечай камеры, апгрейды серверов и посещённые места.';
 }, [language]);
 useEffect(() => {
  const onStorage = (event: StorageEvent) => {
   if (event.key === LANGUAGE_KEY && (event.newValue === 'ru' || event.newValue === 'en')) updateLanguage(event.newValue);
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
 }, []);
 return <LanguageContext.Provider value={{ language, setLanguage, storageError }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
