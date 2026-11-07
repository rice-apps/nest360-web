import React from 'react';

type TagProps = {
  children: React.ReactNode;
  color?: 'teal' | 'blue' | 'purple' | 'orange' | 'yellow';
};

const COLORS = {
  teal: 'bg-[#E5F5F2] text-[#398F86]',
  blue: 'bg-[#EAF3F8] text-[#397B99]',
  purple: 'bg-[#F2EAF7] text-[#9566A8]',
  orange: 'bg-[#FFF0E9] text-[#D98565]',
  yellow: 'bg-[#FFF7DF] text-[#A78635]',
};

export function Tag({ children, color = 'teal' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium ${COLORS[color]}`}
    >
      {children}
    </span>
  );
}