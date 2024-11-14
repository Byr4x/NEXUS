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
    id: number;
    order_number: string;
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
    id: number;
    purchase_order: number;
    payment_method: number;
    payment_term: number;
    advance: number;
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
    order_number?: string;
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

export interface Material {
    id: number;
    name: string;
    description: string;
    weight_constant: number;
    is_active: boolean;
  }

export interface RawMaterial {
    id: number;
    name: string;
    quantity: number;
    raw_material_type: number;
    is_active: boolean;
}

export interface Machine {
    id: number;
    name: string;
    area: number;
    is_active: boolean;
}

export interface WorkOrder {
    id: number;
    production_observations?: string;
    surplus_percentage: number;
    unit_weight: number;
    surplus_weight: number;
    wo_weight: number;
    status: number;
    termination_reason: string;
    extrusion?: Extrusion;
    printing?: Printing;
    sealing?: Sealing;
    handicraft?: Handicraft;
    //touch? Touch;
}

export interface Extrusion {
    id: number;
    work_order: number;
    machine: number;
    roll_type: number;
    rolls_quantity: number;
    caliber: number;
    observations: string;
    next: number;
}

export interface R_RawMaterial_Extrusion {
    id: number;
    raw_material: number;
    extrusion: number;
    quantity: number;
}

export interface Printing {
    id: number;
    work_order: number;
    machine: number;
    is_new: boolean;
    observations: string;
    next: number;
}

export interface Sealing {
    id: number;
    work_order: number;
    machine: number;
    caliber: number;
    hits: number;
    package_units: number,
    bundle_units: number,
    observations: string;
    next: number;
}

export interface Handicraft {
    id: number;
    work_order: number;
    machine: number;
    observations: string;   
    next: number;
}