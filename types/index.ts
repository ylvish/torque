// User related types
export enum UserRole {
    BUYER = 'BUYER',
    SELLER = 'SELLER',
    EMPLOYEE = 'EMPLOYEE',
    CEO = 'CEO',
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar_url?: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

// Fuel and transmission types
export enum FuelType {
    PETROL = 'PETROL',
    DIESEL = 'DIESEL',
    CNG = 'CNG',
    ELECTRIC = 'ELECTRIC',
    HYBRID = 'HYBRID',
}

export enum TransmissionType {
    MANUAL = 'MANUAL',
    AUTOMATIC = 'AUTOMATIC',
}

// Submission status
export enum SubmissionStatus {
    PENDING_REVIEW = 'PENDING_REVIEW',
    UNDER_EVALUATION = 'UNDER_EVALUATION',
    INFO_REQUESTED = 'INFO_REQUESTED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ON_HOLD = 'ON_HOLD',
}

// Listing status
export enum ListingStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    RESERVED = 'RESERVED',
    SOLD = 'SOLD',
    EXPIRED = 'EXPIRED',
    ARCHIVED = 'ARCHIVED',
}

// Lead status
export enum LeadStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    QUALIFIED = 'QUALIFIED',
    NEGOTIATING = 'NEGOTIATING',
    CONVERTED = 'CONVERTED',
    LOST = 'LOST',
}

export enum LeadInterest {
    TEST_DRIVE = 'TEST_DRIVE',
    PRICE_INFO = 'PRICE_INFO',
    FINANCE_INFO = 'FINANCE_INFO',
    GENERAL = 'GENERAL',
}

// Seller Submission
export interface SellerSubmission {
    id: string;
    reference_id: string;
    user_id?: string;
    status: SubmissionStatus;

    // Seller details
    seller_name: string;
    seller_phone: string;
    seller_email: string;
    seller_city: string;
    preferred_contact_time?: string;
    whatsapp_consent: boolean;

    // Car details
    make: string;
    model: string;
    year: number;
    variant?: string;
    fuel_type: FuelType;
    transmission: TransmissionType;
    mileage: number;
    registration_city: string;

    // Condition
    owners: number;
    accident_history: boolean;
    service_history?: string;
    insurance_status?: string;
    selling_reason?: string;

    // Media
    photos: string[];
    documents: string[];

    // Staff
    assigned_to?: string;
    staff_notes?: StaffNote[];

    created_at: string;
    updated_at: string;
}

export interface StaffNote {
    id: string;
    content: string;
    created_by: string;
    created_at: string;
}

// Listing
export interface Listing {
    id: string;
    submission_id?: string;
    status: ListingStatus;

    // Car details
    make: string;
    model: string;
    year: number;
    variant?: string;
    fuel_type: FuelType;
    transmission: TransmissionType;
    mileage: number;
    registration_city: string;
    owners: number;

    // Pricing
    price: number;

    // Content
    description?: string;
    why_we_like_it?: string;
    inspection_summary?: string;

    // Media
    featured_image_url: string;
    gallery_images: string[];

    // Metrics
    view_count: number;
    lead_count: number;

    // Publishing
    published_at?: string;
    published_by?: string;

    created_at: string;
    updated_at: string;
}

// Lead
export interface Lead {
    id: string;
    listing_id: string;
    status: LeadStatus;
    interest: LeadInterest;

    // Buyer details
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    message?: string;

    // Staff
    assigned_to?: string;

    created_at: string;
    updated_at: string;
}

// Form types for seller submission
export interface SellerFormData {
    seller_name: string;
    seller_phone: string;
    seller_email: string;
    seller_city: string;
    preferred_contact_time?: string;
    whatsapp_consent: boolean;

    make: string;
    model: string;
    year: number;
    variant?: string;
    fuel_type: FuelType;
    transmission: TransmissionType;
    mileage: number;
    registration_city: string;

    owners: number;
    accident_history: boolean;
    service_history?: string;
    insurance_status?: string;
    selling_reason?: string;
}

// Filter types for browse page
export interface ListingFilters {
    make?: string;
    model?: string;
    yearMin?: number;
    yearMax?: number;
    priceMin?: number;
    priceMax?: number;
    fuelType?: FuelType;
    transmission?: TransmissionType;
    mileageMax?: number;
    city?: string;
}

export type SortOption = 'price_low' | 'price_high' | 'year_new' | 'year_old' | 'mileage_low';

// Staff member type for config
export interface StaffMember {
    name: string;
    email: string;
    password: string;
    role: 'CEO' | 'EMPLOYEE';
    phone?: string;
}
