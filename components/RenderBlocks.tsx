import type { Page } from "@/payload-types";
import { HeadingWithListBlock } from "./blocks/HeadingWithListBlock";
import { MediaWithTextBlock } from "./blocks/MediaWithTextBlock";
import { RichTextBlock } from "./blocks/RichTextBlock";

// Picks the component for each block, in the order the editor arranged them.
export function RenderBlocks({ blocks }: { blocks: Page["layout"] }) {
    if (!blocks?.length) return null;

    return (
        <>
            {blocks.map((block, i) => {
                const key = block.id ?? i;
                switch (block.blockType) {
                    case "richText":
                        return <RichTextBlock key={key} {...block} />;
                    case "mediaWithText":
                        return <MediaWithTextBlock key={key} {...block} />;
                    case "headingWithList":
                        return <HeadingWithListBlock key={key} {...block} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
