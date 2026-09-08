import type { Metadata } from "next";
import rawData from "@/data/cases.json";
import "./globals.css";

export const metadata: Metadata = {
  title: "Banco de casos de uso · Microsoft 365 Copilot · Deloitte",
  description: `${rawData.cases.length} casos de uso para encontrar tareas, herramientas y ejemplos de Microsoft 365 Copilot aplicables a tu trabajo en Deloitte.`,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
