-- Add researcher-specific fields to contacts table for Prisma Negev CRM
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS cris_profile TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS research_focus TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 3;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS academic_title TEXT;
