-- Create contact messages table

CREATE TYPE message_status AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    interest TEXT NOT NULL,
    message TEXT,
    status message_status NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Everyone can insert messages
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Only employees/CEO can view and update
CREATE POLICY "Staff can view messages" ON public.contact_messages
    FOR SELECT TO authenticated
    USING ((EXISTS ( SELECT 1 FROM employee_roles WHERE ((employee_roles.user_id = auth.uid()) AND (employee_roles.role = ANY (ARRAY['EMPLOYEE'::text, 'CEO'::text]))))));

CREATE POLICY "Staff can update messages" ON public.contact_messages
    FOR UPDATE TO authenticated
    USING ((EXISTS ( SELECT 1 FROM employee_roles WHERE ((employee_roles.user_id = auth.uid()) AND (employee_roles.role = ANY (ARRAY['EMPLOYEE'::text, 'CEO'::text]))))));

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
