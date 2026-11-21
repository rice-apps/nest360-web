"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Header } from "@/payload-types";

type Props = {
    logo: { url: string; alt: string; width?: number | null; height?: number | null } | null;
    navItems: NonNullable<Header["navItems"]>;
    donate: { label: string; url: string } | null;
};

// On desktop (md and up) the menu sits in a row, with dropdowns on hover or keyboard focus.
// On smaller screens it collapses behind a menu button that opens and closes a panel.
export function HeaderNav({ logo, navItems, donate }: Props) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false); // close the panel after a link is tapped

    return (
        <header className="relative border-b border-nest-neutral-200 bg-white text-nest-blue">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
                <Link href="/" onClick={close} className="shrink-0 font-heading text-xl font-bold">
                    {logo ? (
                        // Fixed height, width follows the image so a wide logo isn't squashed
                        <Image
                            src={logo.url}
                            alt={logo.alt}
                            width={logo.width ?? 200}
                            height={logo.height ?? 48}
                            priority
                            className="h-10 w-auto md:h-12"
                        />
                    ) : (
                        "NEST360"
                    )}
                </Link>

                {/* Desktop menu */}
                <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <div key={item.id} className="group relative">
                            {item.url ? (
                                <Link href={item.url} className="font-medium hover:text-nest-light-blue">{item.label}</Link>
                            ) : (
                                <button type="button" className="font-medium hover:text-nest-light-blue">{item.label}</button>
                            )}
                            {item.children && item.children.length > 0 && (
                                <ul className="invisible absolute left-0 top-full z-20 min-w-48 rounded-md bg-white p-2 shadow-lg group-hover:visible group-focus-within:visible">
                                    {item.children.map((child) => (
                                        <li key={child.id}>
                                            <Link href={child.url} className="block rounded px-3 py-2 hover:bg-nest-neutral-100">
                                                {child.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {donate && (
                        <Link
                            href={donate.url}
                            className="hidden rounded-full bg-nest-yellow px-5 py-2 font-semibold text-nest-blue md:inline-block"
                        >
                            {donate.label}
                        </Link>
                    )}

                    {/* Menu button, only below md */}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        className="rounded p-2 text-2xl leading-none md:hidden"
                    >
                        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
                        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
                    </button>
                </div>
            </div>

            {/* Mobile panel: each menu item with its dropdown links underneath */}
            {open && (
                <nav id="mobile-menu" aria-label="Main" className="border-t border-nest-neutral-200 px-4 pb-6 md:hidden">
                    <ul className="divide-y divide-nest-neutral-200">
                        {navItems.map((item) => (
                            <li key={item.id} className="py-3">
                                {item.url ? (
                                    <Link href={item.url} onClick={close} className="font-semibold">{item.label}</Link>
                                ) : (
                                    <span className="font-semibold">{item.label}</span>
                                )}
                                {item.children && item.children.length > 0 && (
                                    <ul className="mt-2 space-y-2 pl-4">
                                        {item.children.map((child) => (
                                            <li key={child.id}>
                                                <Link href={child.url} onClick={close}>{child.label}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    {donate && (
                        <Link
                            href={donate.url}
                            onClick={close}
                            className="mt-4 inline-block rounded-full bg-nest-yellow px-5 py-2 font-semibold"
                        >
                            {donate.label}
                        </Link>
                    )}
                </nav>
            )}
        </header>
    );
}
