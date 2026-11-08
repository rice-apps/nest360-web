import type { Page } from "@/payload-types";

import { HeadingWithListBlock } from "./blocks/HeadingWithListBlock";
import { MediaWithTextBlock } from "./blocks/MediaWithTextBlock";
import { RichTextBlock } from "./blocks/RichTextBlock";
import { SubsectionBlock } from "./blocks/SubsectionBlock";

// Picks the component for each block, in the order the editor arranged them.
// Payload owns each block's fields (blocks/); these components own how they look.
export function RenderBlocks({ blocks }: { blocks: Page["layout"] | null | undefined }) {
    if (!blocks?.length) return null; // drafts can be saved with no sections

    return (
        <>
            {blocks.map((block, i) => {
                const key = block.id ?? i;
                switch (block.blockType) {
                    case "subsection":
                        return <SubsectionBlock key={key} {...block} />;
                    case "richText":
                        return <RichTextBlock key={key} {...block} />;
                    case "mediaWithText":
                        return <MediaWithTextBlock key={key} {...block} />;
                    case "headingWithList":
                        return <HeadingWithListBlock key={key} {...block} />;
                    default:
                        return null; // a block type without a component yet
                }
            })}
        </>
    );
}
