import { HeadingWithList } from './HeadingWithList'
import { MediaWithText } from './MediaWithText'
import { RichText } from './RichText'
import { Subsection } from './Subsection'

// Every layout an editor can pick for a page section. A new layout gets a config file here,
// a component in components/blocks/, and a case in components/RenderBlocks.tsx.
export const pageBlocks = [Subsection, RichText, MediaWithText, HeadingWithList]
