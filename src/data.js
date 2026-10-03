// All portfolio content lives here. Edit this file and the whole site (and the chat) updates.

export const PROFILE = {
  name: 'Charlie Lahorra',
  title: 'Software Developer',
  location: 'Bulacan, Philippines',
  email: 'clahorrocks@gmail.com',
  resume: 'Charlie-Lahorra-Resume.pdf',
  // Add more links here (GitHub, LinkedIn...) and they show up in the contact card:
  links: [], // e.g. { label: 'GitHub', href: 'https://github.com/your-handle' }
};

export const SKILLS = [
  { id: 'frontend', name: 'Front-end', tags: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'jQuery', 'Bootstrap', 'Electron.js', 'Responsive design'] },
  { id: 'cms', name: 'CMS & e-commerce', tags: ['WordPress', 'Custom themes', 'Elementor', 'ACF', 'WooCommerce', 'Shopify Liquid', 'Metafields'] },
  { id: 'backend', name: 'Back-end', tags: ['PHP', 'Laravel', 'Yii', 'Eloquent ORM', 'MySQL', 'PostgreSQL', 'Auth & roles'] },
  { id: 'api', name: 'APIs', tags: ['REST design', 'API integration', 'JSON / XML', 'OAuth / token auth', 'Postman', 'Webhooks'] },
  { id: 'platform', name: 'ServiceNow', tags: ['Administration', 'Now Assist', 'Incident management', 'Business rules', 'UI policies', 'Access controls'] },
  { id: 'seo', name: 'SEO & design', tags: ['On-page SEO', 'Technical SEO', 'Schema markup', 'Search Console', 'Figma', 'Photoshop', 'Canva'] },
  { id: 'tools', name: 'Team tools', tags: ['Jira', 'Trello', 'ClickUp', 'Airtable', 'Google Workspace'] },
];

export const PROJECTS = [
  { id: 'zenium', name: 'Zenium Lubricants', kind: 'site', img: 'images/zenium.webp', url: 'https://zeniumlubricants.com/', tags: ['WordPress'],
    blurb: 'Built from scratch on WordPress for an independent German lubricant brand.',
    more: ['Built from scratch rather than adapted from an existing site.', 'Lives in the Sites list as one of two builds from scratch.'] },
  { id: 'tsceres', name: 'TSCeres POS landing page', kind: 'site', img: 'images/tsceres.webp', url: 'https://jimac-inc.com/tsceres/', tags: ['WordPress'],
    blurb: 'Product page for a food and beverage point-of-sale system, on jimac-inc.com.',
    more: ['Sits inside jimac-inc.com, which Charlie built from scratch at JIMAC.'] },
  { id: 'hoshitech', name: 'Hoshitech Inc.', kind: 'site', img: 'images/hoshitech.webp', url: 'https://hoshitech-inc.com/', tags: ['WordPress'],
    blurb: 'Company site for a POS printer and IT solutions provider.',
    more: ['A company site covering POS printer products and IT solutions.'] },
  { id: 'platform', name: 'Internal platform at JIMAC', kind: 'app', flow: ['React dashboard', 'REST APIs', 'Laravel ordering'], tags: ['Laravel', 'React', 'REST API', 'MySQL'],
    blurb: 'A React.js back-office dashboard paired with a Laravel mobile web ordering system, connected through custom REST APIs.',
    more: ['Full-stack delivery: the back-office dashboard (React.js) and the mobile web ordering system (Laravel).', 'The two halves talk through custom REST APIs.'] },
  { id: 'rdms', name: 'Client RDMS POS system', kind: 'app', flow: ['PHP (Yii)', 'Backend features', 'Performance tuning'], tags: ['PHP', 'Yii'],
    blurb: 'Maintained and extended a point-of-sale system in PHP: new backend features, performance tuning and ongoing updates.',
    more: ['Built on the Yii framework.', 'Work covered new backend features, performance tuning and continuous system updates.'] },
];

