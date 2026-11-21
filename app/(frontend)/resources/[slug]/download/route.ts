import { getProjectBySlug, projectFiles } from '@/lib/data/projects';
import { zipResponse } from '@/lib/zipDownload';

// "Download all" on a project page, e.g. /resources/clinical-job-aids/download (see lib/zipDownload.ts)
export async function GET(request: Request, ctx: RouteContext<'/resources/[slug]/download'>) {
  const { slug } = await ctx.params;
  const project = await getProjectBySlug(slug);
  return zipResponse(request, slug, project ? projectFiles(project) : []);
}
