# Staff Account Management

This folder contains configuration for staff accounts.

## Setup

1. Copy the example file:
   ```bash
   cp staff-accounts.example.json staff-accounts.json
   ```

2. Edit `staff-accounts.json` with your actual staff members:
   ```json
   [
     {
       "name": "Vishal",
       "email": "vishalcollege1829@gmail.com",
       "password": "Vishal@12345",
       "role": "CEO",
       "phone": "+91 9876543210"
     }
   ]
   ```

3. Add the `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file
   - Get it from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

4. Make sure you've run the database migration first!

5. Seed the accounts by calling the API:
   ```bash
   curl -X POST http://localhost:3000/api/seed \
     -H "Authorization: Bearer luxeauto-seed-2024"
   ```

## Roles

| Role | Description |
|------|-------------|
| CEO | Full access to everything - can see all staff info, all data, delete listings |
| EMPLOYEE | Can manage submissions, listings, and leads - cannot see CEO's info |

## Security Notes

- `staff-accounts.json` is gitignored and should NEVER be committed
- Only `staff-accounts.example.json` (the template) is tracked in git
- Change the `SEED_SECRET` in `.env.local` for production!
- The seed API requires the secret key to prevent unauthorized account creation

## Adding New Staff

1. Edit `staff-accounts.json` and add the new staff member
2. Run the seed API again - existing accounts will be skipped
