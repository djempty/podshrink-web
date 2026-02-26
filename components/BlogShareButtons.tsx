'use client';

import { Twitter, Share2 } from 'lucide-react';

interface BlogShareButtonsProps {
  url: string;
  title: string;
}

export default function BlogShareButtons({ url, title }: BlogShareButtonsProps) {
  const shareText = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-800">
      <h3 className="text-white font-semibold mb-4">Share this article</h3>
      <div className="flex gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
        >
          <Twitter size={16} />
          Tweet
        </a>
        <a
          href={`https://reddit.com/submit?url=${url}&title=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
        >
          <Share2 size={16} />
          Reddit
        </a>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
        >
          <Share2 size={16} />
          Copy Link
        </button>
      </div>
    </div>
  );
}
