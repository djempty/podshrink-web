'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Show } from '@/lib/types';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  return (
    <Link href={`/shows/${show.slug}`} className="group">
      <div className="bg-dark-card rounded-lg overflow-hidden hover:bg-dark-hover transition-all duration-200 hover:scale-105">
        <div className="relative aspect-square">
          <Image
            src={show.imageUrl || '/placeholder.png'}
            alt={show.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
            {show.title}
          </h3>
          <p className="text-sm text-gray-400 truncate mt-1">{show.author}</p>
        </div>
      </div>
    </Link>
  );
}
