-- Migration: Advanced Security Policies & Super Admin
-- Description: Adds policies for super admins and organization creation.

-- 1. Organizations: Allow anyone to insert a pending organization (Request Account flow)
-- Note: In a real app, you might want to rate limit this or use an edge function.
CREATE POLICY "Anyone can request an organization"
ON public.organizations FOR INSERT
WITH CHECK (status = 'pending');

-- 2. Organizations: Super Admins can manage all organizations
CREATE POLICY "Super admins can manage all organizations"
ON public.organizations FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- 3. Profiles: Super Admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- 4. Profiles: Super Admins can update all profiles
CREATE POLICY "Super admins can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- 5. Products: Super Admins can manage all products
CREATE POLICY "Super admins can manage all products"
ON public.products FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);
