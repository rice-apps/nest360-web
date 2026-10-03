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

// Where each NEST360 country's hover label sits, as [longitude, latitude],
// keyed by ISO numeric code. Hand-placed near each country's middle; a
// country only gets a hover label once it has an entry here.
const LABEL_POSITIONS: Record<string, [number, number]> = {
  "231": [39.6, 8.6], // Ethiopia
  "404": [37.9, 0.4], // Kenya
  "454": [34.2, -13.3], // Malawi
  "566": [8.1, 9.5], // Nigeria
};

// Renders at build/request time as plain SVG (no client JS). Each country is
// its own <path> tagged with data-iso. Hover labels are drawn in a layer on
// top of every country (so neighbors don't cover them) and shown with CSS
// :has() when their country is hovered or keyboard-focused.
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
  const labelled = countries.filter((c) => LABEL_POSITIONS[c.isoNumeric]);
  const labelCss = labelled
    .map(
      ({ isoNumeric: iso }) =>
        `.africa-map:has([data-iso="${iso}"]:hover) [data-label-for="${iso}"],` +
        `.africa-map:has(a:focus-visible [data-iso="${iso}"]) [data-label-for="${iso}"] { opacity: 1; }`,
    )
    .join("\n");

  return (
    <svg
      className="africa-map"
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
              {!LABEL_POSITIONS[id] && <title>{country.name}</title>}
            </path>
          </Link>
        );
      })}

      <style>{labelCss}</style>
      <g aria-hidden="true" pointerEvents="none">
        {labelled.map((c) => {
          const [x, y] = projection(LABEL_POSITIONS[c.isoNumeric]) ?? [0, 0];
          return (
            <text
              key={c.isoNumeric}
              data-label-for={c.isoNumeric}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fontWeight={600}
              fill="#004167"
              stroke="#fff"
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
