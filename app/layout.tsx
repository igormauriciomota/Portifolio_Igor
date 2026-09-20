import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://igor-mota-portfolio.igormotacontabil.chatgpt.site"),
  title: "Igor Mota | Python & Data Portfolio",
  description: "Portfólio interativo de Igor Mota: Python, Django, SQL, Power BI, análise de dados, APIs, automação e sistemas de negócio.",
  openGraph: {
    title: "Igor Mota | Python & Data Portfolio",
    description: "Python • Django • SQL • Power BI • Dados • Sistemas de Negócio",
    type: "website",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Igor Mota — Python, Dados e Sistemas de Negócio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Igor Mota | Python & Data Portfolio",
    description: "Python • Dados • Sistemas de Negócio",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
