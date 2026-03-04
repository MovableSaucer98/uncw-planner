import { GraduationCap } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <GraduationCap className="h-6 w-6" />
              <span>Academic Planner</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered university schedule planning for student success
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href={baseUrl || '/'} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href={`${baseUrl}planner`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Planner
                </a>
              </li>
              <li>
                <a href={`${baseUrl}about`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href={`${baseUrl}faq`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Documentation</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Tutorials</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Support</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Contact Us</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Feedback</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Twitter</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">GitHub</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Academic Planner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
