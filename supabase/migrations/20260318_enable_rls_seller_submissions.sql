-- Enable Row Level Security on seller_submissions
-- The policies already exist. This statement activates them.
--
-- Run this in: Supabase Dashboard → SQL Editor
--
ALTER TABLE public.seller_submissions ENABLE ROW LEVEL SECURITY;
