# Rita & Shepherd wedding website

Static website in `dist/`, deployed on Vercel. Local preview: `node preview.cjs`.

Wedding: Awekonimungu Rita and Mukundane Shepherd, 12 December 2026 at 1:00 PM EAT. Venue: Flamingo Hall, Freedom City, Namasuba, Kampala. Chairman Aggrey: +256701539163.

The top RSVP link opens the invitation-card checker. Guests do not register. See `database/README.md` for issuing unique card codes, revoking cards and privacy notes. The site verifies codes via the `verify-wedding-card` Supabase Edge Function; its source is in `database/verify-wedding-card.ts`.

Edit `dist/config.js` to add the WhatsApp group URL, a YouTube broadcast ID, or post-wedding photographs. Livestream production and the wedding album still require actual supplied content.
