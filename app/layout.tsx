import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clawd Up — Your AI Agent. Your Server. Your Rules.",
  description: "Self-hosted AI agents for solo founders. Three agents, one install command. Scout finds opportunities. Researcher validates them. Operator runs your pipeline. $19 one-time + $9/mo.",
  openGraph: {
    title: "Clawd Up — Your AI Agent. Your Server. Your Rules.",
    description: "Self-hosted AI agents for solo founders. Three agents. One install command. Pipeline running by morning.",
    type: "website",
    url: "https://clawd-up.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clawd Up — Your AI Agent. Your Server. Your Rules.",
    description: "Self-hosted AI agents for solo founders. Three agents. One install command. $19 one-time.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
