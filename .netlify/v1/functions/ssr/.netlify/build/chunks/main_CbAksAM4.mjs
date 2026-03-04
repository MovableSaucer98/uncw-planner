import { d as createComponent, e as createAstro, g as addAttribute, k as renderHead, j as renderComponent, l as renderSlot, r as renderTemplate } from './astro/server_DcOURZYG.mjs';
import 'kleur/colors';
/* empty css                         */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GraduationCap, X, Menu } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

const baseUrl = "/";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsx("nav", { className: "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs("a", { href: baseUrl, className: "flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors", children: [
        /* @__PURE__ */ jsx(GraduationCap, { className: "h-6 w-6" }),
        /* @__PURE__ */ jsx("span", { children: "Academic Planner" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("a", { href: baseUrl, className: "text-sm font-medium hover:text-primary transition-colors", children: "Home" }),
        /* @__PURE__ */ jsx("a", { href: `${baseUrl}planner`, className: "text-sm font-medium hover:text-primary transition-colors", children: "Planner" }),
        /* @__PURE__ */ jsx("a", { href: `${baseUrl}about`, className: "text-sm font-medium hover:text-primary transition-colors", children: "About" }),
        /* @__PURE__ */ jsx("a", { href: `${baseUrl}faq`, className: "text-sm font-medium hover:text-primary transition-colors", children: "FAQ" }),
        /* @__PURE__ */ jsx("a", { href: `${baseUrl}planner`, children: /* @__PURE__ */ jsx(Button, { children: "Get Started" }) })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "md:hidden p-2",
          onClick: () => setIsOpen(!isOpen),
          "aria-label": "Toggle menu",
          children: isOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
        }
      )
    ] }),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden py-4 space-y-3 border-t", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: baseUrl,
          className: "block py-2 text-sm font-medium hover:text-primary transition-colors",
          children: "Home"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${baseUrl}planner`,
          className: "block py-2 text-sm font-medium hover:text-primary transition-colors",
          children: "Planner"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${baseUrl}about`,
          className: "block py-2 text-sm font-medium hover:text-primary transition-colors",
          children: "About"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${baseUrl}faq`,
          className: "block py-2 text-sm font-medium hover:text-primary transition-colors",
          children: "FAQ"
        }
      ),
      /* @__PURE__ */ jsx("a", { href: `${baseUrl}planner`, children: /* @__PURE__ */ jsx(Button, { className: "w-full", children: "Get Started" }) })
    ] })
  ] }) });
}

function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t bg-muted/50 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-xl mb-4", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "h-6 w-6" }),
          /* @__PURE__ */ jsx("span", { children: "Academic Planner" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "AI-powered university schedule planning for student success" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Quick Links" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: baseUrl, className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: "Home" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `${baseUrl}planner`, className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: "Planner" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `${baseUrl}about`, className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: "About" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: `${baseUrl}faq`, className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: "FAQ" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Resources" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Documentation" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Tutorials" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Support" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Privacy Policy" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-4", children: "Connect" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Contact Us" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Feedback" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Twitter" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "GitHub" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t mt-8 pt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Academic Planner. All rights reserved."
    ] }) })
  ] }) });
}

const $$Astro = createAstro();
const $$Main = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Main;
  const { pageClass = "" } = Astro2.props;
  return renderTemplate`<html lang="en"${addAttribute(pageClass, "class")}> <head><meta charset="utf-8"><link rel="icon" type="image/png" href="/favicon.ico"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Academic Planner</title>${renderHead()}</head> <!-- Dark mode class injection point - will be replaced with \`dark\` class based on your site palette --> <body class="__DARK_MODE_CLASS__ flex flex-col min-h-screen"> ${renderComponent($$result, "Navigation", Navigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/Navigation", "client:component-export": "default" })} <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/app/src/components/Footer", "client:component-export": "default" })} </body></html>`;
}, "/app/src/layouts/main.astro", void 0);

export { $$Main as $, Button as B, baseUrl as b };
