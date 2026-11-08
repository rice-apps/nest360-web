import type { ReactNode } from "react";

import { isDarkColor } from "@/lib/colors";

type Props = {
    // The block's backgroundColor field from Payload: a hex code like "#004167", or empty for none
    color: string | null | undefined;
    // The block's content, written as a function so it receives `dark`: true when the background
    // is dark and the block should switch its text to white so it stays readable
    children: (dark: boolean) => ReactNode;
};

// Shared wrapper used by every page block (Subsection, Text, Image with text, Heading with list),
// so the background-color logic lives in one place instead of being repeated in each block.
export function BlockBackground({ color, children }: Props) {
    // Decide once whether the chosen color is dark (see isDarkColor in lib/colors.ts)
    const dark = color ? isDarkColor(color) : false;

    return (
        // The outer <section> is full width, so the color stretches edge to edge across the page.
        // The block puts its own centered, max-width container inside it.
        // With no color picked, there's no style and no extra padding: the block looks as before.
        <section style={color ? { backgroundColor: color } : undefined} className={color ? "py-4" : undefined}>
            {children(dark)}
        </section>
    );
}
