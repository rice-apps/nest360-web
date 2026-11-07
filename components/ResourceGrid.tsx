import React from 'react';

import { ResourceCard, type ResourceCardProps } from './ResourceCard';

// Full class names, so Tailwind sees them when it scans the source
const COLUMNS = {
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

interface ResourceGridProps {
  title?: string;
  resources: (ResourceCardProps & { id: string | number })[];
  columns?: keyof typeof COLUMNS;
}

// A titled section of resource cards: one column on phones, two on small screens, then `columns` from md up
export function ResourceGrid({ title, resources, columns = 4 }: ResourceGridProps) {
  if (!resources.length) return null;

  return (
    <section>
      {title && <h2 className="mb-6 font-heading text-xl font-bold text-nest-blue sm:text-2xl">{title}</h2>}
      {/* A list, so screen readers announce how many resources there are */}
      <ul className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${COLUMNS[columns]}`}>
        {resources.map(({ id, ...card }) => (
          <li key={id}>
            <ResourceCard {...card} />
          </li>
        ))}
      </ul>
    </section>
  );
}
