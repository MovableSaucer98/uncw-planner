import { d as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DcOURZYG.mjs';
import 'kleur/colors';
import { $ as $$Main, b as baseUrl, B as Button } from '../chunks/main_CbAksAM4.mjs';
import { HelpCircle } from 'lucide-react';
/* empty css                               */
export { renderers } from '../renderers.mjs';

const $$Faq = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, { "data-astro-cid-6kmwghhu": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-b from-background to-muted" data-astro-cid-6kmwghhu> <div class="container mx-auto px-6 py-16" data-astro-cid-6kmwghhu> <!-- Header --> <div class="text-center max-w-3xl mx-auto mb-16" data-astro-cid-6kmwghhu> <div class="flex justify-center mb-6" data-astro-cid-6kmwghhu> ${renderComponent($$result2, "HelpCircle", HelpCircle, { "className": "h-16 w-16 text-primary", "data-astro-cid-6kmwghhu": true })} </div> <h1 class="text-4xl font-bold mb-4" data-astro-cid-6kmwghhu>Frequently Asked Questions</h1> <p class="text-xl text-muted-foreground" data-astro-cid-6kmwghhu>
Find answers to common questions about Academic Planner
</p> </div> <!-- FAQ Accordion --> <div class="max-w-4xl mx-auto mb-16" data-astro-cid-6kmwghhu> <div class="bg-card border rounded-lg p-8" data-astro-cid-6kmwghhu> <div class="faq-accordion" data-astro-cid-6kmwghhu> <div class="space-y-4" data-astro-cid-6kmwghhu> <!-- General Questions --> <h2 class="text-2xl font-bold mb-4" data-astro-cid-6kmwghhu>General Questions</h2> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>What is Academic Planner?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Academic Planner is an AI-powered tool that helps university students create 
                    multi-semester course schedules based on their major, completed coursework, 
                    constraints, and career goals. It automates the complex process of degree planning 
                    while ensuring all requirements are met.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>How does the AI generate my plan?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Our AI analyzes your major requirements, prerequisite chains, completed courses, 
                    and personal constraints to create an optimized semester-by-semester plan. It 
                    considers course availability, workload balance, and career alignment to suggest 
                    the best path forward.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>Is my data secure?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Yes. All your academic information is processed securely and is never shared with 
                    third parties. We use industry-standard encryption and security practices to protect 
                    your data.
</div> </details> </div> <!-- Using the Planner --> <h2 class="text-2xl font-bold mb-4 mt-8" data-astro-cid-6kmwghhu>Using the Planner</h2> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>What information do I need to get started?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
At minimum, you need your major. However, for best results, also provide your 
                    completed courses, any minor you're pursuing, credit hour preferences, and your 
                    desired career path. The more information you provide, the better your plan will be.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>Can I modify the generated plan?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Absolutely! The generated plan is a starting point. You can move courses between 
                    semesters, swap courses for alternatives, remove courses, and then recalculate 
                    your plan. The planner is designed to be flexible and adapt to your needs.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>What are "Required", "Flexible", and "Locked" courses?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Required</strong> (green) courses are mandatory for your degree.
<strong data-astro-cid-6kmwghhu>Flexible</strong> (blue) courses have alternative sections, times, or 
                    equivalent courses you can swap. <strong data-astro-cid-6kmwghhu>Locked</strong> (orange) courses have no 
                    flexibility—they must be taken in that specific semester and section.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>Can I include summer semesters?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Yes! Simply check the "Include Summer Terms" option in the Constraints section. 
                    The AI will incorporate summer sessions into your plan, which can help you graduate 
                    earlier or balance your workload.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>What's the difference between "Recalculate" and "Revert Changes"?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Recalculate</strong> regenerates your plan based on your current inputs 
                    and any modifications you've made. <strong data-astro-cid-6kmwghhu>Revert Changes</strong> discards all 
                    modifications and returns you to a blank slate, requiring you to generate a new 
                    base plan.
</div> </details> </div> <!-- Course Management --> <h2 class="text-2xl font-bold mb-4 mt-8" data-astro-cid-6kmwghhu>Course Management</h2> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>How do I add completed courses?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
In the left panel, navigate to the "Completed" tab, enter the course code, and 
                    click the + button. These courses will be excluded from your plan and their 
                    prerequisites will be marked as satisfied.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>What are "Must-Take" and "Do-Not-Take" courses?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu> <strong data-astro-cid-6kmwghhu>Must-Take</strong> courses are ones you specifically want included in your 
                    plan (perhaps electives that interest you or requirements for a second major).
<strong data-astro-cid-6kmwghhu>Do-Not-Take</strong> courses are ones you want to avoid, even if they meet 
                    requirements.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>What if a course has multiple sections or time slots?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Courses with multiple options will be marked as "Flexible" (blue). When you click 
                    on the course in the schedule, you'll see alternative sections, times, and 
                    professors in the Course Details panel.
</div> </details> </div> <!-- Technical Questions --> <h2 class="text-2xl font-bold mb-4 mt-8" data-astro-cid-6kmwghhu>Technical Questions</h2> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>Do I need to create an account?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Currently, Academic Planner works without an account. However, this means your 
                    plans are stored locally in your browser. We recommend saving or exporting your 
                    plan once created.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>Which browsers are supported?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Academic Planner works best on modern browsers including Chrome, Firefox, Safari, 
                    and Edge. We recommend keeping your browser up to date for the best experience.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>Can I print or export my plan?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
Export and print features are coming soon! For now, you can take screenshots of 
                    your plan or copy the course information from the schedule view.
</div> </details> </div> <div class="border rounded-lg" data-astro-cid-6kmwghhu> <details class="group" data-astro-cid-6kmwghhu> <summary class="flex justify-between items-center cursor-pointer p-4 hover:bg-muted transition-colors" data-astro-cid-6kmwghhu> <span class="font-semibold" data-astro-cid-6kmwghhu>I found a bug. How do I report it?</span> <span class="transform group-open:rotate-180 transition-transform" data-astro-cid-6kmwghhu>▼</span> </summary> <div class="p-4 pt-0 text-muted-foreground" data-astro-cid-6kmwghhu>
We appreciate bug reports! Please note what you were doing when the bug occurred, 
                    what happened versus what you expected, and any error messages. Contact information 
                    coming soon.
</div> </details> </div> </div> </div> </div> </div> <!-- Still Have Questions? --> <div class="text-center max-w-2xl mx-auto" data-astro-cid-6kmwghhu> <h2 class="text-2xl font-bold mb-4" data-astro-cid-6kmwghhu>Still Have Questions?</h2> <p class="text-muted-foreground mb-8" data-astro-cid-6kmwghhu>
Can't find what you're looking for? Learn more about how Academic Planner works.
</p> <div class="flex gap-4 justify-center" data-astro-cid-6kmwghhu> <a${addAttribute(`${baseUrl}about`, "href")} data-astro-cid-6kmwghhu> ${renderComponent($$result2, "Button", Button, { "size": "lg", "variant": "outline", "data-astro-cid-6kmwghhu": true }, { "default": ($$result3) => renderTemplate`
About Us
` })} </a> <a${addAttribute(`${baseUrl}planner`, "href")} data-astro-cid-6kmwghhu> ${renderComponent($$result2, "Button", Button, { "size": "lg", "data-astro-cid-6kmwghhu": true }, { "default": ($$result3) => renderTemplate`
Start Planning
` })} </a> </div> </div> </div> </div> ` })} `;
}, "/app/src/pages/faq.astro", void 0);

const $$file = "/app/src/pages/faq.astro";
const $$url = "/faq";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
