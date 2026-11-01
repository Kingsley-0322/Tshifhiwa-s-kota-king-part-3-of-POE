# Tshifhiwa's Kota King

A multi-page website for a local kota (South African street-food sandwich) takeaway with two outlets: Madabani Village (Limpopo) and Erica Flat, Sunnyside (Pretoria). Student project built in three parts: HTML structure (Part 1), CSS and responsive design (Part 2), and JavaScript, SEO and deployment (Part 3).


## Pages
| Page | Purpose |
|---|---|
| `index.html` | Home: hero, why choose us, image gallery with lightbox |
| `about.html` | Story, mission and vision, FAQ accordion |
| `products.html` | Menu loaded by JavaScript, with search, filter and sort |
| `enquiries.html` | Quote and availability form for bulk and catering orders |
| `contact.html` | Locations, interactive map, message form that compiles an email |

## Project structure
```
/
├── index.html, about.html, products.html, enquiries.html, contact.html
├── css_assets/style.css
├── js_assets/
│   ├── main.js     nav toggle, accordion, lightbox
│   ├── menu.js     menu data, dynamic rendering, search/filter/sort
│   ├── forms.js    validation, email compile, quote, AJAX submit
│   └── map.js      Leaflet map
├── _images/        kota photos
├── robots.txt, sitemap.xml, _headers
└── README.md
```

## Part 3 features
**Interactive elements.** FAQ accordion on the About page (one panel open at a time, keyboard accessible, `aria-expanded` state). Gallery lightbox on the Home page using the native `<dialog>` element (arrow keys, Esc, focus returns to the clicked image). Interactive Leaflet map with OpenStreetMap tiles, a marker and popup per outlet, and buttons that fly to each outlet.

**Animation.** Hero text rises in once on page load; accordion panels expand with a CSS grid-row transition; the lightbox fades in. All motion is switched off for visitors who prefer reduced motion.

**Dynamic content and DOM manipulation.** The menu is stored as a JavaScript array in `menu.js` and rendered with `createElement`/`textContent`. Visitors can search by name or ingredient, filter by category and sort by price or name. The count updates live, and an empty state offers a reset.

**Forms.**
- *Enquiries*: HTML5 attributes plus JavaScript validation (South African phone format, whole-number quantity 1–200, date not in the past, message length). On success it shows an estimated cost and an availability response, then submits the enquiry in the background with `fetch` (AJAX) to Netlify Forms. A honeypot field filters spam bots. Business rules used for the response: 10% off orders of 20 or more; closed Sundays; orders of 20 or more need 24 hours’ notice.
- *Contact*: validates name, phone, email, message type and message, then compiles everything into an email addressed to the recipient set in `forms.js` (`RECIPIENT`) and opens the visitor’s email app. The `action="mailto:..."` attribute is the fallback when JavaScript is off.
- Errors appear beside the field, are linked with `aria-describedby`, and clear as the visitor fixes them.

## SEO
**On-page:** unique `<title>` and meta description per page, a single `<h1>` with `<h2>`/`<h3>` below it, keyword-focused copy (kota, Madabani Village, Limpopo, Sunnyside, Pretoria, bulk orders, catering), descriptive image file names and alt text, clean flat URLs, internal links in the nav, footer and calls to action, a mobile-first responsive layout, canonical links, Open Graph tags, and LocalBusiness JSON-LD (structured data) for both outlets on the home page.
**Technical:** `robots.txt`, `sitemap.xml`, `lang="en"`, skip link and `<main>` landmark.
**Page speed:** fonts loaded with `<link rel="preconnect">` and `display=swap` instead of CSS `@import`, scripts use `defer`, images use `loading="lazy"`.
**Security:** `_headers` sets a Content Security Policy, anti-clickjacking, no-sniff, referrer and HTTPS headers. Menu text is inserted with `textContent` (never `innerHTML`) so it cannot inject markup. External links use `rel="noopener noreferrer"`.
**Off-page plan (not code):** list both outlets on Google Business Profile, with the same name, address and phone as the site (local SEO); share the menu and photos on Facebook, Instagram and WhatsApp Business, linking back to the site; ask local community pages, schools and event organisers to link to the catering enquiry page (backlinks).

## Deployment
1. Push the project to a GitHub repository (see Git workflow).
2. On Netlify choose *Add new site → Import an existing project*, pick the repository, leave the build command empty and set the publish directory to `/`.
3. In Netlify, open *Forms* to confirm the `enquiry` form was detected, and add an email notification.
4. Replace every `YOUR-SITE.netlify.app` in the HTML files, `robots.txt` and `sitemap.xml` with the real address, then push again.

