import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, BookOpen, AppWindow, Twitter, Instagram, MessageCircle, BarChart2, Menu, X } from "lucide-react";
import { cn } from '@/lib/utils';
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <header className="w-full relative">
      <div className="px-4 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="https://dehub.io" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <img src="/lovable-uploads/574b9d8d-10f7-42af-8534-4d0a606c9aa3.png" alt="DeHub Logo" className="h-10 w-auto mr-2" />
              
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:bg-slate-800">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavButtons />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("absolute top-full left-0 w-full bg-slate-900 border-t border-slate-800 z-50 md:hidden transition-all duration-300 ease-in-out", isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none")}>
        <div className="px-4 py-4 flex flex-col space-y-2">
          <NavButtons isMobile />
        </div>
      </div>
    </header>;
};
interface NavButtonsProps {
  isMobile?: boolean;
}
const NavButtons: React.FC<NavButtonsProps> = ({
  isMobile = false
}) => {
  const buttonVariant = isMobile ? "ghost" : "outline";
  const buttonSize = isMobile ? "default" : "sm";
  const buttonClass = isMobile ? "justify-start w-full" : "";
  const links = [{
    name: "App",
    href: "https://dehub.io",
    icon: <AppWindow size={16} />
  }, {
    name: "Web",
    href: "https://dehub.net",
    icon: <Globe size={16} />
  }, {
    name: "Docs",
    href: "https://dehub.gitbook.io",
    icon: <BookOpen size={16} />
  }, {
    name: "Telegram",
    href: "https://t.me/dehubportal",
    icon: <MessageCircle size={16} />
  }, {
    name: "X",
    href: "https://x.com/dehub_official",
    icon: <Twitter size={16} />
  }, {
    name: "Instagram",
    href: "https://instagram.com/dehub_official",
    icon: <Instagram size={16} />
  }, {
    name: "CoinGecko",
    href: "https://www.coingecko.com/en/coins/dehub",
    icon: <BarChart2 size={16} />
  }, {
    name: "CoinMarketCap",
    href: "https://coinmarketcap.com/currencies/dehub/",
    icon: <BarChart2 size={16} />
  }];
  return <>
      {links.map(link => <Button key={link.name} variant={buttonVariant} size={buttonSize} className={cn("text-white border-slate-700 hover:bg-slate-800 hover:text-white transition-all", buttonClass)} asChild>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            {link.icon}
            <span className="ml-2">{link.name}</span>
          </a>
        </Button>)}
    </>;
};
export default Header;