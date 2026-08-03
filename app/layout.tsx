import type { Metadata } from "next";
import "./globals.css";

const [githubOwner, githubRepository] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const siteUrl = githubOwner && githubRepository
  ? `https://${githubOwner}.github.io/${githubRepository}/`
  : "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Spin & Win | AppleTree",
  description: "Spin the lucky wheel for a chance to win up to ₦4,000.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Spin & Win | AppleTree",
    description: "Take a lucky spin and win up to ₦4,000.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spin & Win | AppleTree",
    description: "Take a lucky spin and win up to ₦4,000.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
