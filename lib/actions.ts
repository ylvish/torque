'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { SellerFormData, SubmissionStatus, LeadInterest, LeadStatus } from '@/types';

// ============================================
// SELLER SUBMISSIONS
// ============================================

export async function createSubmission(formData: Partial<SellerFormData> & { photos: string[], documents: string[] }) {
    const supabase = await createClient();

    // Get current user (optional - sellers can submit without account)
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('seller_submissions')
        .insert({
            user_id: user?.id || null,
            status: SubmissionStatus.PENDING_REVIEW,
            seller_name: formData.seller_name,
            seller_phone: formData.seller_phone,
            seller_email: formData.seller_email,
            seller_city: formData.seller_city,
            preferred_contact_time: formData.preferred_contact_time,
            whatsapp_consent: formData.whatsapp_consent ?? true,
            make: formData.make,
            model: formData.model,
            year: formData.year,
            variant: formData.variant,
            fuel_type: formData.fuel_type,
            transmission: formData.transmission,
            mileage: formData.mileage,
            registration_city: formData.registration_city,
            owners: formData.owners ?? 1,
            accident_history: formData.accident_history ?? false,
            service_history: formData.service_history,
            insurance_status: formData.insurance_status,
            selling_reason: formData.selling_reason,
            photos: formData.photos,
            documents: formData.documents,
        })
        .select('reference_id')
        .single();

    if (error) {
        console.error('Submission error:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/submissions');
    return { success: true, referenceId: data.reference_id };
}

export async function getSubmissions(status?: SubmissionStatus) {
    const supabase = await createClient();

    let query = supabase
        .from('seller_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }

    return data;
}

export async function updateSubmissionStatus(
    submissionId: string,
    status: SubmissionStatus,
    note?: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    // Get current submission to update notes
    const { data: current } = await supabase
        .from('seller_submissions')
        .select('staff_notes')
        .eq('id', submissionId)
        .single();

    const existingNotes = current?.staff_notes || [];
    const newNotes = note
        ? [
            ...existingNotes,
            {
                id: crypto.randomUUID(),
                content: note,
                created_by: user.id,
                created_at: new Date().toISOString(),
            },
        ]
        : existingNotes;

    const { error } = await supabase
        .from('seller_submissions')
        .update({
            status,
            staff_notes: newNotes,
        })
        .eq('id', submissionId);

    if (error) {
        console.error('Error updating submission:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/submissions');
    return { success: true };
}

// ============================================
// LEADS
// ============================================

export async function createLead(
    listingId: string,
    data: {
        buyer_name: string;
        buyer_email: string;
        buyer_phone: string;
        message?: string;
        interest: LeadInterest;
    }
) {
    const supabase = await createClient();

    const { error } = await supabase.from('leads').insert({
        listing_id: listingId,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email,
        buyer_phone: data.buyer_phone,
        message: data.message,
        interest: data.interest,
        status: LeadStatus.NEW,
    });

    if (error) {
        console.error('Error creating lead:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/leads');
    return { success: true };
}

export async function getLeads(status?: LeadStatus) {
    const supabase = await createClient();

    let query = supabase
        .from('leads')
        .select(`
      *,
      listings (
        id,
        make,
        model,
        year,
        price,
        featured_image_url
      ),
      assigned_user:profiles!leads_assigned_to_fkey (
        id,
        name,
        email
      )
    `)
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching leads:', error);
        return [];
    }

    return data;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

    if (error) {
        console.error('Error updating lead:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/leads');
    return { success: true };
}

export async function assignLead(leadId: string, staffId: string | null) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .update({ assigned_to: staffId })
        .eq('id', leadId);

    if (error) {
        console.error('Error assigning lead:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/leads');
    return { success: true };
}

export async function deleteLead(leadId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

    if (error) {
        console.error('Error deleting lead:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/leads');
    return { success: true };
}

// ============================================
// EMPLOYEES
// ============================================

export async function getEmployees() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'EMPLOYEE')
        .order('name');

    if (error) {
        console.error('Error fetching employees:', error);
        return [];
    }

    return data;
}

// ============================================
// LISTINGS
// ============================================

export async function getListings(status?: string, limit?: number) {
    const supabase = await createClient();

    let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching listings:', error);
        return [];
    }

    return data;
}

export async function getListingById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching listing:', error);
        return null;
    }

    // Increment view count
    await supabase.rpc('increment_view_count', { listing_uuid: id });

    return data;
}

export async function createListingFromSubmission(
    submissionId: string,
    additionalData: {
        price: number;
        description: string;
        why_we_like_it?: string;
        inspection_summary?: string;
    }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    // Get submission data
    const { data: submission, error: subError } = await supabase
        .from('seller_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

    if (subError || !submission) {
        return { success: false, error: 'Submission not found' };
    }

    // Create listing
    const { data: listing, error } = await supabase
        .from('listings')
        .insert({
            submission_id: submissionId,
            status: 'DRAFT',
            make: submission.make,
            model: submission.model,
            year: submission.year,
            variant: submission.variant,
            fuel_type: submission.fuel_type,
            transmission: submission.transmission,
            mileage: submission.mileage,
            registration_city: submission.registration_city,
            owners: submission.owners,
            price: additionalData.price,
            description: additionalData.description,
            why_we_like_it: additionalData.why_we_like_it,
            inspection_summary: additionalData.inspection_summary,
            featured_image_url: submission.photos?.[0],
            gallery_images: submission.photos,
            published_by: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating listing:', error);
        return { success: false, error: error.message };
    }

    // Update submission status
    await supabase
        .from('seller_submissions')
        .update({ status: SubmissionStatus.APPROVED })
        .eq('id', submissionId);

    revalidatePath('/dashboard/listings');
    revalidatePath('/dashboard/submissions');
    return { success: true, listingId: listing.id };
}

export async function publishListing(listingId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('listings')
        .update({
            status: 'ACTIVE',
            published_at: new Date().toISOString(),
            published_by: user.id,
        })
        .eq('id', listingId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/listings');
    revalidatePath('/browse');
    return { success: true };
}
