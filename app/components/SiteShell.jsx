"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FloatingDepthField from "./FloatingDepthField";
import CustomCursor from "./CustomCursor";
import { siteNavigation } from "../data/navigation";
import { profileIdentity, profileSocialLinks } from "../data/profile";

const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        minHeight: 40,
        padding: "8px 14px",
        borderRadius: 999,
        textDecoration: "none",
        fontSize: 15,
        fontWeight: active ? 600 : 500,
        color: active ? "#ffffff" : "var(--text-primary)",
        background: active ? "var(--accent-blue)" : "transparent",
        transition: "all 220ms ease",
      }}
    >
      {label}
    </Link>
  );
}

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = window.localStorage?.getItem("color-mode");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("color-mode", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const syncViewport = () => {
      setIsMobile(window.innerWidth < 992);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const currentTitle = useMemo(() => {
    const matched = siteNavigation.find((entry) => {
      if (entry.href === "/") {
        return pathname === "/";
      }

      return pathname.startsWith(entry.href);
    });

    return matched?.label ?? "Portfolio";
  }, [pathname]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--background-primary)",
        color: "var(--text-primary)",
        fontFamily:
          "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        cursor: "auto",
      }}
    >
      <CustomCursor disabled={isMobile} />

      <FloatingDepthField isMobile={isMobile} />

      <header
        style={{
          position: "fixed",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1240px, calc(100% - 20px))",
          zIndex: 1200,
          borderRadius: 999,
          border: "1px solid rgba(210,210,215,0.9)",
          background: "var(--surface-card)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            minHeight: 62,
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Link
            href="/"
            data-cursor="hover"
            style={{
              minHeight: 40,
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              textDecoration: "none",
              color: "var(--text-primary)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontFamily:
                  "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontSize: 17,
                }}
              >
                {profileIdentity.name}
              </span>
            </Link>

          {isMobile ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  paddingInline: 6,
                }}
              >
                {currentTitle}
              </span>
              <button
                type="button"
                aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                data-cursor="hover"
                onClick={toggleTheme}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  color: "var(--text-primary)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setMenuOpen((previous) => !previous)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid var(--border-light)",
                  background: "var(--background-primary)",
                  color: "var(--text-primary)",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
                aria-label="Open navigation menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          ) : (
            <>
              <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {siteNavigation.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      active={active}
                    />
                  );
                })}
              </nav>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                  data-cursor="hover"
                  onClick={toggleTheme}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    border: "1px solid var(--border-light)",
                    background: "var(--background-primary)",
                    color: "var(--text-primary)",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                {profileSocialLinks.map((entry) => {
                  const Icon = socialIconMap[entry.icon];

                  return (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      target={entry.href.startsWith("http") ? "_blank" : undefined}
                      rel={entry.href.startsWith("http") ? "noreferrer" : undefined}
                      data-cursor="hover"
                      aria-label={entry.label}
                      title={entry.label}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: "1px solid var(--border-light)",
                        background: "var(--background-primary)",
                        color: "var(--text-primary)",
                        display: "grid",
                        placeItems: "center",
                        textDecoration: "none",
                      }}
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && isMobile ? (
          <motion.aside
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 82,
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 20px)",
              zIndex: 1150,
              borderRadius: 22,
              border: "1px solid rgba(210,210,215,0.9)",
              background: "var(--surface-card-strong)",
              backdropFilter: "blur(18px)",
              padding: 12,
              boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
            }}
          >
            <nav style={{ display: "grid", gap: 6 }}>
              {siteNavigation.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={active}
                  />
                );
              })}
            </nav>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <div style={{ position: "relative", zIndex: 1, paddingTop: 96, paddingBottom: 30 }}>
        {children}
      </div>
    </div>
  );
}
