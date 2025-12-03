import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | How We Handle Your Personal Data | GDPR Compliant",
  description: "Our commitment to protecting your privacy and personal data. GDPR-compliant practices, cookie policy, data retention and your rights explained clearly.",
  keywords: ["privacy policy", "data protection", "GDPR compliance", "personal data"],
  openGraph: {
    title: "Privacy Policy | Group Escape Houses",
    description: "GDPR-compliant privacy practices. How we protect and handle your personal data.",
    url: "https://groupescapehouses.co.uk/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





