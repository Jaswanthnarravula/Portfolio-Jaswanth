import "./globals.css";
import IntroProvider from "./components/IntroProvider";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import SiteShell from "./components/SiteShell";
import SmoothScroll from "./components/SmoothScroll";

export const metadata = {
  title: "Jaswanth Narravula | Portfolio Platform",
  description:
    "Multi-page immersive portfolio platform for Jaswanth Narravula, MS in Computer Science at UAB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <IntroProvider>
          <Preloader />
          <ScrollProgress />
          <SmoothScroll>
            <SiteShell>{children}</SiteShell>
          </SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
