import ethiopia from "./ethiopia";
import kenya from "./kenya";
import malawi from "./malawi";
import nigeria from "./nigeria";
import tanzania from "./tanzania";
import type { CountryPageData } from "./types";

export type * from "./types";

// Every country NEST360 works in. The order here is the order they appear in
// the header menu and on the Where We Work cards.
// To add a country: create its file in this folder (copy an existing one),
// import it above, and add it to this list. Its page, card, menu link, and map
// highlight are all created from that one entry.
export const countries: CountryPageData[] = [
  ethiopia,
  kenya,
  malawi,
  nigeria,
  tanzania,
];

export function getCountry(slug: string): CountryPageData | undefined {
  return countries.find((country) => country.slug === slug);
}
