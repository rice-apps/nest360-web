import InteractiveCountryMap from '@/components/InteractiveCountryMap';

export const metadata = {
  title: 'Interactive Map Preview | NEST360',
  description: 'Standalone preview of the NEST360 interactive country map component.',
};

export default function MapPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto mb-6">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-200 text-slate-700">
          Component Preview
        </span>
      </div>
      <InteractiveCountryMap />
    </main>
  );
}