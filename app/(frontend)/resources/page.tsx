import React from 'react';

// CLAUDE CHANGE: new import. The grid (and the card inside it) now live in components/.
import { ResourceGrid } from '@/components/ResourceGrid';
import { ResourceFilters } from '@/components/ResourceFilters';
// CLAUDE CHANGE: new import. Projects from the admin panel, turned into cards.
import { getProjects, projectToResource } from '@/lib/data/projects';
// CLAUDE CHANGE: new import. Reads the sidebar's filter choices from the URL and applies them.
import { applyFilters, parseFilters } from '@/lib/resourceFilters';

// CLAUDE CHANGE: the Resource interface that was here is replaced by the fuller one in ./types.ts (same
// id / category / title / description / image fields, plus the new card fields)
import type { Resource } from './types';

// CLAUDE CHANGE: these hard-coded cards still show, after the admin's projects in each section. Delete an
// entry once its page exists in the admin.
const RESOURCES_DATA: Resource[] = [
    //healthcare workers
  
  {
    id: '1',
    category: 'healthcare',
    title: 'Training Videos',
    description: 'Training videos demonstrate model-specific equipment setup, use, and maintenance and are used as training aids in clinical and technical training.',
  },
  {
    id: '2',
    category: 'healthcare',
    title: 'Orientation for Staff Video',
    description: 'This orientation video introduces healthcare workers and students to the neonatal intensive care unit (NICU) and its importance in saving newborn lives.',
  },
  {
    id: '3',
    category: 'healthcare',
    title: 'Clinical Modules',
    description: 'Clinical education modules prepare healthcare staff and students to understand when and how to safely and effectively use equipment essential to newborn care.',
  },
  {
    id: '4',
    category: 'healthcare',
    title: 'BME/T Modules',
    description: 'BME/T education modules prepare biomedical technicians on the technical use of technologies for newborn care in resource limited settings.',
  },
  // innovators + manufacturers 
  {
    id: '5',
    category: 'innovators',
    title: 'Target Product Profiles for Newborn Care',
    description: 'In collaboration with UNICEF, NEST360 developed the target product profiles (TPPs) which list a proposed set of performance & operational characteristics for 16 newborn products.',
  },
  {
    id: '6',
    category: 'innovators',
    title: 'NEST360 Qualified Technologies for Small & Sick Newborn Care',
    description: 'The NEST360 Qualified Technologies are a list of newborn care technologies best suited for use in low-resource setting hospitals, including being effective, affordable, rugged, and simple to use.',
  },
  {
    id: '7',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape',
    description: 'A compendium of newborn & maternal healthcare technologies, both commercially available and in development, suited for use in resource-limited settings.',
  },
  {
    id: '8',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape Survey',
    description: 'Do you have a technology that you would like to be considered for the next edition of the Newborn & Maternal Technology Landscape? If so, please fill out our survey form.',
  },
  //Implementors 
  {
    id: '9', 
    category: 'implementors', 
    title: "Implementation Toolkit", 
    description: 'The Implementation Toolkit for small and sick newborn care, codesigned by UNICEF and NEST360, is an open-access, online toolkit enabling implementors to reach every newborn.'
  }
];

// CLAUDE CHANGE: new. Replaces the healthcareResources / innovatorResources / implementorResources filters
// that were at the top of ResourcesPage. Each entry becomes one section; the titles are the old <h2> text.
// To add a section (e.g. 'families'), add a line here.
// One grid per audience, in page order. Sections with no resources yet are hidden by ResourceGrid.
// CLAUDE CHANGE: added `label`, the shorter name for each audience in the filter sidebar
const SECTIONS: { category: Resource['category']; title: string; label: string }[] = [
  { category: 'healthcare', title: 'Resources for healthcare professionals & BMETs', label: 'Healthcare professionals & BMETs' },
  { category: 'innovators', title: 'Resources for innovators & manufacturers', label: 'Innovators & manufacturers' },
  { category: 'implementors', title: 'Resources for Implementors', label: 'Implementors' },
];

