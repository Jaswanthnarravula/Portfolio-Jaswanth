import { profileIdentity } from "./profile";

export const siteNavigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/research", label: "Research" },
  { href: "/gallery", label: "Gallery" },
  { href: "/activities", label: "Activities" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export const socialNavigation = [
  {
    label: "GitHub",
    href: profileIdentity.githubUrl,
  },
  {
    label: "Email",
    href: `mailto:${profileIdentity.email}`,
  },
];
