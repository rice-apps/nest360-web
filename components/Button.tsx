import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  download?: boolean;
}

export function Button({
  href,
  children,
  download = false,
}: ButtonProps) {
  const className =
    'inline-flex items-center justify-center rounded-full bg-[#7CC9BC] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#61B8AA]';

  if (download) {
    return (
      <a href={href} download className={className}>
        {children}
      </a>
    );
  }

  const external = href.startsWith('http');

  return (
    <Link
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </Link>
  );
}