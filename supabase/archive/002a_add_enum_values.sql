-- STEP 1: Add new enum values
-- Run this FIRST, then run 002b_update_roles_part2.sql

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'CEO';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'EMPLOYEE';

-- After running this, click "Run" on the second script
