# Rita & Shepherd wedding website

Static website in `dist/`. Serve that directory with any static host.

Confirmed names: Awekonimungu Rita and Mukundane Shepherd. Chairman: Aggrey, +256701539163. Wedding date: 12 December 2026 at 10:00 AM EAT. Venue: Flamingo Hall at Freedom City. Address: Namasuba, Kampala–Entebbe Road.

The detailed ceremony programme awaits confirmation; the earlier reference invitation has a different date and venue, so its programme has not been reused.

## Updating the celebration

- Add the WhatsApp group URL to `dist/config.js`.
- Add the YouTube broadcast's 11-character video ID to `youtubeVideoId` in that file. The broadcast must allow embedding. A camera/operator and actual broadcast are still needed on the day. The site does not originate a livestream.
- Add post-wedding images under `dist/assets/wedding/` and list each `src` and `caption` in `photos` in `dist/config.js`. Republish to make them available. Same-origin downloads are supported. There is no public upload or admin system in this preview.
- RSVP opens a prepared WhatsApp message to Aggrey. A guest must send it in WhatsApp; no response is stored by the website.
- Music starts from the invitation's open gesture and can be paused at any time.

## Preview

Run `node preview.cjs` and visit http://localhost:4173.
