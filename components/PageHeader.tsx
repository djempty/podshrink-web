'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PageHeaderProps {
  title: string;
  showSignUp?: boolean;
}

export default function PageHeader({ title, showSignUp = true }: PageHeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      {showSignUp && status !== 'loading' && !session && (
        <Link
          href="/signup"
          className="px-4 md:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-sm font-medium"
        >
          Sign Up
        </Link>
      )}
    </header>
  );
}
