import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passion Discovery Test - Find Your True Passion in 15 Minutes | Pravay",
  description: "Stop feeling lost and unfulfilled. Take our AI-powered passion discovery test and find what truly excites you. Get personalized matches and action plans in just 15 minutes.",
  keywords: "passion test, find your passion, career change, life purpose, passion discovery, AI assessment, free test",
  openGraph: {
    title: "Passion Discovery Test - Find Your True Passion",
    description: "Stop feeling lost and unfulfilled. Take our AI-powered passion discovery test and find what truly excites you.",
    type: "website",
    url: "https://pravay.com/passiontest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passion Discovery Test - Find Your True Passion",
    description: "Stop feeling lost and unfulfilled. Take our AI-powered passion discovery test and find what truly excites you.",
  },
  alternates: {
    canonical: "https://pravay.com/passiontest",
  },
};

export default function PassionTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
