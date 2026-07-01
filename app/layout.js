import "./globals.css";
import SiteShell from "./components/SiteShell";

export const metadata = {
  title: "Jaswanth Narravula | Portfolio Platform",
  description:
    "Multi-page immersive portfolio platform for Jaswanth Narravula, MS in Computer Science at UAB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