// CLAUDE CHANGE: async, so it can load projects from Payload
// CLAUDE CHANGE: now reads searchParams, where the filter sidebar puts its choices
export default async function ResourcesPage({ searchParams }: PageProps<'/resources'>) {
  // CLAUDE CHANGE: new. Admin projects (dated by when they were added) plus the hard-coded cards, then the
  // sidebar's sort, audience and tag choices applied.
  const listed = [
    ...(await getProjects()).map((project) => ({ resource: projectToResource(project), date: project.createdAt })),
    ...RESOURCES_DATA.map((resource) => ({ resource, date: resource.publishedDate })),
  ];
  const filters = parseFilters(await searchParams);
  const resources = applyFilters(listed, filters);
  // Every tag on any resource, A–Z, so the sidebar only offers tags that match something
  const allTags = [...new Set(listed.flatMap(({ resource }) => resource.tags ?? []))].sort((a, b) => a.localeCompare(b));

  const sidebar = (
    <ResourceFilters
      // Remounts the form when the URL changes, so "Clear all" also clears the ticked boxes
      key={JSON.stringify(filters)}
      sort={filters.sort}
      audiences={SECTIONS.map(({ category, label }) => ({ value: category, label }))}
      selectedAudiences={filters.audiences}
      tags={allTags}
      selectedTags={filters.tags}
    />
  );

  return (
    // CLAUDE CHANGE: background bg-slate-50 -> Figma neutral 100
    <main className="min-h-screen bg-nest-neutral-100 pb-16">
      {/* search header section */}
      {/* CLAUDE CHANGE: py-12 -> py-10, the Figma 40px top margin */}
      <section className="bg-white py-10 px-4 border-b border-gray-200 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* CLAUDE CHANGE: Figma "Heading 1 (48pt bold)" in Poppins. Was text-4xl (36px) in the body font. */}
          <h1 className="font-heading text-4xl font-bold text-nest-neutral-900 sm:text-5xl">Resources</h1>
          {/* CLAUDE CHANGE: Figma "Body 1 (Regular 16pt)". Was text-sm (14px). */}
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Our resources support clinicians, engineers, and administrators to implement an evidence-based model for sustainable, high-quality hospital-based newborn care in limited-resource settings.
          </p>

          {/* CLAUDE CHANGE: input and button are now separate shapes, so each gets its own Figma corner: 10px
              for inputs, 30px for buttons. Button teal #41B6C4 with white text -> Figma light blue with Nest
              Blue text (white on light blue is too faint to read). */}
          <div className="flex max-w-2xl mx-auto mt-6 gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="min-w-0 flex-1 rounded-[10px] border border-gray-200 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 outline-none focus:border-nest-light-blue"
            />
            <button className="rounded-[30px] bg-nest-light-blue px-8 text-base font-semibold text-nest-blue transition-colors hover:bg-nest-accent">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* results section */}
      {/* CLAUDE CHANGE: max-w-6xl (1152px) -> 1080px, the content width left by the Figma 180px side margins
          on a 1440px frame. py-12 -> py-10 for the 40px top/bottom margins. */}
      {/* CLAUDE CHANGE: now two columns from md up: the filter sidebar, then the sections */}
      <div className="max-w-[1080px] mx-auto px-4 py-10 md:flex md:items-start md:gap-8">
        {/* CLAUDE CHANGE: new. On phones the filters fold into a "Filter and sort" toggle above the results, so
            the cards aren't pushed down a screen; from md up they're a sidebar that stays in view on scroll. */}
        <details className="mb-8 md:hidden">
          <summary className="cursor-pointer rounded-[30px] border border-nest-blue px-4 py-2 text-center text-sm font-semibold text-nest-blue">
            Filter and sort
          </summary>
          <div className="mt-3">{sidebar}</div>
        </details>
        <aside className="hidden w-60 shrink-0 md:sticky md:top-6 md:block">{sidebar}</aside>

        <div className="min-w-0 flex-1 space-y-12">
          {/* CLAUDE CHANGE: new. Shown when the filters leave nothing. */}
          {resources.length === 0 && (
            <p className="rounded-[10px] border border-gray-200 bg-white p-8 text-center text-gray-600">
              No resources match these filters.
            </p>
          )}
          {/* CLAUDE CHANGE: replaces the three copy-pasted <section> blocks (healthcare, innovators,
              implementors). Same heading, grid and card styles, now in components/ResourceGrid.tsx and
              components/ResourceCard.tsx. */}
          {SECTIONS.map((section) => (
            <ResourceGrid
              key={section.category}
              title={section.title}
              // CLAUDE CHANGE: 3 columns instead of 4, to leave room for the sidebar
              columns={3}
              // CLAUDE CHANGE: Resource objects go to the cards as they are, since the card props come from
              // the same type. Now the filtered and sorted list; sections the filters empty are hidden.
              resources={resources.filter((r) => r.category === section.category)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}