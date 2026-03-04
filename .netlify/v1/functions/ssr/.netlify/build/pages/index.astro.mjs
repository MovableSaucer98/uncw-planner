import { d as createComponent, j as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DcOURZYG.mjs';
import 'kleur/colors';
import { $ as $$Main, b as baseUrl } from '../chunks/main_CbAksAM4.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$Main, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-b from-background to-muted"> <!-- Hero Section --> <section class="container mx-auto px-6 py-20"> <div class="text-center max-w-4xl mx-auto"> <div class="flex justify-center mb-6"> <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg> </div> <h1 class="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
Academic Planner
</h1> <p class="text-xl text-muted-foreground mb-8">
AI-powered university schedule planning that adapts to your goals, constraints, and career aspirations
</p> <div class="flex gap-4 justify-center"> <a${addAttribute(`${baseUrl}planner`, "href")} class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-lg">
Start Planning
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg> </a> <a${addAttribute(`${baseUrl}about`, "href")} class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 text-lg">
Learn More
</a> </div> </div> </section> <!-- Features Section --> <section class="container mx-auto px-6 py-16"> <div class="grid md:grid-cols-3 gap-8"> <div class="text-center"> <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg> </div> <h3 class="text-xl font-semibold mb-3">AI-Powered Generation</h3> <p class="text-muted-foreground">
Generate multi-semester plans instantly based on your major, completed courses, and career goals
</p> </div> <div class="text-center"> <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg> </div> <h3 class="text-xl font-semibold mb-3">Flexible Scheduling</h3> <p class="text-muted-foreground">
Customize credit hours per term, add summer sessions, and adjust your plan as needed
</p> </div> <div class="text-center"> <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> </div> <h3 class="text-xl font-semibold mb-3">Course Management</h3> <p class="text-muted-foreground">
Track completed courses, set must-take requirements, and avoid specific classes
</p> </div> </div> </section> <!-- How It Works Section --> <section class="container mx-auto px-6 py-16"> <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2> <div class="max-w-3xl mx-auto space-y-6"> <div class="flex gap-4 items-start"> <div class="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
1
</div> <div> <h4 class="font-semibold text-lg mb-2">Enter Your Profile</h4> <p class="text-muted-foreground">
Input your major, minor, desired career path, and any completed coursework
</p> </div> </div> <div class="flex gap-4 items-start"> <div class="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
2
</div> <div> <h4 class="font-semibold text-lg mb-2">Set Your Constraints</h4> <p class="text-muted-foreground">
Define credit hour limits per term, include summer sessions, and specify must-take or avoid courses
</p> </div> </div> <div class="flex gap-4 items-start"> <div class="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
3
</div> <div> <h4 class="font-semibold text-lg mb-2">Generate Your Plan</h4> <p class="text-muted-foreground">
Let AI create a complete multi-semester schedule optimized for your success
</p> </div> </div> <div class="flex gap-4 items-start"> <div class="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">
4
</div> <div> <h4 class="font-semibold text-lg mb-2">Customize & Refine</h4> <p class="text-muted-foreground">
Review course details, swap classes, adjust semesters, and recalculate as needed
</p> </div> </div> </div> </section> <!-- Benefits Section --> <section class="container mx-auto px-6 py-16 mb-16"> <div class="bg-card border rounded-lg p-8 max-w-4xl mx-auto"> <h2 class="text-3xl font-bold text-center mb-8">Why Use Academic Planner?</h2> <div class="grid md:grid-cols-2 gap-6"> <div class="flex gap-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12a10 10 0 1 0 20 0 10 10 0 1 0 0-20 10 10 0 1 0 0 20z"></path></svg> <div> <h4 class="font-semibold mb-1">Save Time</h4> <p class="text-sm text-muted-foreground">
Generate complete degree plans in seconds instead of hours
</p> </div> </div> <div class="flex gap-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12a10 10 0 1 0 20 0 10 10 0 1 0 0-20 10 10 0 1 0 0 20z"></path></svg> <div> <h4 class="font-semibold mb-1">Avoid Mistakes</h4> <p class="text-sm text-muted-foreground">
Ensure prerequisites are met and requirements are satisfied
</p> </div> </div> <div class="flex gap-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12a10 10 0 1 0 20 0 10 10 0 1 0 0-20 10 10 0 1 0 0 20z"></path></svg> <div> <h4 class="font-semibold mb-1">Career-Focused</h4> <p class="text-sm text-muted-foreground">
Align your course selection with your career aspirations
</p> </div> </div> <div class="flex gap-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12a10 10 0 1 0 20 0 10 10 0 1 0 0-20 10 10 0 1 0 0 20z"></path></svg> <div> <h4 class="font-semibold mb-1">Flexible Planning</h4> <p class="text-sm text-muted-foreground">
Easily adjust and recalculate your plan as circumstances change
</p> </div> </div> </div> </div> </section> <!-- CTA Section --> <section class="container mx-auto px-6 py-20 text-center"> <div class="max-w-2xl mx-auto"> <h2 class="text-3xl font-bold mb-4">Ready to plan your academic journey?</h2> <p class="text-lg text-muted-foreground mb-8">
Join students who are taking control of their university experience
</p> <a${addAttribute(`${baseUrl}planner`, "href")} class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-12 text-lg">
Get Started Now
</a> </div> </section> </div> ` })}`;
}, "/app/src/pages/index.astro", void 0);

const $$file = "/app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
