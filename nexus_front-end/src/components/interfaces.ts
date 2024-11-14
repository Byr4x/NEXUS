export interface Customer {
    id: number;
    nit: number;
    company_name: string;
    contact: string;
    contact_email: string;
    contact_phone_number: string;
    location: string;
    is_active: boolean;
    purchase_orders?: PurchaseOrder[];
}

export interface PurchaseOrder {
    id?: number;
    details?: PODetail[];
    payment?: Payment;
    employee: number;
    order_date: Date;
    customer: number;
    observations: string;
    delivery_date: Date;
    subtotal: number;
    has_iva: boolean;
    iva?: number;
    total?: number;
    was_annulled?: boolean;
}

export interface Payment {
    id?: number;
    purchase_order: number;
    payment_method: number;
    payment_term: number;
    advance: number;
}

export interface PODetail {
    id?: number;
    purchase_order: number;
    reference: number;
    product_type: number;
    material: number;
    reference_internal: string;
    film_color: string;
    measure_unit: number;
    width: number;
    length: number;
    gussets_type: number;
    first_gusset: number | null;
    second_gusset: number | null;
    flap_type: number;
    flap_size: number | null;
    tape: number;
    die_cut_type: number;
    sealing_type: number;
    caliber: number;
    roller_size: number;
    additive: string[];
    dynas_treaty_faces: number;
    is_new_sketch: boolean;
    sketch_url: string;
    pantones_quantity: number;
    pantones_codes: string[];
    kilograms: number;
    units: number;
    kilogram_price: number;
    unit_price: number;
    production_observations: string;
    delivery_location: string;
    is_updated: boolean;
    wo_number?: number;
    was_annulled?: boolean;
}

export interface PurchaseOrderForm extends PurchaseOrder {
    ordered_quantity?: number;
}

export interface PODetailForm extends PODetail {
    has_print: boolean;
}

// Interfaces para errores
export interface POErrors {
    employee?: string;
    customer?: string;
    ordered_quantity?: string;
    delivery_date?: string;
}

export interface PODErrors {
    reference?: string;
    reference_internal?: string;
    width?: string;
    length?: string;
    first_gusset?: string;
    flap_size?: string;
    caliber?: string;
    roller_size?: string;
    pantones_quantity?: string;
    pantones_codes?: string;
    kilograms?: string;
    units?: string;
    kilogram_price?: string;
    unit_price?: string;
    delivery_location?: string;
}

export interface PaymentErrors {
    payment_method?: string;
    payment_term?: string;
    advance?: string;
}

export interface WorkOrder {
    id: number;
    wo_number: string;
    status: string;
}