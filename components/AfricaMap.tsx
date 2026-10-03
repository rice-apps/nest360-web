import Link from "next/link";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import type { CountryPageData } from "@/lib/data/countries";

type MapCountry = Pick<CountryPageData, "slug" | "name" | "isoNumeric" | "mapLabelPosition">;

const WIDTH = 600;
const HEIGHT = 640;

// Corners of a rough bounding box around Africa, used to frame the map.
// (MultiPoint rather than Polygon so d3's winding-order rules don't apply.)
const AFRICA_BOUNDS: Feature = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "MultiPoint",
    coordinates: [
      [-20, -36],
      [55, 38],
    ],
  },
};

// Map of Africa with NEST360's countries highlighted and linked to their
// pages. Drawn on the server as plain SVG (no client JavaScript). Each
// country's hover label sits at its `mapLabelPosition` (lib/data/countries);
// labels are drawn above every country and shown with CSS :has() when their
// country is hovered or keyboard-focused.
export default function AfricaMap({ countries }: { countries: MapCountry[] }) {
  const topology = world as unknown as Topology<{
    countries: GeometryCollection<{ name: string }>;
  }>;
  const all = feature(topology, topology.objects.countries) as FeatureCollection<
    Geometry,
    { name: string }
  >;

  const projection = geoMercator().fitSize([WIDTH, HEIGHT], AFRICA_BOUNDS);
  const path = geoPath(projection);
  const highlighted = new Map(countries.map((c) => [c.isoNumeric, c]));

  const labelCss = countries
    .map(
      ({ isoNumeric: iso }) =>
        `.africa-map:has([data-iso="${iso}"]:hover) [data-label-for="${iso}"],` +
        `.africa-map:has(a:focus-visible [data-iso="${iso}"]) [data-label-for="${iso}"] { opacity: 1; }`,
    )
    .join("\n");

  return (
    <svg
      className="africa-map h-auto w-full max-w-xl"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Map of Africa highlighting the countries where NEST360 works"
    >
      {all.features.map((f) => {
        // A few world-atlas shapes (e.g. Kosovo, Somaliland) have no ISO id,
        // so React keys use the country name instead.
        const id = String(f.id);
        const d = path(f) ?? undefined;
        const country = highlighted.get(id);

        if (!country) {
          return (
            <path key={f.properties.name} d={d} data-iso={id} className="fill-gray-200 stroke-white" strokeWidth={0.5} />
          );
        }

        return (
          <Link key={f.properties.name} href={`/${country.slug}`} aria-label={country.name}>
            <path d={d} data-iso={id} className="fill-brand-primary stroke-white" strokeWidth={0.5} />
          </Link>
        );
      })}

      <style>{labelCss}</style>
      <g aria-hidden="true" pointerEvents="none">
        {countries.map((c) => {
          const [x, y] = projection(c.mapLabelPosition) ?? [0, 0];
          return (
            <text
              key={c.isoNumeric}
              data-label-for={c.isoNumeric}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-brand-primary stroke-white text-sm font-semibold"
              strokeWidth={3}
              paintOrder="stroke"
              opacity={0}
            >
              {c.name}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
