export interface PurchaseOrder {
    id: number;
    details: PODetail[];
    payments: Payment[];
    employee: number;
    order_date: Date;
    customer: number;
    observations: string;
    delivery_date: Date;
    subtotal: number;
    iva: number;
    total: number;
}

export interface Payment {
    id: number;
    purchase_order: number;
    payment_method: number;
    payment_term: number | null;
    advance: number | null;
}

export interface PODetail {
    id: number;
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
    wo_number: number;
}

export interface PurchaseOrderForm extends PurchaseOrder {
    ordered_quantity?: number;
}

export interface PODetailForm extends PODetail {
    has_print?: boolean;
}

// Interfaces para errores
export interface POErrors {
    employee?: string;
    customer?: string;
    ordered_quantity?: string;
}

export interface PODErrors {
    reference?: string;
    product_type?: string;
    material?: string;
    width?: string;
    length?: string;
    caliber?: string;
    roller_size?: string;
    kilograms?: string;
    units?: string;
    kilogram_price?: string;
    unit_price?: string;
}

export interface PaymentErrors {
    payment_method?: string;
    payment_term?: string;
    advance?: string;
}