import React from 'react';
import { connection } from 'next/server';
import { ResourceBrowser } from '@/components/ResourceBrowser';
import { getProjects, projectToResource } from '@/lib/data/projects';
import { parseFilters } from '@/lib/resourceFilters';
import type { Resource } from './types';

// Your existing RESOURCES_DATA array goes here.
// Keep all 9 resource objects exactly as you shared them.

const RESOURCES_DATA: Resource[] = [
  {
    id: '1',
    category: 'healthcare',
    title: 'Training Videos',
    description: 'Training videos demonstrate model-specific equipment setup, use, and maintenance and are used as training aids in clinical and technical training.',
    tags: ['Training Module'],
    publishedDate: '2026-03-01',
    downloadUrl: '/resources/training-videos.pdf',
  },
  {
    id: '2',
    category: 'healthcare',
    title: 'Orientation for Staff Video',
    description: 'This orientation video introduces healthcare workers and students to the neonatal intensive care unit (NICU) and its importance in saving newborn lives.',
    tags: ['Training Module'],
    publishedDate: '2026-01-01',
  },
  {
    id: '3',
    category: 'healthcare',
    title: 'Clinical Modules',
    description: 'Clinical education modules prepare healthcare staff and students to understand when and how to safely and effectively use equipment essential to newborn care.',
    tags: ['Training Module'],
  },
  {
    id: '4',
    category: 'healthcare',
    title: 'BME/T Modules',
    description: 'BME/T education modules prepare biomedical technicians on the technical use of technologies for newborn care in resource limited settings.',
    tags: ['Training Module'],
  },
  {
    id: '5',
    category: 'innovators',
    title: 'Target Product Profiles for Newborn Care',
    description: 'In collaboration with UNICEF, NEST360 developed the target product profiles (TPPs) which list a proposed set of performance & operational characteristics for 16 newborn products.',
    tags: ['Toolkit'],
  },
  {
    id: '6',
    category: 'innovators',
    title: 'NEST360 Qualified Technologies for Small & Sick Newborn Care',
    description: 'The NEST360 Qualified Technologies are a list of newborn care technologies best suited for use in low-resource setting hospitals, including being effective, affordable, rugged, and simple to use.',
    tags: ['Report'],
  },
  {
    id: '7',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape',
    description: 'A compendium of newborn & maternal healthcare technologies, both commercially available and in development, suited for use in resource-limited settings.',
    tags: ['Report'],
  },
  {
    id: '8',
    category: 'innovators',
    title: 'Newborn & Maternal Technology Landscape Survey',
    description: 'Do you have a technology that you would like to be considered for the next edition of the Newborn & Maternal Technology Landscape? If so, please fill out our survey form.',
    tags: ['Survey'],
  },
  {
    id: '9',
    category: 'implementors',
    title: 'Implementation Toolkit',
    description: 'The Implementation Toolkit for small and sick newborn care, codesigned by UNICEF and NEST360, is an open-access, online toolkit enabling implementors to reach every newborn.',
    tags: ['Toolkit'],
  },
];

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();

  const listed = [
    ...(await getProjects()).map((project) => {
      const resource = projectToResource(project);
      return { resource, date: resource.lastModified };
    }),
    ...RESOURCES_DATA.map((resource) => ({
      resource,
      date: resource.lastModified,
    })),
  ];

  const filters = parseFilters(await searchParams);

  return (
    <main>
      <ResourceBrowser items={listed} initialFilters={filters} />
    </main>
  );
}