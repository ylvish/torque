-- Fix Lead Status Enum Values
-- Run this script FIRST to update the enum type.
-- This must be run separately from the data insertion script.

ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'QUALIFIED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'NEGOTIATING';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'CONVERTED';
ALTER TYPE lead_status ADD VALUE IF NOT EXISTS 'LOST';
