import React, { useState } from 'react';
import { Heart, Menu, X, Bot, MapPin, AlertCircle, Search, BookOpen, Shield, Beaker } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenTestRunner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenTestRunner }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'assistant', label: 'PawCare Assistant', icon: Bot, badge: 'AI First-Aid' },
    { id: 'clinics', label: 'Find Clinics', icon: MapPin },
    { id: 'report', label: 'Report Rescue', icon: AlertCircle },
    { id: 'track', label: 'Track Report', icon: Search },
    { id: 'resources', label: 'Wellness Guides', icon: BookOpen },
    { id: 'admin', label: 'Admin', icon: Shield },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-offwhite/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-forest flex items-center justify-center text-white shadow-subtle group-hover:bg-brand-forestLight transition-colors">
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-brand-forestDark">
                  PawCare
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] font-medium tracking-wide text-brand-muted hidden sm:block">
                Every Paw Deserves Care.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-brand-forest bg-brand-sage/60 font-semibold shadow-xs'
                      : 'text-brand-charcoal/80 hover:text-brand-forest hover:bg-brand-beige/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-forest' : 'text-brand-muted'}`} />
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] bg-brand-forest text-white px-1.5 py-0.5 rounded-full font-semibold ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Test Scenarios Runner Shortcut */}
            {onOpenTestRunner && (
              <button
                onClick={onOpenTestRunner}
                title="Run Automated 14-Scenario Safety Test Suite"
                className="ml-2 p-2 text-xs font-semibold rounded-lg border border-brand-forest/20 text-brand-forest bg-brand-sageLight hover:bg-brand-sage transition-all flex items-center gap-1"
              >
                <Beaker className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Safety Tests</span>
              </button>
            )}
          </nav>

          {/* Emergency Direct Action */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('assistant')}
              className="px-4 py-2 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 animate-bounce" />
              Emergency Triage
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            {onOpenTestRunner && (
              <button
                onClick={onOpenTestRunner}
                className="p-2 text-xs rounded-lg border border-brand-forest/20 text-brand-forest bg-brand-sageLight"
                title="Test Runner"
              >
                <Beaker className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-charcoal hover:bg-brand-sage/40 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-brand-offwhite px-4 pt-2 pb-6 space-y-1 shadow-card animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-brand-forest bg-brand-sage font-semibold'
                    : 'text-brand-charcoal hover:bg-brand-beige/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-brand-forest" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-brand-forest text-white px-2 py-0.5 rounded-full font-semibold">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