const S = (host, stack, note, scratch) => ({ host, stack, note, scratch: !!scratch, url: `https://${host.startsWith('jimac') ? 'www.' : ''}${host}` });
export const SITES = [
  S('jimac-inc.com', 'WordPress', 'Built from scratch', 1), S('zeniumlubricants.com', 'WordPress', 'Built from scratch', 1),
  S('willsplumbingadelaide.com.au', 'WordPress', 'SEO technical fixes'), S('neontreehouse.com', 'WordPress', 'Pages & fixes'),
  S('humansofpurpose.com', 'WordPress', 'Pages & fixes'), S('waikeriegolf.com.au', 'WordPress', 'Pages & fixes'),
  S('sparkstrategy.com.au', 'WordPress', 'Pages & fixes'), S('rjcevans.com.au', 'WordPress', 'Pages & fixes'),
  S('youngedu.org', 'WordPress', 'Pages & fixes'), S('framedsolutionsllc.com', 'WordPress', 'Pages & fixes'),
  S('prorawgym.com', 'WordPress', 'Pages & fixes'), S('solarbuild.com.au', 'WordPress', 'Pages & fixes'),
  S('kekusdriving.com', 'WordPress', 'Pages & fixes'), S('fitsetters.com', 'WordPress', 'Pages & fixes'),
  S('elliotwise.com', 'WordPress', 'Pages & fixes'), S('aautocare.net', 'WordPress', 'Pages & fixes'),
  S('lohy.com.au', 'Shopify', 'Pages & fixes'), S('jclarkesportsnutrition.com', 'WordPress', 'Pages & fixes'),
];
// the original list used www. for three hosts
['rjcevans.com.au', 'youngedu.org', 'kekusdriving.com'].forEach((h) => { SITES.find((s) => s.host === h).url = `https://www.${h}`; });

export const JOBS = [
  { id: 'accenture', co: 'Accenture', url: 'https://www.accenture.com', logo: 'images/accenture.webp', role: 'Advanced App Engineering Analyst', when: 'Aug 2026 – Present', now: true,
    summary: 'ServiceNow administrator and developer. Configure forms, workflows, business rules, UI policies and access controls. Support incident management and use Now Assist to speed up ticket handling and summarization.',
    points: ['Configure, customize and maintain ServiceNow instances: forms, workflows, business rules, UI policies, access controls.',
      'Support incident management: intake, categorization, prioritization, assignment, escalation and resolution within SLAs.',
      'Work with Now Assist (ServiceNow generative AI) for ticket handling, summarization and agent productivity.',
      'Build applications and automations with cross-functional teams and stakeholders.'] },
  { id: 'jimac', co: 'JIMAC Inc.', url: 'https://www.jimac-inc.com', logo: 'images/jimac.webp', role: 'Developer Lead', when: 'Jan 2024 – Jul 2026',
    summary: 'Built jimac-inc.com from scratch on WordPress, ran the Shopify store, maintained a client POS system, and delivered the React + Laravel internal platform.',
    points: ['Built and launched jimac-inc.com from scratch on WordPress.', 'Managed a Shopify store with custom layouts and product configuration.',
      'Maintained a client RDMS POS system in PHP (Yii): backend features, performance tuning, updates.',
      'Delivered a full-stack internal platform: React.js back-office dashboard plus a Laravel mobile web ordering system with custom REST APIs.'] },
  { id: 'freelance', co: 'Freelance (Remote)', mono: 'FL', role: 'Front-End & CMS Developer', when: 'May 2023 – Dec 2023',
    summary: 'Turned PSD, PDF and mockup designs into responsive pages for international clients on WordPress and Shopify.',
    points: ['Converted PSD, PDF and mockup designs into pixel-perfect responsive pages for international clients.', 'Fixed UI/UX issues and customized banners, CTAs, forms and media from client feedback.',
      'Delivered cross-browser builds with HTML, CSS, JavaScript, jQuery and Bootstrap.'] },
  { id: 'iphitech', co: 'iPhiTech', logo: 'images/iphitech.webp', role: 'Project Lead, previously Web Developer', when: 'Oct 2021 – May 2023',
    summary: 'Led projects from requirements to handoff, introduced Agile workflows and sprint planning, and mentored junior developers. Before that, built responsive WordPress and Shopify sites with WooCommerce and on-page SEO.',
    points: ['Project Lead (Nov 2022 – May 2023): introduced Agile workflows and sprint planning, mentored junior developers, managed the full project lifecycle.',
      'Web Developer (Oct 2021 – Nov 2022): responsive WordPress and Shopify builds, WooCommerce, custom sliders, on-page and technical SEO, mobile-first layouts.'] },
];

