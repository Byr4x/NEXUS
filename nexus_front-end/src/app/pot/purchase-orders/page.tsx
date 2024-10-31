'use client';

import React, { useState, useEffect, useMemo, Reference } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LuView, LuClipboardEdit, LuTrash2, LuPenLine } from 'react-icons/lu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { TextInput, TextArea, NumberInput, SelectInput, DateInput } from '@/components/ui/StyledInputs';
import FormModal from '@/components/modals/FormModal';
import ViewModal from '@/components/modals/ViewModal';
import TopTableElements from '@/components/ui/TopTableElements';
import { showAlert, showToast } from '@/components/ui/Alerts';

interface PurchaseOrder {
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

interface Payment {
    id: number;
    purchase_order: number;
    payment_method: number;
    payment_term: number | null;
    advance: number | null;
}

interface PODetail {
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

interface PurchaseOrderForm extends PurchaseOrder {
    ordered_quantity?: number;
}

interface PODetailForm extends PODetail {
    has_print?: boolean;
}

// Choice Objects
const measureUnitChoices = {
    0: 'cm',
    1: 'pulg'
};

const sealingTypeChoices = {
    0: 'Sin sellado',
    1: 'Lateral',
    2: 'Fondo',
    3: 'Manual',
    4: 'Precorte',
    5: 'En "V"'
};

const flapTypeChoices = {
    0: 'Sin solapa',
    1: 'Interna',
    2: 'Interna doble',
    3: 'Externa',
    4: 'Volada'
};

const gussetsTypeChoices = {
    0: 'Sin fuelles',
    1: 'Lateral',
    2: 'Fondo'
};

const tapeChoices = {
    0: 'Sin cinta',
    1: 'Resellable',
    2: 'De seguridad'
};

const dieCutTypeChoices = {
    0: 'Sin troquel',
    1: 'Riñon',
    2: 'Camiseta',
    3: 'Perforaciones',
    4: 'Banderin',
    5: 'Cordon',
    6: 'Cubrevestido',
    7: 'Media luna',
    8: 'Selle de refuerzo'
};

const dynasTreatyFacesChoices = {
    0: 'Ninguna',
    1: '1 cara',
    2: '2 caras'
};

const paymentMethodChoices = {
    0: 'Contado',
    1: 'Crédito'
};

export default function ReferencesPage() {
    const defaultPurchaseOrder: PurchaseOrderForm = {
        id: 0,
        details: [],
        payments: [],
        order_date: new Date(),
        customer: 0,
        employee: 0,
        observations: '',
        delivery_date: new Date(),
        subtotal: 0,
        iva: 0,
        total: 0,
        ordered_quantity: 1,
    };

    const defaultPayment: Payment = {
        id: 0,
        purchase_order: 0,
        payment_method: 0,
        payment_term: null,
        advance: null,
    };

    const defaultPODetail: PODetailForm = {
        id: 0,
        purchase_order: 0,
        reference: 0,
        product_type: 0,
        material: 0,
        reference_internal: '',
        film_color: '',
        measure_unit: 0,
        width: 0,
        length: 0,
        gussets_type: 0,
        first_gusset: null,
        second_gusset: null,
        flap_type: 0,
        flap_size: null,
        tape: 0,
        die_cut_type: 0,
        sealing_type: 0,
        caliber: 0,
        roller_size: 0,
        additive: [],
        has_print: false,
        dynas_treaty_faces: 0,
        is_new_sketch: false,
        sketch_url: '',
        pantones_quantity: 0,
        pantones_codes: [],
        kilograms: 0,
        units: 0,
        kilogram_price: 0,
        unit_price: 0,
        production_observations: '',
        delivery_location: '',
        is_updated: false,
        wo_number: 0,
    };

    const [POs, setPOs] = useState<PurchaseOrder[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [references, setReferences] = useState<any[]>([]);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [currentPO, setCurrentPO] = useState<PurchaseOrder | null>(null);
    const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
    const [currentPOD, setCurrentPOD] = useState<PODetail | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formDataPO, setFormDataPO] = useState<PurchaseOrderForm>(defaultPurchaseOrder);
    const [formDataPayment, setFormDataPayment] = useState<Payment>(defaultPayment);
    const [formDataPOD, setFormDataPOD] = useState<PODetailForm>(defaultPODetail);
    const [isReferenceEditable, setIsReferenceEditable] = useState(false);
    const [additiveCount, setAdditiveCount] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(1);
    console.log(formDataPO);

    useEffect(() => {
        fetchPOs();
        fetchEmployees();
        fetchCustomers();
        fetchProductTypes();
        fetchMaterials();
    }, []);

    useEffect(() => {
        if (materials.find(m => m.id === formDataPOD.material)?.name === 'Maíz') {
            setFormDataPOD(prev => ({
                ...prev,
                film_color: 'SIN COLOR'
            }));
        }
    }, [formDataPOD.material]);

    const fetchPOs = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/business/purchaseOrders/');
            setPOs(response.data);
        } catch (error) {
            console.error('Error fetching POs:', error);
            showToast('Error fetching POs', 'error');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/business/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            showToast('Error fetching employees', 'error');
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/business/customers/');
            setCustomers(response.data);
            setReferences(response.data.references);
        } catch (error) {
            console.error('Error fetching customers:', error);
            showToast('Error fetching customers', 'error');
        }
    };

