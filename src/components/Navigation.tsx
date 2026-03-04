import { useState } from 'react';
import { Button } from './ui/button';
import { GraduationCap, Menu, X } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={baseUrl || '/'} className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors">
            <GraduationCap className="h-6 w-6" />
            <span>Academic Planner</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href={baseUrl || '/'} className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href={`${baseUrl}planner`} className="text-sm font-medium hover:text-primary transition-colors">
              Planner
            </a>
            <a href={`${baseUrl}about`} className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href={`${baseUrl}faq`} className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </a>
            <a href={`${baseUrl}planner`}>
              <Button>Get Started</Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <a
              href={baseUrl || '/'}
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href={`${baseUrl}planner`}
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Planner
            </a>
            <a
              href={`${baseUrl}about`}
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href={`${baseUrl}faq`}
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              FAQ
            </a>
            <a href={`${baseUrl}planner`}>
              <Button className="w-full">Get Started</Button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
