
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEDI | Personal Healthcare Companion",
  description:
    "A personal healthcare companion connecting your health history, prescribed treatments and everyday care.",
  applicationName: "MEDI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
