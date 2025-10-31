import { MessageCircle, Share2, Instagram, Twitter } from "lucide-react";
import logo from "@/assets/crypto-path-logo.png";

const footerLinks = {
  quickLinks: [
    { label: "About", href: "#about" },
    { label: "Courses", href: "#courses" },
    { label: "Community", href: "#community" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Blog", href: "#blog" },
    { label: "FAQs", href: "#faqs" },
    { label: "Terms", href: "#terms" },
    { label: "Privacy", href: "#privacy" },
  ],
  social: [
    { icon: MessageCircle, label: "Telegram", href: "#" },
    { icon: Share2, label: "Discord", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-background border-t border-primary/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div>
            <img src={logo} alt="Crypto Path Community" className="h-12 w-auto mb-4" />
            <p className="text-muted-foreground">
              Building Indonesia's premier crypto trading community with education and innovation
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Connect With Us</h3>
            <div className="flex gap-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/20 mb-8"></div>

        {/* Copyright */}
        <div className="text-center text-muted-foreground">
          <p>© 2025 Crypto Path Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
