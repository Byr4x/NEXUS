'use client';

import React, { useState, useEffect, useMemo, Reference, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LuView, LuClipboardEdit, LuTrash2, LuPenLine, LuBan } from 'react-icons/lu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { TextInput, TextArea, NumberInput, SelectInput, DateInput } from '@/components/ui/StyledInputs';
import FormModal from '@/components/modals/FormModal';
import ViewModal from '@/components/modals/ViewModal';
import TopTableElements from '@/components/ui/TopTableElements';
import { showAlert, showToast } from '@/components/ui/Alerts';
import { PurchaseOrder, PurchaseOrderForm, Payment, PODetail, PODetailForm, POErrors, PODErrors, PaymentErrors } from './interfaces';

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

// Añade estas funciones de utilidad al inicio del componente ReferencesPage
const getColombiaDate = (date?: Date): Date => {
    const colombiaOffset = -5; // UTC-5
    const now = date || new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * colombiaOffset));
};

const getMinDeliveryDate = (): Date => {
    const minDate = getColombiaDate();
    minDate.setDate(minDate.getDate() + 15);
    // Establecer la hora a medianoche
    minDate.setHours(0, 0, 0, 0);
    return minDate;
};

// Añade estas funciones de utilidad cerca del inicio del componente
const calculateTotals = (allPODetails: PODetailForm[], hasIva: boolean, advance: number = 0) => {
    const subtotal = allPODetails.reduce((acc, detail) =>
        acc + (detail.kilograms * detail.kilogram_price + detail.units * detail.unit_price), 0);
    const iva = hasIva ? subtotal * 0.19 : 0;
    const total = subtotal + iva;
    const debtTotal = total - (advance || 0);

    return {
        subtotal,
        iva,
        total,
        debtTotal
    };
};

