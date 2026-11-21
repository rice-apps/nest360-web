import type { Footer } from "@/payload-types";

type Platform = NonNullable<Footer["socials"]>[number]["platform"];

// Brand color behind each icon, matching the squares in the design
export const socialColors: Record<Platform, string> = {
    Facebook: "#3b5998",
    X: "#000000",
    Instagram: "#e4405f",
    LinkedIn: "#0a66c2",
    YouTube: "#a82400",
};

// Simple outline logos drawn in white on the brand-colored square
export function SocialIcon({ platform }: { platform: Platform }) {
    const props = {
        "aria-hidden": true,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: "h-5 w-5",
    };
    switch (platform) {
        case "Facebook":
            return <svg {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
        case "X":
            return <svg {...props}><path d="M4 4l11.733 16H20L8.267 4z" /><path d="M4 20l6.768-6.768M13.228 10.772L20 4" /></svg>;
        case "Instagram":
            return (
                <svg {...props}>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <path d="M17.5 6.5h.01" />
                </svg>
            );
        case "LinkedIn":
            return (
                <svg {...props}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                    <path d="M2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            );
        case "YouTube":
            return (
                <svg {...props}>
                    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                </svg>
            );
    }
}
