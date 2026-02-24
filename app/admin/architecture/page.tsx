'use client';

export default function ArchitecturePage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Architecture</h1>
          <p className="text-gray-500 text-sm mt-1">System architecture &amp; tech stack overview</p>
        </div>
        <span className="text-xs text-gray-600">Updated daily by Isaac</span>
      </div>
      <div className="flex-1 px-6 pb-6">
        <iframe
          src="/architecture.html"
          className="w-full h-full rounded-xl border border-gray-800"
          style={{ minHeight: 'calc(100vh - 120px)' }}
        />
      </div>
    </div>
  );
}
