// Simple social media icons, drawn in the current text color.

const paths = {
  facebook:
    "M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z",
  x: "M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.2L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.3 5.7L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z",
  instagram:
    "M12 7.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.9a3.1 3.1 0 110-6.2 3.1 3.1 0 010 6.2zM17 5.8a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2zM16.4 3H7.6A4.6 4.6 0 003 7.6v8.8A4.6 4.6 0 007.6 21h8.8a4.6 4.6 0 004.6-4.6V7.6A4.6 4.6 0 0016.4 3zm2.9 13.4a2.9 2.9 0 01-2.9 2.9H7.6a2.9 2.9 0 01-2.9-2.9V7.6a2.9 2.9 0 012.9-2.9h8.8a2.9 2.9 0 012.9 2.9v8.8z",
  linkedin:
    "M5 9h3v11H5V9zm1.5-5a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10 9h2.9v1.5c.4-.8 1.4-1.7 3-1.7 3.1 0 3.6 2 3.6 4.7V20h-3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20h-3V9z",
  youtube:
    "M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z",
};

export type SocialIconName = keyof typeof paths;

export default function SocialIcon({
  name,
  className = "h-5 w-5",
}: {
  name: SocialIconName;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}