## Git workflow
Commit regularly with descriptive messages, for example: `Add menu search, filter and sort`, `Add FAQ accordion to About page`, `Add Leaflet map to Contact page`, `Add form validation and quote calculator`, `Add robots.txt, sitemap and security headers`, `Update README for Part 3`.

## Changelog

### Part 3: Functionality and SEO (1 November 2026)
**Feedback from Part 2 (92/100)**
- **Typography (4/5, "could be improved"):** replaced the fixed heading sizes with a fluid type scale (`--step--1` to `--step-4`) so text resizes smoothly between mobile and desktop. Set heading line heights and letter spacing, balanced heading wrapping, limited paragraph line length to about 68 characters, and added a `.lead` style for introductions. Prices use tabular numbers so they align.
- **README (3/5, "could be improved"):** rewrote this document with the page list, structure, feature descriptions, SEO, deployment steps, Git workflow, full changelog and references.
- **References (0/5, none provided):** added the References section below and in-text citations in the JavaScript file headers.

**New**
- Added `menu.js`: menu rendered dynamically, with search, category filter and sort. Replaced the hand-written menu cards in `products.html`.
- Added the FAQ accordion (`about.html`) and gallery lightbox (`index.html`) in `main.js`.
- Added `map.js`: Leaflet interactive map replacing the Google Maps iframe on `contact.html`.
- Added `forms.js`: JavaScript validation for both forms; contact form compiles an email; enquiry form calculates a quote, checks availability and submits by AJAX.
- Rebuilt the enquiry form with kota, quantity and date fields; rebuilt the contact form with email and message-type fields. Both now use `novalidate` so JavaScript shows consistent error messages.
- Added SEO: new titles and descriptions, canonical and Open Graph tags, JSON-LD, `robots.txt`, `sitemap.xml`.
- Added `_headers` security headers and a honeypot field on the enquiry form.
- Added a skip link, `<main>` landmark, favicon and a WhatsApp link in the footer.

**Fixed**
- Home page footer showed a placeholder number (082 000 0000) and email; it now matches the other pages.
- Moved Google Fonts from CSS `@import` to `<link>` tags to avoid render blocking.
- Reduced-motion rule now also disables animations, not only transitions.

### Part 2: CSS Styling and Responsive Design
- Created the external stylesheet and linked it from every page; moved inline layout styles into classes (`.split-12`, `.split-11`, `.split-21`, `.grid-auto`, `.row-between`, `.stack`, `.flex-row`) so media queries can override them.
- Added tablet (900px) and mobile (600px) breakpoints, `box-shadow`, and `:hover`/`:focus-visible`/`:active` states.
- Added `main.js` for the mobile nav toggle. Fixed a stray `</html>` at the top of `contact.html`.
- Tried `srcset`/`sizes` images, then removed them because the resized files did not exist and the images broke. Plain `src` is used.

### Part 1
- Semantic HTML structure for all five pages, with header, nav, hero, cards, forms and footer.
- Colour palette and typography set up as CSS custom properties.

## Known limitations
- Responsive images (`srcset`) are not in use; smaller image versions still need to be created.
- The menu needs JavaScript. A `<noscript>` message gives the phone numbers instead.
- Map coordinates are approximate and should be checked against Google Maps.
- The contact form opens the visitor’s own email app; it does not send mail from the server.

## References
Add the date you viewed each source in the *Accessed* field.

Google (2026) *SEO starter guide*. Google Search Central. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: [date]).

Leaflet Contributors (2026) *Leaflet: an open-source JavaScript library for mobile-friendly interactive maps*. Available at: https://leafletjs.com (Accessed: [date]).

MDN Web Docs (2026a) *Document Object Model (DOM)*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model (Accessed: [date]).

MDN Web Docs (2026b) *Client-side form validation*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: [date]).

MDN Web Docs (2026c) *The dialog element*. Mozilla. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog (Accessed: [date]).

Netlify (2026) *Netlify Forms setup*. Available at: https://docs.netlify.com/forms/setup/ (Accessed: [date]).

OpenStreetMap contributors (2026) *OpenStreetMap*. Available at: https://www.openstreetmap.org (Accessed: [date]).

Sitemaps.org (2026) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html (Accessed: [date]).

W3C (2026) *Accordion pattern. WAI-ARIA Authoring Practices Guide*. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ (Accessed: [date]).