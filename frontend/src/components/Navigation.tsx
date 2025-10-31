import { useState, useEffect } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/crypto-path-logo.png";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", href: "/", hash: "#home" },
    { label: "About", href: "/", hash: "#about" },
    { label: "Modules", href: "/modules" },
    { label: "Community", href: "/", hash: "#community" },
    { label: "Pricing", href: "/", hash: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Minimal */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Crypto Path" className="h-8 w-auto" />
          </Link>

          {/* Desktop Menu - Cleaner */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => {
              if (item.hash) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={(e) => {
                      if (location.pathname === item.href) {
                        e.preventDefault();
                        document.querySelector(item.hash)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-card/50 border border-border/30">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="border-border/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" variant="outline" className="border-border/50">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-border/30 animate-slide-in">
            <div className="flex flex-col space-y-4 pt-4">
              {menuItems.map((item) => {
                if (item.hash) {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={(e) => {
                        if (location.pathname === item.href) {
                          e.preventDefault();
                          document.querySelector(item.hash)?.scrollIntoView({ behavior: 'smooth' });
                        }
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/30 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-card/50 border border-border/30">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
