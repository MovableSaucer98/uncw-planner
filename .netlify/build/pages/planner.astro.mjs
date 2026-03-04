import { d as createComponent, j as renderComponent, r as renderTemplate } from '../chunks/astro/server_DcOURZYG.mjs';
import 'kleur/colors';
import { $ as $$Main } from '../chunks/main_CbAksAM4.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Planner = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "pageClass": "planner-page", "data-astro-cid-kn7gz6ds": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PlannerComponent", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-kn7gz6ds": true, "client:component-path": "/app/src/components/Planner", "client:component-export": "default" })} ` })} `;
}, "/app/src/pages/planner.astro", void 0);

const $$file = "/app/src/pages/planner.astro";
const $$url = "/planner";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Planner,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
