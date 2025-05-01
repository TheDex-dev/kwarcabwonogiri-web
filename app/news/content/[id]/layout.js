'use client';

import { getAllArticles } from '../../../firebase/articles';

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export default function Layout({ children }) {
  return children;
}