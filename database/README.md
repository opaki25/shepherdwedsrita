# Invitation card verification

Guest registration has been replaced by a code checker. Existing RSVP records are retained privately; public RSVP inserts are disabled.

## Issue a card

Open the private Supabase Table Editor for project `kmmbavbmwpzfkdiwqqzm`, select `wedding_cards`, and insert a row with `guest_name`, optional `title`, and optional `admitted_guests`. Leave `id`, `code`, and `created_at` at their defaults. Keep `active` checked. Supabase generates a random code automatically.

Copy that exact code onto the matching invitation card. For readability, the 20 characters after RS- may be separated into five groups of four. Spaces and hyphens are ignored by the checker. Never reuse another guest's code. Set `active` to false to revoke a card.

The code is a bearer credential: anyone holding it can see its associated name. The checker validates an issued code; it cannot distinguish a photocopy carrying the same code and is not a one-time admission/check-in system. No guest-list, partial-code, or name-search endpoint is exposed.

The `wedding_cards` table has RLS and no anon/authenticated table privileges. Only the verification Edge Function uses the server-side service credential to return the matching active card's display fields. No private keys are shipped to the website. Organisers use their existing Supabase dashboard accounts to issue cards.
