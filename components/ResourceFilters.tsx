'use client';

import React from 'react';
import { FILTER_FORM_ID } from '@/lib/resourceFilters';

export type FilterGroup = 'audiences' | 'tags' | 'topics';

interface ResourceFiltersProps {
  userTypes: { value: string; label: string }[];
  contentTypes: readonly string[];
  topics: readonly string[];
  selected: Record<FilterGroup, string[]>;
  onToggle: (group: FilterGroup, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

function Option({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 py-1.5 text-xs text-nest-neutral-900 hover:text-nest-blue">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-px h-3.5 w-3.5 shrink-0 accent-nest-blue"
      />
      {label}
    </label>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details open className="group border-b border-gray-200">
      <summary className="flex cursor-pointer list-none items-center justify-between border-b border-gray-200 px-4 py-3 text-sm font-semibold text-nest-neutral-900 group-[:not([open])]:border-b-0 [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 rotate-180 transition-transform group-open:rotate-0"
        >
          <path
            d="M5 12.5l5-5 5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <fieldset className="px-4 py-2">
        <legend className="sr-only">{title}</legend>
        {children}
      </fieldset>
    </details>
  );
}

export function ResourceFilters({
  userTypes,
  contentTypes,
  topics,
  selected,
  onToggle,
  onSubmit,
  onReset,
}: ResourceFiltersProps) {
  return (
    <form
      id={FILTER_FORM_ID}
      action="/resources"
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <details open className="group/sidebar">
        <summary className="flex cursor-pointer list-none items-center justify-between border-b border-gray-200 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <h2 className="text-sm font-semibold text-nest-neutral-900">
            Filters
          </h2>

          <span className="flex items-center gap-1 text-sm font-medium text-nest-accent">
            <span className="group-open/sidebar:hidden">Expand</span>
            <span className="hidden group-open/sidebar:inline">Collapse</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 rotate-180 transition-transform group-open/sidebar:rotate-0"
            >
              <path
                d="M5 12.5l5-5 5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </summary>

        <Group title="Filter by User Type">
          {userTypes.map(({ value, label }) => (
            <Option
              key={value}
              name="audience"
              value={value}
              label={label}
              checked={selected.audiences.includes(value)}
              onChange={() => onToggle('audiences', value)}
            />
          ))}
        </Group>

        <Group title="Filter by Content Type">
          {contentTypes.map((tag) => (
            <Option
              key={tag}
              name="tag"
              value={tag}
              label={tag}
              checked={selected.tags.includes(tag)}
              onChange={() => onToggle('tags', tag)}
            />
          ))}
        </Group>

        <Group title="Filter by Topic / Focus">
          {topics.map((topic) => (
            <Option
              key={topic}
              name="topic"
              value={topic}
              label={topic}
              checked={selected.topics.includes(topic)}
              onChange={() => onToggle('topics', topic)}
            />
          ))}
        </Group>

        <div className="px-4 py-5">
          <button
            type="reset"
            onClick={(event) => {
              event.preventDefault();
              onReset();
            }}
            className="w-full rounded-[30px] border border-nest-neutral-900 px-4 py-2 text-sm font-medium text-nest-neutral-900 transition-colors hover:bg-nest-neutral-100"
          >
            Reset
          </button>
        </div>
      </details>
    </form>
  );
}