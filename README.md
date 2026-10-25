# Mitten Meals

Mitten Meals is a community-first food sharing platform that connects surplus food to neighbors, local organizations, and families in need. It is designed to reduce waste, strengthen local support networks, and make food access easier to coordinate.

## About the project

This site was built with Next.js, TypeScript, Tailwind CSS, and modern web design principles for a production-quality, responsive platform.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Foodie nearby place search

To let Foodie return specific food assistance places for a ZIP code, set `GOOGLE_MAPS_API_KEY` in `.env.local` to a server-side Google Maps API key with Places API (New) enabled. Restrict the key to the Places API and keep it server-side; do not prefix it with `NEXT_PUBLIC_`. Restart the dev server after changing `.env.local`. Google Maps Platform may require billing to be enabled.

## Foodie AI responses

Foodie uses Gemini 2.5 Flash to answer questions conversationally and personalize help using the seeker profile (household size, dietary needs, accessibility needs, and notes) plus recent chat context. Create a key in [Google AI Studio](https://aistudio.google.com/apikey), then set `GEMINI_API_KEY` in `harvestlink-app/.env.local`. Keep it private and do not prefix it with `NEXT_PUBLIC_`. Google offers a free tier for eligible models with usage limits; availability, limits, and data-use terms can change, so review the [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) and [terms](https://ai.google.dev/gemini-api/terms). On the free tier, submitted content may be used to improve Google products, so Foodie warns users not to share sensitive information. Restart the dev server after changing `.env.local`. Live place lookup still separately requires `GOOGLE_MAPS_API_KEY`.

## Build

```bash
npm run build
```

## Features

- Responsive homepage with mission-driven hero section
- Role-based onboarding for businesses, organizations, volunteers, and families
- AI matching overview and impact dashboard UI
- Interactive map visualization and resource highlights
- Accessible and modern brand styling

## Deployment

This project can be deployed to Vercel or any Node.js hosting provider that supports Next.js.
