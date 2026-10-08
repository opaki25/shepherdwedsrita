# RSVP database

Project: `shepherdwedsrita` (`kmmbavbmwpzfkdiwqqzm`).

The remote migration `create_private_wedding_rsvps` creates `public.wedding_rsvps`, enables row-level security, permits validated public inserts, and restricts authenticated reads to the organiser email. Public reads, updates, and deletes are not granted. The frontend uses a public publishable key only.

Review migration history in the Supabase dashboard before applying further schema changes. The dashboard Table Editor provides the private guest list and CSV export for authorized project members. Guest details are never committed to this repository.
