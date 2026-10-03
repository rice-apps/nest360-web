import Link from "next/link";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

export interface MapCountry {
  // ISO 3166-1 numeric code, as used by world-atlas (e.g. "404" for Kenya)
  isoNumeric: string;
  name: string;
  href: string;
}

interface Props {
  countries: MapCountry[];
}

const WIDTH = 600;
const HEIGHT = 640;

// Corners of a rough bounding box around Africa, used to frame the projection.
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

// Renders at build/request time as plain SVG (no client JS). Each country is
// its own <path> tagged with data-iso, so hover/click behavior can be added
// later without changing how the map is drawn.
export default function AfricaMap({ countries }: Props) {
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

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Map of Africa highlighting the countries where NEST360 works"
      style={{ width: "100%", maxWidth: WIDTH, height: "auto" }}
    >
      {all.features.map((f) => {
        // A few world-atlas shapes (e.g. Kosovo, Somaliland) have no ISO id,
        // so React keys use the country name instead.
        const id = String(f.id);
        const d = path(f) ?? undefined;
        const country = highlighted.get(id);

        if (!country) {
          return (
            <path key={f.properties.name} d={d} data-iso={id} fill="#e5e7eb" stroke="#fff" strokeWidth={0.5} />
          );
        }

        return (
          <Link key={f.properties.name} href={country.href} aria-label={country.name}>
            <path d={d} data-iso={id} fill="#094267" stroke="#fff" strokeWidth={0.5}>
              <title>{country.name}</title>
            </path>
          </Link>
        );
      })}
    </svg>
  );
}