    const fetchProductTypes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/business/productTypes/');
            setProductTypes(response.data);
        } catch (error) {
            console.error('Error fetching product types:', error);
            showToast('Error fetching product types', 'error');
        }
    };

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/business/materials/');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
            showToast('Error fetching materials', 'error');
        }
    };

    const generateReference = (data: typeof formDataPOD): string => {
        let reference = '';
        const productType = productTypes.find(pt => pt.id === data.product_type);
        const material = materials.find(m => m.id === data.material);

        if (!productType || !material) return reference;

        let afterWidth = '';
        let afterLength = '';

        if (data.gussets_type === 1) {
            if (data.first_gusset) afterWidth += ` + F${data.first_gusset}`;
            if (data.second_gusset) afterWidth += ` + F${data.second_gusset}`;
        } else if (data.gussets_type === 2) {
            if (data.first_gusset) afterLength += ` + FF${data.first_gusset}`;
        }

        if (data.flap_type !== 0 && data.flap_size) {
            afterLength += ` + S${data.flap_size}`;
        }

        afterLength += data.measure_unit === 0 ? ' CM' : ' PULG';

        let afterAll = '';
        if (data.tape === 1) afterAll = 'CINTA RES';
        else if (data.tape === 2) afterAll = 'CINTA SEG';
        else if (data.die_cut_type === 1) afterAll = 'RIÑON';
        else if (data.die_cut_type === 2) afterAll = 'CAMISETA';
        else if (data.die_cut_type === 3) afterAll = 'PERFORACIONES';

        let dataLenght = '';
        if (data.product_type === productTypes.find(pt => pt.name === 'Tubular')?.id || data.product_type === productTypes.find(pt => pt.name === 'Semi-tubular')?.id) {
            dataLenght = '';
        } else {
            dataLenght = ` x ${data.length}`;
        }

        reference = `${productType.name.toUpperCase()} ${material.name.toUpperCase()} ${data.width}${afterWidth}${dataLenght}${afterLength}`;

        if (data.caliber > 0) {
            reference += ` CAL ${data.caliber} ${afterAll}`;
        }

        return reference;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;   
        const underscoreIndex = name.indexOf('_');
        const formType = name.slice(0, underscoreIndex); 
        const fieldName = name.slice(underscoreIndex + 1); 
    
        switch (formType) {
            case 'po':
                setFormDataPO(prev => {
                    const newState = { ...prev, [fieldName]: value };
                    if (fieldName === 'ordered_quantity') {
                        const quantity = parseInt(value) || 0;
                        setTotalSteps(quantity + 2);
                    }
                    return newState;
                });
                break;
            case 'pod':
                setFormDataPOD(prev => {
                    const newState = { ...prev, [fieldName]: value };
                    if (fieldName === 'gussets_type') {
                        newState.die_cut_type = Number(value) === 1 ? 2 : 0;
                    }
                    if (['product_type', 'material', 'width', 'length', 'measure_unit', 'caliber', 'gussets_type', 'first_gusset', 'second_gusset', 'flap_type', 'flap_size', 'tape', 'die_cut_type'].includes(fieldName)) {
                        newState.reference_internal = generateReference(newState);
                    }
                    return newState;
                });
                break;
            case 'payment':
                setFormDataPayment(prev => ({ ...prev, [fieldName]: value }));
                break;
        }
    };
    

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response;
            let message = '';

            if (currentPO) {
                response = await axios.put(`http://127.0.0.1:8000/beiplas/business/purchaseOrders/${currentPO.id}/`, formDataPO);
                const poId = response.data.id;

                const paymentData = { ...formDataPayment, purchase_order: poId };
                response = await axios.put(`http://127.0.0.1:8000/beiplas/business/payments/${currentPayment?.id}/`, paymentData);

                const detailsPromises = Array(formDataPO.ordered_quantity).map((_, index) => {
                    const detailData = { ...formDataPOD, purchase_order: poId };
                    return axios.put(`http://127.0.0.1:8000/beiplas/business/poDetails/${detailData.id}/`, detailData);
                });

                await Promise.all(detailsPromises);
                message = 'Orden de Compra actualizada correctamente';
            } else {
                response = await axios.post('http://127.0.0.1:8000/beiplas/business/purchaseOrders/', formDataPO);
                const poId = response.data.id;

                const paymentData = { ...formDataPayment, purchase_order: poId };
                response = await axios.post('http://127.0.0.1:8000/beiplas/business/payments/', paymentData);

                const detailsPromises = Array(formDataPO.ordered_quantity).map((_, index) => {
                    const detailData = { ...formDataPOD, purchase_order: poId };
                    return axios.post('http://127.0.0.1:8000/beiplas/business/poDetails/', detailData);
                });

                await Promise.all(detailsPromises);
                message = 'Orden de Compra creada correctamente';
            }

            showToast(message, 'success');
            setIsReferenceEditable(false);
            setFormModalOpen(false);
            setCurrentPO(null);
            setCurrentPayment(null);
            setCurrentPOD(null);
            setFormDataPO(defaultPurchaseOrder);
            setFormDataPayment(defaultPayment);
            setFormDataPOD(defaultPODetail);
            setCurrentStep(1);
            setTotalSteps(1);
            fetchPOs();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                showToast(error.response.data.message || 'An error occurred', 'error');
            } else {
                showToast('An unexpected error occurred', 'error');
            }
        }
    };

    const handleView = (PurchaseOrder: PurchaseOrder, payment: Payment, PODetail: PODetail) => {
        setCurrentPO(PurchaseOrder);
        setCurrentPayment(payment);
        setCurrentPOD(PODetail);
        setViewModalOpen(true);
    };


    const handleEdit = (PurchaseOrder: PurchaseOrder, payment: Payment, PODetail: PODetail) => {
        setCurrentPO(PurchaseOrder);
        setCurrentPayment(payment);
        setCurrentPOD(PODetail);
        setAdditiveCount(PODetail.additive.length);
        setFormDataPO(PurchaseOrder);
        setFormDataPayment(payment);
        setFormDataPOD(PODetail);
        setFormModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        showAlert(
            {
                title: '¿Estás seguro de eliminar esta referencia?',
                text: 'No podrás revertir esta acción',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/purchaseOrders/${id}/`);
                    if (response.status === 204) {
                        showToast('Orden de Compra eliminada correctamente', 'success');
                        fetchPOs();
                    } else {
                        showToast('Error al eliminar la Orden de Compra', 'error');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error al eliminar la referencia', 'error');
                    } else {
                        showToast('An unexpected error occurred', 'error');
                    }
                }
            },
            () => {
                showToast('Eliminación cancelada', 'info');
            }
        );
    };

    const handleCancel = () => {
        setIsReferenceEditable(false);
        setCurrentPO(null);
        setCurrentPayment(null);
        setCurrentPOD(null);
        setAdditiveCount(0);
        setFormDataPO(defaultPurchaseOrder);
        setFormDataPayment(defaultPayment);
        setFormDataPOD(defaultPODetail);
        setFormModalOpen(false);
        showToast('Acción cancelada', 'info');
    };

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const inputs = {
        //STEP 1
        employee: (
            <SelectInput
                label="Empleado"
                name="po_employee"
                value={{ value: formDataPO.employee, label: employees.find(e => e.id === formDataPO.employee)?.name }}
                onChange={(option) => handleInputChange({ target: { name: 'po_employee', value: option?.value || 0 } } as any)}
                options={employees.map(employee => ({
                    value: employee.id,
                    label: employee.name
                }))}
                required
            />
        ),
        order_date: (
            <DateInput
                name="po_order_date"
                label="Fecha de Orden"
                selectedDate={new Date()}
                onChange={() => { }}
                required
                disabled={true}
            />
        ),
        customer: (
            <SelectInput
                label="Cliente"
                name="po_customer"
                value={{ value: formDataPO.customer, label: customers.find(c => c.id === formDataPO.customer)?.company_name }}
                onChange={(option) => handleInputChange({ target: { name: 'po_customer', value: option?.value || 0 } } as any)}
                options={customers.map(customer => ({
                    value: customer.id,
                    label: customer.company_name
                }))}
                required
            />
        ),
        ordered_quantity: (
            <NumberInput
                label="Cantidad de productos ordenados"
                name="po_ordered_quantity"
                value={formDataPO.ordered_quantity || 0}
                onChange={handleInputChange}
                required
            />
        ),
        //STEP 2 OF ordered_quantity (THIS SECTION IS REPEATED ordered_quantity times)
        reference: (
            <SelectInput
                label="Referencia"
                name="pod_reference"
                value={formDataPOD.reference}
                onChange={(option) => {
                    const selectedReference = references?.find(reference => reference.id === option?.value);
                    if (selectedReference) {
                        setFormDataPOD(prevState => ({
                            ...prevState,
                            reference: option?.value,
                            product_type: selectedReference.product_type,
                            material: selectedReference.material,
                            film_color: selectedReference.film_color,
                            measure_unit: selectedReference.measure_unit,
                            width: selectedReference.width,
                            length: selectedReference.length,
                            gussets_type: selectedReference.gussets_type,
                            first_gusset: selectedReference.first_gusset,
                            second_gusset: selectedReference.second_gusset,
                            flap_type: selectedReference.flap_type,
                            flap_size: selectedReference.flap_size,
                            tape: selectedReference.tape,
                            die_cut_type: selectedReference.die_cut_type,
                            sealing_type: selectedReference.sealing_type,
                            caliber: selectedReference.caliber,
                            roller_size: selectedReference.roller_size,
                            additive: selectedReference.additive,
                            dynas_treaty_faces: selectedReference.dynas_treaty_faces,
                            pantones_quantity: selectedReference.pantones_quantity,
                            pantones_codes: selectedReference.pantones_codes,
                            sketch_url: selectedReference.sketch_url,
                        }));
                        setAdditiveCount(selectedReference.additive.length)
                    }
                    handleInputChange({ target: { name: 'pod_reference', value: option?.value || 0 } } as any);
                }}
                options={references?.map(reference => ({
                    value: reference.id,
                    label: reference.reference
                })) || []}
            />
        ),
        product_type: (
            <SelectInput
                label="Tipo de Producto"
                name="pod_product_type"
                value={{ value: formDataPOD.product_type, label: productTypes.find(pt => pt.id === formDataPOD.product_type)?.name }}
                onChange={(option) => handleInputChange({ target: { name: 'pod_product_type', value: option?.value || 0 } } as any)}
                options={productTypes.map(type => ({
                    value: type.id,
                    label: type.name
                }))}
                required
            />
        ),
        material: (
            <SelectInput
                label="Material"
                name="pod_material"
                value={{ value: formDataPOD.material, label: materials.find(m => m.id === formDataPOD.material)?.name }}
                onChange={(option) => handleInputChange({ target: { name: 'pod_material', value: option?.value || 0 } } as any)}
                options={materials.map(material => ({
                    value: material.id,
                    label: material.name
                }))}
                required
            />
        ),
        reference_internal: (
            <div className="relative">
                <TextInput
                    label="Referencia de compra"
                    name="pod_reference_internal"
                    value={formDataPOD.reference_internal}
                    onChange={handleInputChange}
                    disabled={!isReferenceEditable}
                    required
                />
                <button
                    type="button"
                    onClick={() => setIsReferenceEditable(!isReferenceEditable)}
                    className="absolute right-2 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <LuPenLine size={18} />
                </button>
            </div>
        ),
        film_color: (
            <TextInput
                label="Color de Película"
                name="pod_film_color"
                value={materials.find(m => m.id === formDataPOD.material)?.name === 'Maíz' ? 'Beige' : formDataPOD.film_color}
                onChange={handleInputChange}
                disabled={materials.find(m => m.id === formDataPOD.material)?.name === 'Maíz'}
                required
            />
        ),
        measure_unit: (
            <SelectInput
                label="Unidad de Medida"
                name="pod_measure_unit"
                value={{ value: formDataPOD.measure_unit, label: measureUnitChoices[formDataPOD.measure_unit as keyof typeof measureUnitChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'pod_measure_unit', value: option?.value || 0 } } as any)}
                options={Object.entries(measureUnitChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
                required
            />
        ),
        width: (
            <NumberInput
                label="Ancho"
                name="pod_width"
                value={formDataPOD.width}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        length: ['Lamina', 'Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) && (
            <NumberInput
                label="Largo"
                name="pod_length"
                value={formDataPOD.length}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        gussets_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) && (
            <SelectInput
                label="Tipo de Fuelle"
                name="pod_gussets_type"
                value={{ value: formDataPOD.gussets_type, label: gussetsTypeChoices[formDataPOD.gussets_type as keyof typeof gussetsTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'pod_gussets_type', value: option?.value || 0 } } as any)}
                options={Object.entries(gussetsTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        first_gusset: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) && formDataPOD.gussets_type !== 0 && (
            <NumberInput
                label="Tamaño de Fuelle"
                name="pod_first_gusset"
                value={formDataPOD.first_gusset || 0}
                onChange={handleInputChange}
                min={0}
                step={0.01}
                required
            />
        ),
        flap_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) && formDataPOD.gussets_type !== 1 && (
            <SelectInput
                label="Tipo de Solapa"
                name="pod_flap_type"
                value={{ value: formDataPOD.flap_type, label: flapTypeChoices[formDataPOD.flap_type as keyof typeof flapTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'pod_flap_type', value: option?.value || 0 } } as any)}
                options={Object.entries(flapTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        flap_size: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) &&
            formDataPOD.gussets_type !== 1 &&
            formDataPOD.flap_type !== 0 && (
                <NumberInput
                    label="Tamaño de Solapa"
                    name="pod_flap_size"
                    value={formDataPOD.flap_size || 0}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    required
                />
            ),
        tape: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) &&
            formDataPOD.flap_type === 4 && (
                <SelectInput
                    label="Tipo de Cinta"
                    name="pod_tape"
                    value={{ value: formDataPOD.tape, label: tapeChoices[formDataPOD.tape as keyof typeof tapeChoices] }}
                    onChange={(option) => handleInputChange({ target: { name: 'pod_tape', value: option?.value || 0 } } as any)}
                    options={Object.entries(tapeChoices).map(([key, value]) => ({
                        value: Number(key),
                        label: value
                    }))}
                />
            ),
        die_cut_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) &&
            formDataPOD.flap_type !== 4 && (
                <div>
                    <SelectInput
                        label="Tipo de Troquel"
                        name="pod_die_cut_type"
                        value={{
                            value: formDataPOD.die_cut_type,
                            label: dieCutTypeChoices[formDataPOD.die_cut_type as keyof typeof dieCutTypeChoices]
                        }}
                        onChange={(option) => handleInputChange({
                            target: { name: 'pod_die_cut_type', value: option?.value || 0 }
                        } as any)}
                        options={Object.entries(dieCutTypeChoices)
                            .filter(([key, _]) => {
                                if (formDataPOD.gussets_type === 1) {
                                    return Number(key) === 2;
                                }
                                return Number(key) !== 2;
                            })
                            .map(([key, value]) => ({
                                value: Number(key),
                                label: value
                            }))}
                        required
                        disabled={formDataPOD.gussets_type === 1}
                    />
                    {formDataPOD.gussets_type === 1 && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                            El troquel se establece automáticamente como camiseta para bolsas con fuelle lateral
                        </p>
                    )}
                </div>
            ),
        sealing_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) && (
            <SelectInput
                label="Tipo de Sellado"
                name="pod_sealing_type"
                value={{ value: formDataPOD.sealing_type, label: sealingTypeChoices[formDataPOD.sealing_type as keyof typeof sealingTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'pod_sealing_type', value: option?.value || 0 } } as any)}
                options={Object.entries(sealingTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        caliber: (
            <NumberInput
                label="Calibre"
                name="pod_caliber"
                value={formDataPOD.caliber}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        roller_size: (
            <NumberInput
                label="Tamaño del Rodillo"
                name="pod_roller_size"
                value={formDataPOD.roller_size}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        additive_count: (
            <SelectInput
                label="Cantidad de Aditivos"
                name="pod_additive_count"
                value={{
                    value: additiveCount,
                    label: additiveCount.toString()
                }}
                onChange={(option) => {
                    const value = option?.value || 0;
                    setAdditiveCount(value);
                    setFormDataPOD(prev => ({
                        ...prev,
                        additive: Array(value).fill('')
                    }));
                }}
                options={[1, 2, 3, 4].map(num => ({
                    value: num,
                    label: num.toString()
                }))}
            />
        ),
        additive: additiveCount > 0 && (
            <div className="space-y-2">
                {Array.from({ length: Math.min(additiveCount, 4) }).map((_, index) => (
                    <TextInput
                        key={index}
                        label={`Aditivo ${index + 1}`}
                        name={`pod_additive_${index}`}
                        value={formDataPOD.additive[index] || ''}
                        onChange={(e) => {
                            const newAdditives = [...formDataPOD.additive];
                            newAdditives[index] = e.target.value;
                            setFormDataPOD(prev => ({
                                ...prev,
                                additive: newAdditives
                            }));
                        }}
                        required
                    />
                ))}
            </div>
        ),
        has_print: (
            <div className="flex items-center space-x-2">
                <label htmlFor="has_print" className="text-sm font-medium">
                    ¿Lleva impresión?
                </label>
                <Switch
                    id="has_print"
                    checked={formDataPOD.has_print || false}
                    onCheckedChange={(checked) => {
                        setFormDataPOD(prev => ({
                            ...prev,
                            has_print: checked,
                            dynas_treaty_faces: checked ? prev.dynas_treaty_faces : 0,
                            pantones_quantity: checked ? prev.pantones_quantity : 0,
                            pantones_codes: checked ? prev.pantones_codes : []
                        }));
                    }}
                />
            </div>
        ),
        dynas_treaty_faces: formDataPOD.has_print && (
            <SelectInput
                label="Caras Tratadas"
                name="pod_dynas_treaty_faces"
                value={{
                    value: formDataPOD.dynas_treaty_faces,
                    label: dynasTreatyFacesChoices[formDataPOD.dynas_treaty_faces as keyof typeof dynasTreatyFacesChoices]
                }}
                onChange={(option) => handleInputChange({
                    target: { name: 'pod_dynas_treaty_faces', value: option?.value || 0 }
                } as any)}
                options={Object.entries(dynasTreatyFacesChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
                required
            />
        ),
        is_new_sketch: (
            <div className="flex items-center space-x-2">
                <label htmlFor="has_print" className="text-sm font-medium">
                    ¿El arte es nuevo?
                </label>
                <Switch
                    id="is_new_sketch"
                    checked={formDataPOD.is_new_sketch || false}
                    onCheckedChange={(checked) => {
                        setFormDataPOD(prev => ({
                            ...prev,
                            is_new_sketch: checked
                        }));
                    }}
                />
            </div>
        ),
        pantones_quantity: formDataPOD.has_print && (
            <SelectInput
                label="Cantidad de Pantones"
                name="pod_pantones_quantity"
                value={{
                    value: formDataPOD.pantones_quantity,
                    label: formDataPOD.pantones_quantity.toString()
                }}
                onChange={(option) => {
                    const value = option?.value || 0;
                    setFormDataPOD(prev => ({
                        ...prev,
                        pantones_quantity: value,
                        pantones_codes: Array(value).fill('').slice(0, 4)
                    }));
                }}
                options={[1, 2, 3, 4].map(num => ({
                    value: num,
                    label: num.toString()
                }))}
                required
            />
        ),
        pantones_codes: formDataPOD.has_print && formDataPOD.pantones_quantity > 0 && (
            <div className="space-y-2">
                {Array.from({ length: Math.min(formDataPOD.pantones_quantity, 4) }).map((_, index) => (
                    <TextInput
                        key={index}
                        label={`Pantone ${index + 1}`}
                        name={`pod_pantone_${index}`}
                        value={formDataPOD.pantones_codes[index] || ''}
                        onChange={(e) => {
                            const newPantoneCodes = [...formDataPOD.pantones_codes];
                            newPantoneCodes[index] = e.target.value;
                            setFormDataPOD(prev => ({
                                ...prev,
                                pantones_codes: newPantoneCodes
                            }));
                        }}
                        required
                    />
                ))}
            </div>
        ),
        kilograms: (
            <NumberInput
                label="Kilogramos"
                name="pod_kilograms"
                value={formDataPOD.kilograms}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        units: (
            <NumberInput
                label="Unidades"
                name="pod_units"
                value={formDataPOD.units}
                onChange={handleInputChange}
                required
                min={0}
                step={1}
            />
        ),
        kilogram_price: (
            <NumberInput
                label="Precio por Kilogramo"
                name="pod_kilogram_price"
                value={formDataPOD.kilogram_price}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        unit_price: (
            <NumberInput
                label="Precio por Unidad"
                name="pod_unit_price"
                value={formDataPOD.unit_price}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        production_observations: (
            <TextArea
                label="Observaciones de Producción"
                name="pod_production_observations"
                value={formDataPOD.production_observations}
                onChange={handleInputChange}
            />
        ),
        delivery_location: (
            <TextInput
                label="Lugar de Entrega"
                name="pod_delivery_location"
                value={formDataPOD.delivery_location}
                onChange={handleInputChange}
            />
        ),
        //STEP 3 AFTER DETAILS
        payment_method: (
            <SelectInput
                label="Método de Pago"
                name="payment_payment_method"
                value={formDataPayment.payment_method}
                onChange={handleInputChange}
                options={Object.entries(paymentMethodChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        payment_term: (
            <NumberInput
                label="Término de pago"
                name="payment_payment_term"
                value={formDataPayment.payment_term || 0}
                onChange={handleInputChange}
            />
        ),
        advance: (
            <NumberInput
                label="Anticipo"
                name="payment_advance"
                value={formDataPayment.advance || 0}
                onChange={handleInputChange}
            />
        ),
        observations: (
            <TextArea
                label="Observaciones"
                name="po_observations"
                value={formDataPO.observations}
                onChange={handleInputChange}
            />
        ),
        line: (
            <div>
                <hr className="my-5 border-small border-gray-500 border-dashed" />
            </div>
        )
    };

    const orderFields = ['order_date', 'customer', 'ordered_quantity'];

    const getDetailsLayout = () => {
        const commonFields = ['customer', 'product_type', 'material'];
        const dimensionFields = ['measure_unit'];
        const printFields = formDataPOD.has_print
            ? ['dynas_treaty_faces', 'pantones_quantity', 'pantones_codes']
            : [];

        const line = ['line'];

        if (['Tubular', 'Semi-tubular'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
            return [
                commonFields,
                ['reference'],
                line,
                ['film_color', ...dimensionFields, 'width'],
                ['caliber', 'roller_size'],
                line,
                ['additive_count', 'additive'],
                line,
                ['has_print'],
                printFields
            ].filter(row => row.length > 0);
        } else if (['Lamina'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
            return [
                commonFields,
                ['reference'],
                line,
                ['film_color', ...dimensionFields, 'width', 'length'],
                ['caliber', 'roller_size'],
                line,
                ['additive_count', 'additive'],
                line,
                ['has_print'],
                printFields
            ].filter(row => row.length > 0);
        } else if (['Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
            const bagFields1 = ['gussets_type'];
            if (formDataPOD.gussets_type !== 0) {
                bagFields1.push('first_gusset');
            }
            if (formDataPOD.gussets_type !== 1) {
                bagFields1.push('flap_type');
                if (formDataPOD.flap_type !== 0) {
                    bagFields1.push('flap_size');
                    if (formDataPOD.flap_type === 4) {
                        bagFields1.push('tape');
                    }
                }
            }

            const bagFields2 = [];
            if (formDataPOD.gussets_type !== 1 && formDataPOD.flap_type !== 4) {
                bagFields2.push('die_cut_type');
            }
            bagFields2.push('sealing_type', 'caliber', 'roller_size');

            return [
                commonFields,
                ['reference'],
                line,
                ['film_color', ...dimensionFields, 'width', 'length'],
                bagFields1,
                bagFields2,
                line,
                ['additive_count', 'additive'],
                line,
                ['has_print'],
                printFields
            ].filter(row => row.length > 0);
        }

        return [orderFields, commonFields];
    };

    /*const viewContent = {
        customer: (
            <div>
                <strong className="block mb-1">Cliente</strong>
                <p className="dark:text-gray-300">
                    {customers.find(c => c.id === currentReference?.customer)?.company_name || 'N/A'}
                </p>
            </div>
        ),
        reference: (
            <div>
                <strong className="block mb-1">Referencia</strong>
                <p className="dark:text-gray-300">{currentReference?.reference}</p>
            </div>
        ),
        product_type: (
            <div>
                <strong className="block mb-1">Tipo de Producto</strong>
                <p className="dark:text-gray-300">
                    {productTypes.find(pt => pt.id === currentReference?.product_type)?.name || 'N/A'}
                </p>
            </div>
        ),
        material: (
            <div>
                <strong className="block mb-1">Material</strong>
                <p className="dark:text-gray-300">
                    {materials.find(m => m.id === currentReference?.material)?.name || 'N/A'}
                </p>
            </div>
        ),
        dimensions: (
            <div>
                <strong className="block mb-1">Dimensiones</strong>
                <p className="dark:text-gray-300">
                    {`${currentReference?.width} x ${currentReference?.length} ${measureUnitChoices[currentReference?.measure_unit as keyof typeof measureUnitChoices
                        ]}`}
                </p>
            </div>
        ),
        caliber: (
            <div>
                <strong className="block mb-1">Calibre</strong>
                <p className="dark:text-gray-300">{currentReference?.caliber}</p>
            </div>
        ),
        film_color: (
            <div>
                <strong className="block mb-1">Color de Película</strong>
                <p className="dark:text-gray-300">{currentReference?.film_color}</p>
            </div>
        ),
        sealing_type: (
            <div>
                <strong className="block mb-1">Tipo de Sellado</strong>
                <p className="dark:text-gray-300">
                    {sealingTypeChoices[currentReference?.sealing_type as keyof typeof sealingTypeChoices]}
                </p>
            </div>
        ),
        flap_details: (
            <div>
                <strong className="block mb-1">Detalles de Solapa</strong>
                <p className="dark:text-gray-300">
                    {`${flapTypeChoices[currentReference?.flap_type as keyof typeof flapTypeChoices]}${currentReference?.flap_size ? ` - ${currentReference.flap_size}` : ''
                        }`}
                </p>
            </div>
        ),
        gussets_details: (
            <div>
                <strong className="block mb-1">Detalles de Fuelles</strong>
                <p className="dark:text-gray-300">
                    {`${gussetsTypeChoices[currentReference?.gussets_type as keyof typeof gussetsTypeChoices]}${currentReference?.first_gusset ? ` - Primero: ${currentReference.first_gusset}` : ''
                        }${currentReference?.second_gusset ? ` - Segundo: ${currentReference.second_gusset}` : ''
                        }`}
                </p>
            </div>
        ),
        tape: (
            <div>
                <strong className="block mb-1">Cinta</strong>
                <p className="dark:text-gray-300">
                    {tapeChoices[currentReference?.tape as keyof typeof tapeChoices]}
                </p>
            </div>
        ),
        die_cut_type: (
            <div>
                <strong className="block mb-1">Tipo de Troquel</strong>
                <p className="dark:text-gray-300">
                    {dieCutTypeChoices[currentReference?.die_cut_type as keyof typeof dieCutTypeChoices]}
                </p>
            </div>
        ),
        roller_size: (
            <div>
                <strong className="block mb-1">Tamaño del Rodillo</strong>
                <p className="dark:text-gray-300">{currentReference?.roller_size}</p>
            </div>
        ),
        pantones_quantity: (
            <div>
                <strong className="block mb-1">Cantidad de Pantones</strong>
                <p className="dark:text-gray-300">{currentReference?.pantones_quantity}</p>
            </div>
        ),
        is_active: (
            <div>
                <strong className="block mb-1">Estado</strong>
                <p className={`inline-block py-1 px-2 rounded-lg font-semibold w-36 text-center ${currentReference?.is_active ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                    }`}>
                    {currentReference?.is_active ? 'Activo' : 'Inactivo'}
                </p>
            </div>
        )
    }; */

    return (
        <div className="container">
            <TopTableElements
                onAdd={() => setFormModalOpen(true)}
                onSearch={(term) => setSearchTerm(term)}
                onFilter={() => { }} // Implementar si es necesario
                filterOptions={[]} // Implementar si es necesario
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {POs.length === 0 ? (
                    <div className="flex justify-center items-center h-full pt-20">
                        <p className="text-gray-600 dark:text-gray-400">No hay referencias disponibles</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Ficha - O.T.</TableHead>
                            <TableHead>Fecha de Solicitud</TableHead>
                            <TableHead>Fecha de Remisión</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableHeader>
                        <TableBody>
                            {POs
                                .filter(po =>
                                    customers.find(c => c.id === po.customer)?.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    po.details.find(detail => detail.reference.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    po.details.find(detail => detail.wo_number.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    po.order_date.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    po.delivery_date.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    po.total.toString().toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((po) => (
                                    <TableRow key={po.id}>
                                        <TableCell>
                                            {customers.find(c => c.id === po.customer)?.company_name}
                                        </TableCell>
                                        <TableCell>
                                            {po.details.map((detail, index) => (
                                                <div key={detail.id}>
                                                    O.T. {detail.wo_number} - Ficha {detail.reference}
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(po.order_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(po.delivery_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {po.total}
                                        </TableCell>
                                        <TableCell>
                                            {/*<button
                                                className="text-sky-500 hover:text-sky-700 mr-3 transition-colors"
                                                onClick={() => handleView(po, po.payments[0], po.details[0])}
                                            >
                                                <LuView size={20} />
                                            </button>
                                            <button
                                                className={`text-orange-500 hover:text-orange-700 mr-3 transition-colors`}
                                                onClick={() => handleEdit(po, po.payments[0], po.details[0])}
                                            >
                                                <LuClipboardEdit size={20} />
                                            </button>*/}    
                                            <button
                                                className="text-red-500 hover:text-red-700 mr-3 transition-colors"
                                                onClick={() => handleDelete(po.id)}
                                            >
                                                <LuTrash2 size={20} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                )}
            </motion.div>

            {isFormModalOpen && (
                <FormModal
                    title={currentPO ? 'Editar Orden de Compra' : 'Agregar Orden de Compra'}
                    layout={currentStep === 1 ? [orderFields] : 
                           currentStep === totalSteps ? [['payment_method', 'payment_term', 'advance'], ['observations']] :
                           getDetailsLayout()}
                    inputs={inputs}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    submitLabel={currentPO ? 'Actualizar' : 'Crear'}
                    width='max-w-[70%]'
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isLastStep={currentStep === totalSteps}
                />
            )}

            {/*{isViewModalOpen && currentPO && (
                <ViewModal
                    title="Detalles de la Orden de Compra"
                    layout={[
                        ['customer', 'reference'],
                        ['product_type', 'material'],
                        ['dimensions', 'caliber'],
                        ['film_color', 'sealing_type'],
                        ['flap_details', 'gussets_details'],
                        ['tape', 'die_cut_type'],
                        ['roller_size', 'pantones_quantity'],
                        ['is_active', 'has_print']
                    ]}
                    content={viewContent}
                    onClose={() => setViewModalOpen(false)}
                />
            )}*/}
        </div>
    );
}