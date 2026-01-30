# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Font catalog (Supabase)

The app reads the full Google Fonts catalog from Supabase. To set it up:

1. **Run the migration**  
   In the [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor, run the SQL in `supabase/migrations/20250130120000_create_fonts_tables.sql` (creates `fonts` and `popular_pairings` tables).

2. **Populate the catalog**  
   Get your project URL and **service role** key from Supabase → Settings → API. Then:

   ```sh
   # In .env (or environment), set:
   # SUPABASE_URL=https://your-project.supabase.co
   # SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   npm run seed:fonts
   ```

   This fetches all fonts from the public Google Fonts metadata API and upserts them into `fonts`, and seeds `popular_pairings` with curated pairs.

3. **Refresh the catalog**  
   Re-run `npm run seed:fonts` whenever you want to pull in new Google Fonts (e.g. after new releases).

The React app uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) for the client; the seed script uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for write access.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
