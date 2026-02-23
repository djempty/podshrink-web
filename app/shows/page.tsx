import { api, DiscoverSection } from '@/lib/api';
import DiscoverHome from '@/components/DiscoverHome';
import RecentShrinksLoader from '@/components/RecentShrinksLoader';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let sections: DiscoverSection[] = [];

  // Fetch all categories
  const categories = ['popular', 'technology', 'news', 'society-culture', 'comedy', 'business', 'true-crime', 'health'];
  
  try {
    const results = await Promise.all(
      categories.map(cat => api.getDiscoverCategory(cat).catch(() => null))
    );
    sections = results.filter((s): s is DiscoverSection => s !== null);
  } catch (error) {
    console.error('Failed to fetch discover data:', error);
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <PageHeader title="Shows" showSearch />

      {/* Scrollable Content */}
      <div className="px-4 md:px-8 py-4 md:py-8">
        {/* Discover Sections */}
        <DiscoverHome sections={sections} />

        {/* Recently Shrunk — client-side, user-scoped */}
        <RecentShrinksLoader />
      </div>
    </div>
  );
}
