import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'de', 'pl'] as const;
export type Locale = typeof locales[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);
