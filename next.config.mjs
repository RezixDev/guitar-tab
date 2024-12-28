import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.BASE_PATH,
};
 
export default withNextIntl(nextConfig);
