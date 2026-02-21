'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0a0a0a] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/shows" className="text-gray-500 hover:text-white text-sm transition-colors">Browse Shows</Link></li>
              <li><Link href="/categories" className="text-gray-500 hover:text-white text-sm transition-colors">Categories</Link></li>
              <li><Link href="/pricing" className="text-gray-500 hover:text-white text-sm transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-gray-500 hover:text-white text-sm transition-colors">Login</Link></li>
              <li><Link href="/signup" className="text-gray-500 hover:text-white text-sm transition-colors">Sign Up</Link></li>
              <li><Link href="/account" className="text-gray-500 hover:text-white text-sm transition-colors">Settings</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@podshrink.com" className="text-gray-500 hover:text-white text-sm transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="PodShrink" className="w-8 h-8" />
              <span className="text-white font-bold">PodShrink</span>
            </Link>
            <p className="text-gray-600 text-xs leading-relaxed">
              AI-powered podcast summaries. Hours of podcasts, minutes to listen.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} PodShrink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
