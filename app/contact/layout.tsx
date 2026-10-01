import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact the site owner or review current contact options.',
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}