export default function ReferencesPage() {
    const defaultPurchaseOrder: PurchaseOrderForm = {
        id: 0,
        details: [],
        payment: undefined,
        order_date: getColombiaDate(),
        customer: 0,
        employee: 0,
        observations: '',
        delivery_date: getMinDeliveryDate(),
        subtotal: 0,
        has_iva: true,
        iva: 0,
        total: 0,
        ordered_quantity: 1,
        was_annulled: false,
    };

    const defaultPayment: Payment = {
        id: 0,
        purchase_order: 0,
        payment_method: 0,
        payment_term: 0,
        advance: 0,
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
    const [totalSteps, setTotalSteps] = useState(3);
    const [allPODetails, setAllPODetails] = useState<PODetailForm[]>([]);
    const [poErrors, setPOErrors] = useState<POErrors>({});
    const [podErrors, setPODErrors] = useState<PODErrors>({});
    const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({});
    const [stepChanged, setStepChanged] = useState(false);
    const [showAnnulled, setShowAnnulled] = useState(false);

    useEffect(() => {
        fetchPOs();
        fetchEmployees();
        fetchCustomers();
        fetchProductTypes();
        fetchMaterials();
    }, []);

    useEffect(() => {
        if (materials.find(m => m.id === formDataPOD.material)?.name.toUpperCase() === ('MAÍZ' || 'MAIZ')) {
            setFormDataPOD(prev => ({
                ...prev,
                film_color: 'SIN COLOR'
            }));
        }

        if (materials.find(m => m.id === formDataPOD.material)?.name.toUpperCase() !== ('MAÍZ' || 'MAIZ')) {
            setFormDataPOD(prev => ({
                ...prev,
                film_color: formDataPOD.film_color === 'SIN COLOR' ? 'TRANSPARENTE' : formDataPOD.film_color
            }));
        }
    }, [formDataPOD.material]);

    useEffect(() => {
        if (stepChanged) {
            if (currentStep > 1 && currentStep < totalSteps) {
                // Validar el detalle actual
                if (formDataPOD.reference) {
                    const fieldsToValidate = [
                        'pod_reference',
                        'pod_width',
                        'pod_length',
                        'pod_first_gusset',
                        'pod_flap_size',
                        'pod_caliber',
                        'pod_roller_size',
                        'pod_pantones_quantity',
                        'pod_pantones_codes',
                        'pod_kilograms',
                        'pod_units',
                        'pod_kilogram_price',
                        'pod_unit_price',
                        'pod_delivery_location',
                    ];

                    const errors: PODErrors = {};
                    fieldsToValidate.forEach(field => {
                        const fieldName = field.replace('pod_', '');
                        const error = validateField(field, formDataPOD[fieldName as keyof PODetailForm]);
                        if (error) {
                            errors[fieldName as keyof PODErrors] = error;
                        }
                    });
                    setPODErrors(errors);
                }
            } else if (currentStep === totalSteps) {
                // Validar los campos del pago
                const paymentFieldsToValidate = [
                    'payment_payment_method',
                    'payment_payment_term',
                    'payment_advance',
                ];

                const errors: PaymentErrors = {};
                paymentFieldsToValidate.forEach(field => {
                    const fieldName = field.replace('payment_', '');
                    const error = validateField(field, formDataPayment[fieldName as keyof Payment]);
                    if (error) {
                        errors[fieldName as keyof PaymentErrors] = error;
                    }
                });
                setPaymentErrors(errors);

                const poFieldsToValidate = [
                    'po_delivery_date'
                ];

                const poErrors: POErrors = {};
                poFieldsToValidate.forEach(field => {
                    const fieldName = field.replace('po_', '');
                    const error = validateField(field, formDataPO[fieldName as keyof PurchaseOrderForm]);
                    if (error) {
                        poErrors[fieldName as keyof POErrors] = error;
                    }
                });
                setPOErrors(poErrors);
            }
            setStepChanged(false);
        }
    }, [currentStep, formDataPOD, formDataPayment, formDataPO, stepChanged]);

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

    // Función de validacin
    const validateField = (name: string, value: any): string => {
        const validations: { [key: string]: () => string } = {
            // Validaciones para PO
            'po_employee': () => {
                if (!value) return 'El empleado es requerido';
                return '';
            },
            'po_customer': () => {
                if (!value) return 'El cliente es requerido';
                return '';
            },
            'po_ordered_quantity': () => {
                if (!value) return 'La cantidad es requerida';
                if (value < 1) return 'La cantidad debe ser mayor a 0';
                return '';
            },

            // Validaciones para POD
            'pod_reference': () => {
                if (!value) return 'La referencia es requerida';
                return '';
            },
            'pod_reference_internal': () => {
                if (!value) return 'La referencia interna es requerida';
                return '';
            },
            'pod_width': () => {
                if (!value) return 'El ancho es requerido';
                if (value <= 0) return 'El ancho debe ser mayor a 0';
                return '';
            },
            'pod_length': () => {
                if (['Lamina', 'Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
                    if (!value) return 'El largo es requerido';
                    if (value <= 0) return 'El largo debe ser mayor a 0';
                }
                return '';
            },
            'pod_first_gusset': () => {
                if (formDataPOD.gussets_type !== 0) {
                    if (!value) return 'El fuelle es requerido';
                    if (value <= 0) return 'El fuelle debe ser mayor a 0';
                }
                return '';
            },
            'pod_flap_size': () => {
                if (formDataPOD.flap_type !== 0 && formDataPOD.gussets_type !== 1) {
                    if (!value) return 'El tamaño de la solapa es requerido';
                    if (value <= 0) return 'El tamaño de la solapa debe ser mayor a 0';
                }
                return '';
            },
            'pod_caliber': () => {
                if (!value) return 'El calibre es requerido';
                if (value <= 0) return 'El calibre debe ser mayor a 0';
                return '';
            },
            'pod_roller_size': () => {
                if (!value) return 'El tamaño del rodillo es requerido';
                if (value <= 0) return 'El tamaño del rodillo debe ser mayor a 0';
                return '';
            },
            'pod_pantones_quantity': () => {
                if (formDataPOD.has_print && !value) return 'La cantidad de Pantones es requerida';
                if (formDataPOD.has_print && value <= 0) return 'La cantidad de Pantones debe ser mayor a 0';
                return '';
            },
            'pod_pantones_codes': () => {
                if (formDataPOD.has_print && formDataPOD.pantones_quantity > 0) {
                    let codes = 0;
                    formDataPOD.pantones_codes.map(code => code.length > 0 && codes++);
                    if (codes === 0) {
                        return 'Los códigos Pantone no pueden estar vacíos';
                    }

                    if (formDataPOD.pantones_codes.some(code => !code)) {
                        return 'Debe ingresar todos los códigos Pantone requeridos';
                    }
                }
                return '';
            },
            'pod_kilograms': () => {
                if (['Tubular', 'Semi-tubular'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
                    if (!value) return 'Los kilogramos son requeridos';
                    if (value <= 0) return 'Los kilogramos deben ser mayor a 0';
                }
                return '';
            },
            'pod_units': () => {
                if (['Lamina', 'Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
                    if (!value) return 'Las unidades son requeridas';
                    if (value <= 0) return 'Las unidades deben ser mayor a 0';
                }
                return '';
            },
            'pod_kilogram_price': () => {
                if (['Tubular', 'Semi-tubular'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
                    if (!value) return 'El precio por kilogramo es requerido';
                    if (value <= 0) return 'El precio por kilogramo debe ser mayor a 0';
                }
                return '';
            },
            'pod_unit_price': () => {
                if (['Lamina', 'Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {
                    if (!value) return 'El precio por unidad es requerido';
                    if (value <= 0) return 'El precio por unidad debe ser mayor a 0';
                }
                return '';
            },
            'pod_delivery_location': () => {
                if (!value) return 'La ubicación de entrega es requerida';
                return '';
            },

            // Validaciones para Payment
            'payment_payment_method': () => {
                if (value === undefined) return 'El método de pago es requerido';
                return '';
            },
            'payment_payment_term': () => {
                if (formDataPayment.payment_method === 1) {
                    if (!value) return 'El término de pago es requerido para crdito';
                    if (value < 0) return 'El término debe ser mayor o igual a 0';
                }
                return '';
            },
            'payment_advance': () => {
                if (value && value < 0) return 'El anticipo debe ser mayor o igual a 0';
                return '';
            },
            'po_delivery_date': () => {
                const minDate = getMinDeliveryDate();
                if (new Date(value) < minDate) {
                    return `La fecha de entrega debe ser posterior al ${minDate.toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}`;
                }
                return '';
            },
        };

        return validations[name] ? validations[name]() : '';
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
        e: { target: { name: string; value: string | Date | null } }
    ) => {
        const { name, value } = e.target;
        const underscoreIndex = name.indexOf('_');
        const formType = name.slice(0, underscoreIndex);
        const fieldName = name.slice(underscoreIndex + 1);

        // Validar el campo
        const error = validateField(name, value);

        switch (formType) {
            case 'po':
                setFormDataPO(prev => {
                    const newState = { ...prev, [fieldName]: value };
                    if (fieldName === 'ordered_quantity') {
                        const quantity = parseInt(value as string) || 0;
                        setTotalSteps(quantity + 2);
                    }

                    if (fieldName === 'customer') {
                        const customer = customers.find(c => c.id === value);
                        setReferences(customer?.references);
                        setAllPODetails([]);
                    }
                    console.log(poErrors);
                    return newState;
                });
                setPOErrors(prev => ({ ...prev, [fieldName]: error }));
                break;

            case 'pod':
                setFormDataPOD(prev => {
                    const newState = { ...prev, [fieldName]: value };
                    if (fieldName === 'reference') {
                        if (value === '' || value === null || value === undefined) {
                            setPODErrors({
                                reference: 'La referencia es requerida'
                            });
                        } else {
                            setPODErrors({});
                        }
                    }
                    if (fieldName === 'film_color') {
                        if (materials.find(m => m.id === formDataPOD.material)?.name.toUpperCase() !== ('MAÍZ' || 'MAIZ')) {
                            if (value === '' || value === null || value === undefined) {
                                newState.film_color = 'TRANSPARENTE';
                            }
                        }
                    }

                    if (fieldName === 'gussets_type') {
                        newState.die_cut_type = Number(value) === 1 ? 2 : 0;
                        if (Number(value) === 0) {
                            setPODErrors(prev => ({ ...prev, first_gusset: '' }));
                            newState.first_gusset = 0;
                        }
                    }

                    if (fieldName === 'first_gusset') {
                        newState.second_gusset = Number(value);
                    }

                    if (fieldName === 'flap_type') {
                        if (Number(value) === 0) {
                            setPODErrors(prev => ({ ...prev, flap_size: '' }));
                            newState.flap_size = 0;
                            newState.tape = 0;
                        }
                    }

                    if (fieldName === 'kilograms' || fieldName === 'kilogram_price') {
                        newState.units = 0;
                        newState.unit_price = 0;
                    }

                    if (fieldName === 'units' || fieldName === 'unit_price') {
                        newState.kilograms = 0;
                        newState.kilogram_price = 0;
                    }

                    if (['reference', 'product_type', 'material', 'width', 'length', 'measure_unit', 'caliber', 'gussets_type', 'first_gusset', 'second_gusset', 'flap_type', 'flap_size', 'tape', 'die_cut_type'].includes(fieldName)) {
                        newState.reference_internal = generateReference(newState);
                    }
                    return newState;
                });
                setPODErrors(prev => ({ ...prev, [fieldName]: error }));
                console.log(podErrors);
                break;

            case 'payment':
                if (fieldName === 'payment_method') {
                    if (Number(value) === 0) setPaymentErrors(prev => ({ ...prev, payment_term: '' }));
                }

                setFormDataPayment(prev => ({ ...prev, [fieldName]: value }));
                setPaymentErrors(prev => ({ ...prev, [fieldName]: error }));
                break;
        }
    };

    const getCurrentDateString = (): string => {
        const today = getColombiaDate();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validar campos del último paso (Payment)
        const paymentFieldsToValidate = [
            'payment_payment_method',
            'payment_payment_term',
            'payment_advance',
            'po_delivery_date'
        ];

        const finalStepErrors: { [key: string]: string } = {};
        paymentFieldsToValidate.forEach(field => {
            const fieldName = field.replace('payment_', '').replace('po_', '');
            const value = field.startsWith('payment_')
                ? formDataPayment[fieldName as keyof Payment]
                : formDataPO[fieldName as keyof PurchaseOrderForm];
            const error = validateField(field, value);
            if (error) {
                finalStepErrors[fieldName] = error;
            }
        });

        if (Object.keys(finalStepErrors).length > 0) {
            setPaymentErrors(prev => ({
                ...prev,
                ...finalStepErrors
            }));
            return;
        }

        try {
            if (currentPO) {
                // 2. Actualizar Purchase Order
                const POData = {
                    customer: formDataPO.customer,
                    employee: formDataPO.employee,
                    observations: formDataPO.observations,
                    delivery_date: formDataPO.delivery_date instanceof Date
                        ? formDataPO.delivery_date.toISOString().split('T')[0]
                        : formDataPO.delivery_date,
                    order_date: formDataPO.order_date instanceof Date
                        ? formDataPO.order_date.toISOString().split('T')[0]
                        : formDataPO.order_date,
                    has_iva: formDataPO.has_iva,
                    subtotal: allPODetails.reduce((acc, detail) =>
                        acc + (detail.kilograms * detail.kilogram_price + detail.units * detail.unit_price), 0)
                };

                const poResponse = await axios.put(`http://127.0.0.1:8000/beiplas/business/purchaseOrders/${currentPO.id}/`, POData);

                if (poResponse.status === 200) {
                    // 3. Actualizar Payment
                    const paymentData = {
                        purchase_order: currentPO.id,
                        payment_method: formDataPayment.payment_method,
                        payment_term: Number(formDataPayment.payment_term),
                        advance: formDataPayment.advance || null
                    };

                    const paymentResponse = await axios.put(`http://127.0.0.1:8000/beiplas/business/payments/${currentPO.payment?.id}/`, paymentData);

                    if (paymentResponse.status === 200) {
                        // 4. Actualizar PODetails secuencialmente
                        for (const detailData of allPODetails) {
                            try {
                                const detail = {
                                    ...detailData,
                                    purchase_order: currentPO.id,
                                    first_gusset: detailData.first_gusset || 0,
                                    second_gusset: detailData.second_gusset || 0,
                                    flap_size: detailData.flap_size || 0
                                };
                                await axios.put(`http://127.0.0.1:8000/beiplas/business/poDetails/${detailData.id}/`, detail);
                            } catch (error) {
                                console.error("Error updating detail:", error);
                            }
                        }

                        showToast('Orden de Compra actualizada correctamente', 'success');
                    }
                }
            } else {
                // 2. Crear Purchase Order
                const POData = {
                    customer: formDataPO.customer,
                    employee: formDataPO.employee,
                    observations: formDataPO.observations,
                    delivery_date: formDataPO.delivery_date instanceof Date
                        ? formDataPO.delivery_date.toISOString().split('T')[0]
                        : formDataPO.delivery_date,
                    order_date: formDataPO.order_date instanceof Date
                        ? formDataPO.order_date.toISOString().split('T')[0]
                        : formDataPO.order_date,
                    has_iva: formDataPO.has_iva,
                    subtotal: allPODetails.reduce((acc, detail) =>
                        acc + (detail.kilograms * detail.kilogram_price + detail.units * detail.unit_price), 0)
                };

                const poResponse = await axios.post('http://127.0.0.1:8000/beiplas/business/purchaseOrders/', POData);

                if (poResponse.status === 201) {
                    const poId = poResponse.data.data.id;

                    // 3. Crear Payment
                    const paymentData = {
                        purchase_order: poId,
                        payment_method: formDataPayment.payment_method,
                        payment_term: formDataPayment.payment_term || null,
                        advance: formDataPayment.advance || null
                    };

                    const paymentResponse = await axios.post('http://127.0.0.1:8000/beiplas/business/payments/', paymentData);

                    if (paymentResponse.status === 201) {
                        // 4. Crear PODetails secuencialmente
                        for (const detailData of allPODetails) {
                            try {
                                const detail = {
                                    ...detailData,
                                    purchase_order: poId,
                                    first_gusset: detailData.first_gusset || 0,
                                    second_gusset: detailData.second_gusset || 0,
                                    flap_size: detailData.flap_size || 0
                                };
                                await axios.post('http://127.0.0.1:8000/beiplas/business/poDetails/', detail);
                            } catch (error) {
                                console.error("Error creating detail:", error);
                                // Si falla un detalle, eliminar la PO y payment
                                await axios.delete(`http://127.0.0.1:8000/beiplas/business/purchaseOrders/${poId}/`);
                                throw new Error('Error creating purchase order details');
                            }
                        }

                        showToast('Orden de Compra creada correctamente', 'success');
                    }
                }
            }

            handleCancel(false);
            fetchPOs();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                showToast(error.response.data.message || 'Error al crear la Orden de Compra', 'error');
            } else {
                showToast('Error inesperado al crear la Orden de Compra', 'error');
            }
        }
    };

    const handleView = (PurchaseOrder: PurchaseOrder, payment: Payment, PODetail: PODetail) => {
        setCurrentPO(PurchaseOrder);
        setCurrentPayment(payment);
        setCurrentPOD(PODetail);
        setViewModalOpen(true);
    };


    const handleEdit = async (PurchaseOrder: PurchaseOrder) => {
        showAlert(
            {
                title: 'Edición de una Orden de Compra',
                html: 'Al editar una orden de compra, los parametros de las OTs asociadas deben ser verificados según los cambios.<br><br>Esta acción dejará un registro con tu información de usuario.',
                icon: 'warning',
                confirmButtonText: 'Editar',
            },
            async () => {
                try {
                    setCurrentPO(PurchaseOrder);

                    // 1. Cargar las referencias del cliente
                    const customer = customers.find(c => c.id === PurchaseOrder.customer);
                    setReferences(customer?.references || []);

                    // 2. Establecer los datos de la orden de compra
                    setFormDataPO({
                        id: PurchaseOrder.id,
                        customer: PurchaseOrder.customer,
                        employee: PurchaseOrder.employee,
                        observations: PurchaseOrder.observations,
                        delivery_date: new Date(PurchaseOrder.delivery_date),
                        order_date: new Date(PurchaseOrder.order_date),
                        subtotal: PurchaseOrder.subtotal,
                        iva: PurchaseOrder.iva,
                        has_iva: PurchaseOrder.has_iva,
                        total: PurchaseOrder.total,
                        ordered_quantity: PurchaseOrder.details?.length || 0,
                        details: PurchaseOrder.details,
                        payment: PurchaseOrder.payment
                    });

                    // 3. Establecer los datos del pago (tomando el primer y único pago)
                    if (PurchaseOrder.payment) {
                        const payment = PurchaseOrder.payment;
                        setFormDataPayment({
                            id: payment.id,
                            purchase_order: payment.purchase_order,
                            payment_method: payment.payment_method,
                            payment_term: payment.payment_term,
                            advance: payment.advance
                        });
                    }

                    // 4. Establecer los detalles en allPODetails
                    if (PurchaseOrder.details && PurchaseOrder.details.length > 0) {
                        setAllPODetails(PurchaseOrder.details.map(detail => ({
                            id: detail.id,
                            purchase_order: detail.purchase_order,
                            reference: detail.reference,
                            product_type: detail.product_type,
                            material: detail.material,
                            reference_internal: detail.reference_internal,
                            film_color: detail.film_color,
                            measure_unit: detail.measure_unit,
                            width: detail.width,
                            length: detail.length,
                            gussets_type: detail.gussets_type,
                            first_gusset: detail.first_gusset,
                            second_gusset: detail.second_gusset,
                            flap_type: detail.flap_type,
                            flap_size: detail.flap_size,
                            tape: detail.tape,
                            die_cut_type: detail.die_cut_type,
                            sealing_type: detail.sealing_type,
                            caliber: detail.caliber,
                            roller_size: detail.roller_size,
                            additive: detail.additive,
                            has_print: detail.pantones_quantity > 0,
                            dynas_treaty_faces: detail.dynas_treaty_faces,
                            is_new_sketch: detail.is_new_sketch,
                            sketch_url: detail.sketch_url,
                            pantones_quantity: detail.pantones_quantity,
                            pantones_codes: detail.pantones_codes,
                            kilograms: detail.kilograms,
                            units: detail.units,
                            kilogram_price: detail.kilogram_price,
                            unit_price: detail.unit_price,
                            production_observations: detail.production_observations,
                            delivery_location: detail.delivery_location,
                            is_updated: detail.is_updated,
                            wo_number: detail.wo_number
                        })));
                        // 5. Establecer el primer detalle como el actual
                        setFormDataPOD({
                            ...PurchaseOrder.details[0],
                            has_print: PurchaseOrder.details[0].pantones_quantity > 0
                        });
                        setAdditiveCount(PurchaseOrder.details[0].additive.length);
                    }

                    // 6. Configurar el número total de pasos y el paso actual
                    setTotalSteps((PurchaseOrder.details?.length || 0) + 2);
                    setCurrentStep(1);

                    // 7. Abrir el modal
                    setFormModalOpen(true);

                } catch (error) {
                    console.error('Error loading purchase order details:', error);
                    showToast('Error al cargar los detalles de la orden de compra', 'error');
                }
            }
        );
    }

    const handleCancelPO = async (id: number) => {
        showAlert(
            {
                title: '¿Estás seguro de anular esta orden de compra?',
                html: 'No podrás revertir esta acción.<br><br>Esta acción dejará un registro con tu información de usuario.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Anular',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/purchaseOrders/${id}/`);
                    console.log(response);
                    if (response.status === 200) {
                        showToast('Orden de Compra anulada correctamente', 'success');
                        fetchPOs();
                    } else {
                        showToast('Error al anular la Orden de Compra', 'error');
                    }
                } catch (error) {
                    console.log(error);
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error al anular la orden de compra', 'error');
                    } else {
                        showToast('An unexpected error occurred', 'error');
                    }
                }
            },
            () => {
                showToast('Anulación cancelada', 'info');
            }
        );
    };

    const handleCancel = (toast: boolean = true) => {
        setIsReferenceEditable(false);
        setCurrentPO(null);
        setCurrentPayment(null);
        setCurrentPOD(null);
        setAdditiveCount(0);
        setPOErrors({});
        setPODErrors({});
        setPaymentErrors({});
        setFormDataPO(defaultPurchaseOrder);
        setFormDataPayment(defaultPayment);
        setFormDataPOD(defaultPODetail);
        setAllPODetails([]);
        setCurrentStep(1);
        setTotalSteps(3);
        setFormModalOpen(false);
        if (toast) {
            showToast('Acción cancelada', 'info');
        }
    };

    const scrollableRef = useRef(null);

    const scrollToTop = () => {
        if (scrollableRef.current) {
            (scrollableRef.current as HTMLElement).scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const handleNext = () => {
        if (currentStep === 1) {
            const poFieldsToValidate = [
                'po_employee',
                'po_customer',
                'po_ordered_quantity'
            ];

            const errors: POErrors = {};
            poFieldsToValidate.forEach(field => {
                const fieldName = field.replace('po_', '');
                const error = validateField(field, formDataPO[fieldName as keyof PurchaseOrderForm]);
                if (error) {
                    errors[fieldName as keyof POErrors] = error;
                }
            });

            if (Object.keys(errors).length > 0) {
                setPOErrors(errors);
                return;
            }
        } else if (currentStep < totalSteps) {

            if (formDataPOD.reference === 0 || formDataPOD.reference === null || formDataPOD.reference === undefined) {
                setPODErrors({
                    reference: 'La referencia es requerida'
                });
                return;
            }
            if (formDataPOD.reference) {
                const fieldsToValidate = [
                    'pod_reference_internal',
                    'pod_width',
                    'pod_length',
                    'pod_first_gusset',
                    'pod_flap_size',
                    'pod_caliber',
                    'pod_roller_size',
                    'pod_pantones_quantity',
                    'pod_pantones_codes',
                    'pod_kilograms',
                    'pod_units',
                    'pod_kilogram_price',
                    'pod_unit_price',
                    'pod_delivery_location'
                ];

                const errors: PODErrors = {};
                fieldsToValidate.forEach(field => {
                    const fieldName = field.replace('pod_', '');
                    const error = validateField(field, formDataPOD[fieldName as keyof PODetailForm]);
                    if (error) {
                        errors[fieldName as keyof PODErrors] = error;
                    }
                });

                if (Object.keys(errors).length > 0) {
                    setPODErrors(errors);
                    return;
                }
            }
        }

        // 2. Si pasa las validaciones, guardar el estado actual
        if (currentStep > 1 && currentStep < totalSteps) {
            setAllPODetails(prev => {
                const newDetails = [...prev];
                newDetails[currentStep - 2] = formDataPOD;
                return newDetails;
            });
        }

        // 3. Avanzar al siguiente paso y cargar datos
        const nextStep = Math.min(currentStep + 1, totalSteps);
        setCurrentStep(nextStep);

        if (nextStep > 1 && nextStep < totalSteps) {
            const nextStepIndex = nextStep - 2;
            const nextDetail = allPODetails[nextStepIndex];

            if (nextDetail) {
                setFormDataPOD(nextDetail);
                setAdditiveCount(nextDetail.additive.length);
            } else {
                setFormDataPOD(defaultPODetail);
                setAdditiveCount(0);
            }
        }

        // 4. Marcar que el paso ha cambiado para activar la validación en useEffect
        setStepChanged(true);
        scrollToTop();
    };

    const handlePrevious = () => {
        // Guardar el estado actual en allPODetails sin validación
        if (currentStep > 1 && currentStep < totalSteps) {
            setAllPODetails(prev => {
                const newDetails = [...prev];
                newDetails[currentStep - 2] = formDataPOD;
                return newDetails;
            });
        }

        // Retroceder al paso anterior
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);

        // Cargar el detalle anterior
        if (prevStep > 1) {
            const prevStepIndex = prevStep - 2;
            setFormDataPOD(allPODetails[prevStepIndex]);
            setAdditiveCount(allPODetails[prevStepIndex].additive.length);
        }

        // Limpiar errores al cambiar de paso
        setPOErrors({});
        setPODErrors({});
        setPaymentErrors({});

        scrollToTop();
    };

    const inputs = {
        employee: (
            <div>
                <SelectInput
                    label="Empleado"
                    name="po_employee"
                    value={{ value: formDataPO.employee, label: employees.find(e => e.id === formDataPO.employee)?.first_name || '' }}
                    onChange={(option) => handleInputChange({ target: { name: 'po_employee', value: option?.value || 0 } } as any)}
                    options={employees.map(employee => ({
                        value: employee.id,
                        label: employee.first_name + ' ' + employee.last_name
                    }))}
                    isClearable
                    required
                />
                {poErrors.employee && (
                    <p className="text-md text-red-500 mt-1 pl-1">{poErrors.employee}</p>
                )}
            </div>
        ),
        order_date: (
            <DateInput
                name="po_order_date"
                label="Fecha de Orden"
                selectedDate={new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }))}
                onChange={() => { }}
                required
                disabled={true}
            />
        ),
        customer: (
            <div>
                <SelectInput
                    label="Cliente"
                    name="po_customer"
                    value={{ value: formDataPO.customer, label: customers.find(c => c.id === formDataPO.customer)?.company_name }}
                    onChange={(option) => handleInputChange({ target: { name: 'po_customer', value: option?.value || 0 } } as any)}
                    options={customers.map(customer => ({
                        value: customer.id,
                        label: customer.company_name
                    }))}
                    isClearable
                    required
                />
                {poErrors.customer && (
                    <p className="text-md text-red-500 mt-1 pl-1">{poErrors.customer}</p>
                )}
            </div>
        ),
        ordered_quantity: (
            <div>
                <NumberInput
                    label="Cantidad de productos"
                    name="po_ordered_quantity"
                    value={formDataPO.ordered_quantity || 0}
                    min={1}
                    onChange={handleInputChange}
                    required
                />
                {poErrors.ordered_quantity && (
                    <p className="text-sm text-red-500 mt-1">{poErrors.ordered_quantity}</p>
                )}
            </div>
        ),
        //STEP 2 OF ordered_quantity (THIS SECTION IS REPEATED ordered_quantity times)
        reference: (
            <div>
                <SelectInput
                    label="Referencia"
                    name="pod_reference"
                    value={{ value: formDataPOD.reference, label: references?.find(reference => reference.id === formDataPOD.reference)?.reference }}
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
                        handleInputChange({ target: { name: 'pod_reference', value: option?.value } } as any);
                    }}
                    options={references?.map(reference => ({
                        value: reference.id,
                        label: reference.reference
                    }))}
                    isClearable
                    required
                />
                {podErrors.reference && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.reference}</p>
                )}
            </div>
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
                disabled
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
            <div>
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
                {podErrors.reference_internal && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.reference_internal}</p>
                )}
            </div>
        ),
        film_color: (
            <TextInput
                label="Color de Película"
                name="pod_film_color"
                value={materials.find(m => m.id === formDataPOD.material)?.name === 'Maíz' ? 'SIN COLOR' : formDataPOD.film_color}
                onChange={handleInputChange}
                disabled={materials.find(m => m.id === formDataPOD.material)?.name === 'Maíz'}
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
            />
        ),
        width: (
            <div>
                <NumberInput
                    label="Ancho"
                    name="pod_width"
                    value={formDataPOD.width}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                />
                {podErrors.width && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.width}</p>
                )}
            </div>
        ),
        length: ['Lamina', 'Bolsa'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name) && (
            <div>
                <NumberInput
                    label="Largo"
                    name="pod_length"
                    value={formDataPOD.length}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                />
                {podErrors.length && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.length}</p>
                )}
            </div>
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
            <div>
                <NumberInput
                    label="Tamaño de Fuelle"
                    name="pod_first_gusset"
                    value={formDataPOD.first_gusset || 0}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    required
                />
                {podErrors.first_gusset && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.first_gusset}</p>
                )}
            </div>
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
                <div>
                    <NumberInput
                        label="Tamaño de Solapa"
                        name="pod_flap_size"
                        value={formDataPOD.flap_size || 0}
                        onChange={handleInputChange}
                        min={0}
                        step={0.01}
                        required
                    />
                    {podErrors.flap_size && (
                        <p className="text-md text-red-500 mt-1 pl-1">{podErrors.flap_size}</p>
                    )}
                </div>
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
            <div>
                <NumberInput
                    label="Calibre"
                    name="pod_caliber"
                    value={formDataPOD.caliber}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                />
                {podErrors.caliber && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.caliber}</p>
                )}
            </div>
        ),
        roller_size: (
            <div>
                <NumberInput
                    label="Rodillo"
                    name="pod_roller_size"
                    value={formDataPOD.roller_size}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                />
                {podErrors.roller_size && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.roller_size}</p>
                )}
            </div>
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
                        setPODErrors(prev => ({
                            ...prev,
                            pantones_quantity: '',
                            pantones_codes: ''
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
                <label htmlFor="is_new_sketch" className="text-sm font-medium">
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
            <div>
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
                        value > 0 && setPODErrors(prev => ({
                            ...prev,
                            pantones_quantity: ''
                        }));
                    }}
                    options={[1, 2, 3, 4].map(num => ({
                        value: num,
                        label: num.toString()
                    }))}
                    required
                />
                {podErrors.pantones_quantity && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.pantones_quantity}</p>
                )}
            </div>
        ),
        pantones_codes: formDataPOD.has_print && formDataPOD.pantones_quantity > 0 && (
            <div>
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

                                // Actualizar formDataPOD con los nuevos códigos
                                setFormDataPOD(prev => ({
                                    ...prev,
                                    pantones_codes: newPantoneCodes
                                }));

                                // Validar si todos los códigos requeridos están llenos
                                const hasEmptyRequiredPantone = newPantoneCodes
                                    .slice(0, formDataPOD.pantones_quantity)
                                    .some(code => !code || code.trim() === '');

                                // Actualizar errores
                                setPODErrors(prev => ({
                                    ...prev,
                                    pantones_codes: hasEmptyRequiredPantone ?
                                        'Todos los códigos Pantone son requeridos' :
                                        ''
                                }));
                            }}
                            required
                            placeholder={`Ingrese el código Pantone ${index + 1}`}
                        />
                    ))}
                </div>
                {podErrors.pantones_codes && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.pantones_codes}</p>
                )}
            </div>
        ),
        kilograms: (
            <div>
                <NumberInput
                    label="Kilogramos"
                    name="pod_kilograms"
                    value={formDataPOD.kilograms}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                    placeholder={formDataPOD.kilograms === 0 ? '0.00 kg' : undefined}
                    formatter={(value) => `${Number(value).toLocaleString('es-CO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} kg`}
                />
                {podErrors.kilograms && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.kilograms}</p>
                )}
            </div>
        ),
        units: (
            <div>
                <NumberInput
                    label="Unidades"
                    name="pod_units"
                    value={formDataPOD.units}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={1}
                    placeholder={formDataPOD.units === 0 ? '0 uds' : undefined}
                    formatter={(value) => `${Number(value).toLocaleString('es-CO')} uds`}
                />
                {podErrors.units && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.units}</p>
                )}
            </div>
        ),
        kilogram_price: (
            <div>
                <NumberInput
                    label="Precio por Kilogramo"
                    name="pod_kilogram_price"
                    value={formDataPOD.kilogram_price}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                    placeholder={formDataPOD.kilogram_price === 0 ? '$ 0' : undefined}
                    formatter={(value) => `$ ${Number(value).toLocaleString('es-CO', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`}
                />
                {podErrors.kilogram_price && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.kilogram_price}</p>
                )}
            </div>
        ),
        unit_price: (
            <div>
                <NumberInput
                    label="Precio por Unidad"
                    name="pod_unit_price"
                    value={formDataPOD.unit_price}
                    onChange={handleInputChange}
                    required
                    min={0}
                    step={0.01}
                    placeholder={formDataPOD.unit_price === 0 ? '$ 0' : undefined}
                    formatter={(value) => `$ ${Number(value).toLocaleString('es-CO', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    })}`}
                />
                {podErrors.unit_price && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.unit_price}</p>
                )}
            </div>
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
            <div>
                <TextInput
                    label="Lugar de Entrega"
                    name="pod_delivery_location"
                    value={formDataPOD.delivery_location}
                    onChange={handleInputChange}
                    required
                />
                {podErrors.delivery_location && (
                    <p className="text-md text-red-500 mt-1 pl-1">{podErrors.delivery_location}</p>
                )}
            </div>
        ),
        //STEP 3 AFTER DETAILS
        payment_method: (
            <SelectInput
                label="Método de Pago"
                name="payment_payment_method"
                value={{ value: formDataPayment.payment_method, label: paymentMethodChoices[formDataPayment.payment_method as keyof typeof paymentMethodChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'payment_payment_method', value: option?.value || 0 } } as any)}
                options={Object.entries(paymentMethodChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        payment_term: (
            <div>
                <NumberInput
                    label="Término de pago"
                    name="payment_payment_term"
                    value={formDataPayment.payment_term}
                    onChange={handleInputChange}
                    required={formDataPayment.payment_method === 1}
                    placeholder={formDataPayment.payment_term === 0 ? '0 días' : undefined}
                    formatter={(value) => `${Number(value).toLocaleString('es-CO')} días`}
                />
                {paymentErrors.payment_term && (
                    <p className="text-md text-red-500 mt-1 pl-1">{paymentErrors.payment_term}</p>
                )}
            </div>
        ),
        advance: (
            <NumberInput
                label="Anticipo"
                name="payment_advance"
                placeholder={formDataPayment.advance === 0 ? '$ 0' : undefined}
                formatter={(value) => `$ ${Number(value).toLocaleString('es-CO', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                })}`}
                value={formDataPayment.advance}
                onChange={handleInputChange}
            />
        ),
        delivery_date: (
            <div>
                <DateInput
                    name="po_delivery_date"
                    label="Fecha de Entrega"
                    minDate={getMinDeliveryDate()}
                    selectedDate={formDataPO.delivery_date}

                    onChange={(date) => {
                        handleInputChange({
                            target: {
                                name: 'po_delivery_date',
                                value: date ? getColombiaDate(date) : null
                            }
                        });
                        if (date && getColombiaDate(date) >= getMinDeliveryDate()) {
                            setPOErrors(prev => ({ ...prev, delivery_date: '' }));
                        }
                    }}
                    required
                    disabled={false}
                />
                {poErrors.delivery_date && (
                    <p className="text-md text-red-500 mt-1 pl-1">{poErrors.delivery_date}</p>
                )}
            </div>
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
        ),
        financial_summary: (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Resumen Financiero</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal:</p>
                        <p className="text-lg font-medium">
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(calculateTotals(allPODetails, formDataPO.has_iva).subtotal)}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <div className="mr-5">
                                <p className="text-sm text-gray-500 dark:text-gray-400">IVA (19%):</p>
                                <p className="text-lg font-medium">
                                    {new Intl.NumberFormat('es-CO', {
                                        style: 'currency',
                                        currency: 'COP',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(calculateTotals(allPODetails, formDataPO.has_iva).iva)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="has_iva" className="text-sm font-medium">¿Lleva IVA?</label>
                                <Switch id="has_iva" checked={formDataPO.has_iva || false} onCheckedChange={(checked) => {
                                    setFormDataPO(prev => ({ ...prev, has_iva: checked }));
                                }} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total:</p>
                        <p className="text-lg font-semibold">
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(calculateTotals(allPODetails, formDataPO.has_iva).total)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Deuda Total:</p>
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                            {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(calculateTotals(allPODetails, formDataPO.has_iva, formDataPayment.advance).debtTotal)}
                        </p>
                    </div>
                </div>
            </div>
        ),
    };

    const orderFields = ['order_date', 'employee', 'customer', 'ordered_quantity'];

    const getDetailsLayout = () => {
        const commonFields = ['product_type', 'material'];
        const dimensionFields = ['measure_unit', 'width'];
        const has_print = ['has_print'];
        const printFields = formDataPOD.has_print
            ? ['dynas_treaty_faces', 'pantones_quantity', 'pantones_codes']
            : [];

        const line = ['line'];

        if (['Tubular', 'Semi-tubular'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {

            if (formDataPOD.has_print) {
                has_print.push('is_new_sketch');
            }

            return [
                ['reference'],
                commonFields,
                ['reference_internal'],
                line,
                ['film_color', ...dimensionFields],
                ['caliber', 'roller_size'],
                line,
                ['additive_count', 'additive'],
                line,
                has_print,
                printFields,
                line,
                ['kilograms', 'kilogram_price'],
                line,
                ['delivery_location', 'production_observations']
            ].filter(row => row.length > 0);
        } else if (['Lamina'].includes(productTypes.find(pt => pt.id === formDataPOD.product_type)?.name)) {

            if (formDataPOD.has_print) {
                has_print.push('is_new_sketch');
            }

            return [
                ['reference'],
                commonFields,
                ['reference_internal'],
                line,
                ['film_color', ...dimensionFields, 'length'],
                ['caliber', 'roller_size'],
                line,
                ['additive_count', 'additive'],
                line,
                has_print,
                printFields,
                line,
                ['units', 'unit_price'],
                ['delivery_location', 'production_observations']
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
            if (formDataPOD.flap_type !== 4) {
                bagFields2.push('die_cut_type');
            }
            bagFields2.push('sealing_type', 'caliber', 'roller_size');

            if (formDataPOD.has_print) {
                has_print.push('is_new_sketch');
            }

            return [
                ['reference'],
                commonFields,
                ['reference_internal'],
                line,
                ['film_color', ...dimensionFields, 'length'],
                bagFields1,
                bagFields2,
                line,
                ['additive_count', 'additive'],
                line,
                has_print,
                printFields,
                line,
                ['units', 'unit_price'],
                ['delivery_location', 'production_observations']
            ].filter(row => row.length > 0);
        }

        return [['reference']];
    };

    // Función auxiliar para obtener los errores del paso actual
    const getCurrentStepErrors = () => {
        switch (currentStep) {
            case 1:
                // Errores del primer paso (PO)
                return Object.entries(poErrors).reduce((acc, [key, value]) => {
                    if (value && key !== 'delivery_date') acc[`Empleado - ${key}`] = value;
                    return acc;
                }, {} as Record<string, string>);

            case totalSteps:
                // Errores del último paso (Payment + delivery_date from PO)
                const lastStepErrors = {
                    ...Object.entries(paymentErrors).reduce((acc, [key, value]) => {
                        if (value) acc[`Pago - ${key}`] = value;
                        return acc;
                    }, {} as Record<string, string>),
                    ...Object.entries(poErrors).reduce((acc, [key, value]) => {
                        if (key === 'delivery_date' && value) {
                            acc[`Entrega - ${key}`] = value;
                        }
                        return acc;
                    }, {} as Record<string, string>)
                };
                return lastStepErrors;

            default:
                // Errores de los pasos intermedios (PODetails)
                return Object.entries(podErrors).reduce((acc, [key, value]) => {
                    if (value) acc[`Detalle - ${key}`] = value;
                    return acc;
                }, {} as Record<string, string>);
        }
    };

    // Función para verificar si hay errores en un paso específico
    const hasStepErrors = (step: number): boolean => {
        switch (step) {
            case 1:
                // Check PO errors excluding delivery_date
                return Object.entries(poErrors).some(([key, error]) =>
                    key !== 'delivery_date' && error !== ''
                );
            case totalSteps:
                // Check both payment errors and delivery_date from PO errors
                return Object.values(paymentErrors).some(error => error !== '') ||
                    (poErrors.delivery_date ? poErrors.delivery_date !== '' : false);
            default:
                return Object.values(podErrors).some(error => error !== '');
        }
    };

    // Crear un objeto dinámico de stepErrors basado en totalSteps
    const getStepErrors = () => {
        const errors: { [key: number]: boolean } = {
            1: hasStepErrors(1), // Primer paso (PO)
            [totalSteps]: hasStepErrors(totalSteps), // Último paso (Payment)
        };

        // Agregar errores para los pasos intermedios (PODetails)
        for (let i = 2; i < totalSteps; i++) {
            errors[i] = hasStepErrors(i);
        }

        return errors;
    };

    return (
        <div className="container">
            {showAnnulled && (
                <div className="mb-2 pl-2">
                    <p className="text-gray-600 dark:text-gray-400">
                        Archivo de anuladas
                    </p>
                </div>
            )}

            <TopTableElements
                onAdd={() => setFormModalOpen(true)}
                onSearch={(term) => setSearchTerm(term)}
                onFilter={() => { }}
                filterOptions={[]}
                showAnnulledButton={!showAnnulled}
                showAnnulled={showAnnulled}
                onToggleAnnulled={() => setShowAnnulled(!showAnnulled)}
                showBackButton={showAnnulled}
                onBack={() => setShowAnnulled(false)}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {POs.length === 0 ? (
                    <div className="flex justify-center items-center h-full pt-20">
                        <p className="text-gray-600 dark:text-gray-400">
                            {showAnnulled ? 'No hay ordenes de compra anuladas' : 'No hay ordenes de compra disponibles'}
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableHead>Cliente</TableHead>
                            <TableHead>O.T. - Ficha</TableHead>
                            <TableHead>Fecha de Solicitud</TableHead>
                            <TableHead>Fecha de Remisión</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableHeader>
                        <TableBody>
                            {POs
                                .filter(po =>
                                    // Filtrar por órdenes anuladas según el estado
                                    po.was_annulled === showAnnulled &&
                                    (customers.find(c => c.id === po.customer)?.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        po.details?.find(detail => detail.reference.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        po.details?.find(detail => detail.wo_number?.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        po.order_date.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        po.delivery_date.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        po.total?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                                )
                                .map((po) => (
                                    <TableRow key={po.id}>
                                        <TableCell className={showAnnulled ? 'bg-red-300 dark:bg-red-500/70' : ''}>
                                            {customers.find(c => c.id === po.customer)?.company_name}
                                        </TableCell>
                                        <TableCell className={showAnnulled ? 'bg-red-300 dark:bg-red-500/70' : ''}>
                                            {po.details?.map((detail, index) => (
                                                <div key={detail.id}>
                                                    OT {detail.wo_number} - Ficha {detail.reference}
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell className={showAnnulled ? 'bg-red-300 dark:bg-red-500/70' : ''}>
                                            {new Date(po.order_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className={showAnnulled ? 'bg-red-300 dark:bg-red-500/70' : ''}>
                                            {new Date(po.delivery_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className={showAnnulled ? 'bg-red-300 dark:bg-red-500/70' : ''}>
                                            {new Intl.NumberFormat('es-CO', {
                                                style: 'currency',
                                                currency: 'COP',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(po.total ?? 0)}
                                        </TableCell>
                                        <TableCell className={showAnnulled ? 'bg-red-300 dark:bg-red-500/70' : ''}>
                                            {!showAnnulled && (
                                                <>
                                                    <button
                                                        className={`${po.was_annulled ? 'text-gray-400 opacity-40' : 'text-orange-500 hover:text-orange-700'} mr-3 transition-colors`}
                                                        onClick={() => handleEdit(po)}
                                                        disabled={po.was_annulled}
                                                    >
                                                        <LuClipboardEdit size={20} />
                                                    </button>
                                                    <button
                                                        className={`${po.was_annulled ? 'text-gray-400 opacity-40' : 'text-red-500 hover:text-red-700'} mr-3 transition-colors`}
                                                        onClick={() => handleCancelPO(po.id || 0)}
                                                        disabled={po.was_annulled}
                                                    >
                                                        <LuBan size={20} />
                                                    </button>
                                                </>
                                            )}
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
                        currentStep === totalSteps ? [
                            ['payment_method', ...(formDataPayment.payment_method === 1 ? ['payment_term'] : []), 'advance', 'delivery_date'],
                            ['financial_summary'],
                            ['observations']
                        ] :
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
                    errors={getCurrentStepErrors()}
                    stepErrors={getStepErrors()}
                    scrollableRef={scrollableRef}
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