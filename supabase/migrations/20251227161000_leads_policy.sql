-- Allow Staff to DELETE leads
-- Run this in Supabase SQL Editor

CREATE POLICY "Staff can delete leads" ON leads
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('EMPLOYEE', 'CEO')
        )
    );