export const EDU = { degree: 'BS in Information Technology', school: 'Bulacan State University', when: 'Aug 2018 – Sep 2021' };

// What the chat says when someone asks about a specific technology
export const TECH = {
  laravel: { label: 'Laravel', keys: ['laravel', 'eloquent', 'blade'], projects: ['platform'],
    used: 'Laravel is my back-end framework for full-stack apps: custom admin dashboards, RESTful APIs and database-driven systems on MySQL or PostgreSQL. At JIMAC I built a Laravel mobile web ordering system with custom REST APIs.' },
  react: { label: 'React', keys: ['react', 'reactjs', 'react js', 'hooks', 'frontend framework'], projects: ['platform'],
    used: 'I use React for dynamic, component-based apps: interactive dashboards and custom CMS interfaces with API integration. The JIMAC back-office dashboard is React.js. This portfolio is too.' },
  wordpress: { label: 'WordPress', keys: ['wordpress', 'wp', 'elementor', 'acf', 'woocommerce', 'cms', 'theme', 'themes'], projects: ['zenium', 'tsceres', 'hoshitech'], sites: 'wordpress',
    used: 'WordPress is where most of my client work lives: custom themes, plugin setup, Elementor and ACF, WooCommerce and performance tuning. 17 of my 18 live sites run on it, including two built from scratch.' },
  shopify: { label: 'Shopify', keys: ['shopify', 'liquid', 'ecommerce', 'e commerce', 'store', 'stores'], sites: 'shopify',
    used: 'On Shopify I customize storefronts with Liquid: theme edits, custom sections and blocks, metafields and app integrations. I ran the JIMAC Shopify store and shipped lohy.com.au.' },
  servicenow: { label: 'ServiceNow', keys: ['servicenow', 'service now', 'now assist', 'accenture', 'incident', 'itsm'],
    used: 'At Accenture I work as a ServiceNow administrator and developer: forms, workflows, business rules, UI policies and access controls, plus incident management in line with SLAs. I also work with Now Assist, ServiceNow’s generative AI, for ticket summaries and agent productivity.' },
  php: { label: 'PHP', keys: ['php'], projects: ['rdms'],
    used: 'PHP is my longest-running back-end language: Laravel for new builds and Yii for the client RDMS point-of-sale system I maintained at JIMAC.' },
  api: { label: 'APIs', keys: ['api', 'apis', 'rest', 'webhook', 'webhooks', 'oauth', 'postman', 'integration'], projects: ['platform'],
    used: 'I design and integrate RESTful APIs: authentication flows, token auth, webhooks, third-party services and data exchange between front end and back end. I test them in Postman.' },
  seo: { label: 'SEO', keys: ['seo', 'search engine', 'schema', 'search console', 'performance', 'speed'], sites: 'seo',
    used: 'I handle on-page and technical SEO: meta tags and schema markup, site speed, Search Console and SEO plugin setup. willsplumbingadelaide.com.au is one where I did technical SEO fixes.' },
  design: { label: 'Design tools', keys: ['figma', 'photoshop', 'canva', 'design', 'ui', 'mockup', 'mockups'],
    used: 'I work from Figma, Photoshop and Canva: UI mockups and prototypes, marketing material and basic image or video edits. Most of my client work started from PSD, PDF or mockup files turned into responsive pages.' },
};
