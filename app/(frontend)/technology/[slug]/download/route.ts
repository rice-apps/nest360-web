import { projectFiles } from '@/lib/data/projects';
import { getTechnologyBySlug } from '@/lib/data/technologies';
import { zipResponse } from '@/lib/zipDownload';

// "Download all" on a technology page, e.g. /technology/syringe-pump/download (see lib/zipDownload.ts)
export async function GET(request: Request, ctx: RouteContext<'/technology/[slug]/download'>) {
  const { slug } = await ctx.params;
  const technology = await getTechnologyBySlug(slug);
  return zipResponse(request, slug, technology ? projectFiles(technology) : []);
}
