import React from 'react';
import { connection } from 'next/server';

import { ResourceBrowser } from '@/components/ResourceBrowser';
import { getProjects, projectToResource } from '@/lib/data/projects';
import { parseFilters } from '@/lib/resourceFilters';

import type { Resource } from './types';

// Shown after the admin's projects. Delete an entry once its page exists in the admin. Each has a content type
// and a topic from lib/resourceFilters.ts, so the sidebar filters find them.
const RESOURCES_DATA: Resource[] = [
  // healthcare workers
  {
    id: '1',
    category: 'healthcare',
    title: 'Training Videos',
    description: 'Training videos demonstrate model-specific equipment setup, use, and maintenance and are used as training aids in clinical and technical training.',
    tags: ['Videos', 'Technical & Equipment Maintenance'],
  },
  {
    id: '2',
    category: 'healthcare',
    title: 'Orientation for Staff Video',
    description: 'This orientation video introduces healthcare workers and students to the neonatal intensive care unit (NICU) and its importance in saving newborn lives.',
    tags: ['Videos', 'Safety & Infection Control (IPC)'],
  },
  {
    id: '3',
    category: 'healthcare',
    title: 'Clinical Modules',
    description: 'Clinical education modules prepare healthcare staff and students to understand when and how to safely and effectively use equipment essential to newborn care.',
    tags: ['Training Modules & Scenarios', 'Clinical Care & CPAP'],
  },
  {
    id: '4',
    category: 'healthcare',
    title: 'BME/T Modules',
    description: 'BME/T education modules prepare biomedical technicians on the technical use of technologies for newborn care in resource limited settings.',
    tags: ['Training Modules & Scenarios', 'Technical & Equipment Maintenance'],
  },
  // innovators + manufacturers
  {
    id: '5',
    category: 'innovators',
    title: 'Target Product Profiles for Newborn Care',
    description: 'In collaboration with UNICEF, NEST360 developed the target product profiles (TPPs) which list a proposed set of performance & operational characteristics for 16 newborn products.',
    tags: ['Reports & Frameworks', 'Technology Landscapes'],
  },
  {
    id: '6',
    category: 'innovators',
    title: 'NEST360 Qualified Technologies for Small & Sick Newborn Care',
    description: 'The NEST360 Qualified Technologies are a list of newborn care technologies best suited for use in low-resource setting hospitals, including being effective, affordable, rugged, and simple to use.',
    tags: ['Reports & Frameworks', 'Technology Landscapes'],
  },
  {
    id: '7',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape',
    description: 'A compendium of newborn & maternal healthcare technologies, both commercially available and in development, suited for use in resource-limited settings.',
    tags: ['Reports & Frameworks', 'Technology Landscapes'],
  },
  {
    id: '8',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape Survey',
    description: 'Do you have a technology that you would like to be considered for the next edition of the Newborn & Maternal Technology Landscape? If so, please fill out our survey form.',
    tags: ['Forms & Surveys', 'Technology Landscapes'],
  },
  // implementors
  {
    id: '9',
    category: 'implementors',
    title: 'Implementation Toolkit',
    description: 'The Implementation Toolkit for small and sick newborn care, codesigned by UNICEF and NEST360, is an open-access, online toolkit enabling implementors to reach every newborn.',
    tags: ['Toolkits & Dashboards', 'Quality Improvement & Data'],
  },
];

export default async function ResourcesPage({ searchParams }: PageProps<'/resources'>) {
  // Query CMS content at request time, after the deployment has a database available.
  await connection();

  // Admin projects (dated by when they were last changed) plus the hard-coded cards, then the URL's choices
  const listed = [
    ...(await getProjects()).map((project) => {
      const resource = projectToResource(project);
      return { resource, date: resource.lastModified };
    }),
    ...RESOURCES_DATA.map((resource) => ({ resource, date: resource.lastModified })),
  ];
  // Read from the URL so a shared, filtered link opens filtered. ResourceBrowser does all filtering after this.
  const filters = parseFilters(await searchParams);

  return (
    <main className="min-h-screen bg-white pb-16">
      <section className="px-4 pb-6 pt-10 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold text-nest-blue sm:text-5xl">Resources</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-nest-neutral-900 sm:text-base">
            Our resources support clinicians, engineers, and administrators to implement an evidence-based model for sustainable, high-quality hospital-based newborn care in limited-resource settings.
          </p>
        </div>
      </section>

      <ResourceBrowser items={listed} initialFilters={filters} />
    </main>
  );
}
