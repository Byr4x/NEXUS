'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LuView, LuClipboardEdit, LuTrash2, LuPenLine, LuArrowLeft } from 'react-icons/lu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { TextInput, NumberInput, SelectInput } from '@/components/ui/StyledInputs';
import FormModal from '@/components/modals/FormModal';
import ViewModal from '@/components/modals/ViewModal';
import TopTableElements from '@/components/ui/TopTableElements';
import { showAlert, showToast } from '@/components/ui/Alerts';
import { useRouter } from 'next/navigation';

interface Customer {
    id: number;
    nit: number;
    company_name: string;
    contact: string;
    contact_email: string;
    contact_phone_number: string;
    location: string;
    is_active: boolean;
}

interface Reference {
    id: number;
    customer: number;
    reference: string;
    product_type: number;
    material: number;
    width: number;
    length: number;
    measure_unit: number;
    caliber: number;
    film_color: string;
    additive: string[];
    sealing_type: number;
    flap_type: number;
    flap_size: number | null;
    gussets_type: number;
    first_gusset: number | null;
    second_gusset: number | null;
    tape: number;
    die_cut_type: number;
    roller_size: number;
    dynas_treaty_faces: number;
    pantones_quantity: number;
    pantones_codes: string[];
    sketch_url: string;
    is_active: boolean;
}

interface FormData extends Omit<Reference, 'id'> {
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

export default function CustomerReferencesPage({ params }: { params: { customerID: string } }) {
    const [references, setReferences] = useState<Reference[]>([]);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [currentReference, setCurrentReference] = useState<Reference | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<FormData>({
        customer: parseInt(params.customerID),
        reference: '',
        product_type: 0,
        material: 0,
        width: 0,
        length: 0,
        measure_unit: 0,
        caliber: 0,
        film_color: '',
        additive: [],
        sealing_type: 0,
        flap_type: 0,
        flap_size: null,
        gussets_type: 0,
        first_gusset: null,
        second_gusset: null,
        tape: 0,
        die_cut_type: 0,
        roller_size: 0,
        dynas_treaty_faces: 0,
        pantones_quantity: 0,
        pantones_codes: [],
        sketch_url: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp',
        is_active: true,
        has_print: false,
    });

    const [isReferenceEditable, setIsReferenceEditable] = useState(false);

    const [additiveCount, setAdditiveCount] = useState(0);

    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchCustomerData();
        fetchReferences();
        fetchProductTypes();
        fetchMaterials();
    }, [params.customerID]);

    const fetchReferences = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/beiplas/business/customers/${params.customerID}/`);
            console.log(response.data);
            setReferences(response.data.references);
        } catch (error) {
            console.error('Error fetching references:', error);
            showToast('Error fetching references', 'error');
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/beiplas/business/customers/${params.customerID}/`);
            setCurrentCustomer(response.data);
        } catch (error) {
            console.error('Error fetching customer:', error);
            showToast('Error fetching customer data', 'error');
            router.push('/pot/customers'); // Redirige si hay error
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

    const generateReference = (data: FormData): string => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === 'gussets_type') {
            if (Number(value) === 1) {
                newFormData.die_cut_type = 2;
            } else {
                newFormData.die_cut_type = 0;
            }
        }

        if (['product_type', 'material', 'width', 'length', 'measure_unit', 'caliber',
            'gussets_type', 'first_gusset', 'second_gusset', 'flap_type', 'flap_size',
            'tape', 'die_cut_type'].includes(name)) {
            const reference = generateReference(newFormData);
            newFormData.reference = reference;
        }

        setFormData(newFormData);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            film_color: materials.find(m => m.id === formData.material)?.name === 'Maíz'
                ? 'SIN COLOR'
                : (formData.film_color ? formData.film_color : 'SIN COLOR'),
            dynas_treaty_faces: formData.has_print ? formData.dynas_treaty_faces : 0,
            pantones_quantity: formData.has_print ? formData.pantones_quantity : 0,
            pantones_codes: formData.has_print ? formData.pantones_codes.slice(0, formData.pantones_quantity) : []
        };

        delete dataToSubmit.has_print;

        try {
            let response;
            let message = '';

            if (currentReference) {
                response = await axios.put(`http://127.0.0.1:8000/beiplas/business/references/${currentReference.id}/`, dataToSubmit);
                message = 'Referencia actualizada correctamente';
            } else {
                response = await axios.post('http://127.0.0.1:8000/beiplas/business/references/', dataToSubmit);
                message = 'Referencia creada correctamente';
            }

            if (response.data.status === 'success') {
                showToast(message, 'success');
                fetchReferences();
                setIsReferenceEditable(false);
                setFormModalOpen(false);
                setCurrentReference(null);
                setFormData({
                    customer: parseInt(params.customerID),
                    reference: '',
                    product_type: 0,
                    material: 0,
                    width: 0,
                    length: 0,
                    measure_unit: 0,
                    caliber: 0,
                    film_color: '',
                    additive: [],
                    sealing_type: 0,
                    flap_type: 0,
                    flap_size: null,
                    gussets_type: 0,
                    first_gusset: null,
                    second_gusset: null,
                    tape: 0,
                    die_cut_type: 0,
                    roller_size: 0,
                    dynas_treaty_faces: 0,
                    pantones_quantity: 0,
                    pantones_codes: [],
                    sketch_url: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp',
                    is_active: true,
                    has_print: false,
                });
            } else {
                showToast(response.data.message, 'error');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                showToast(error.response.data.message || 'An error occurred', 'error');
            } else {
                showToast('An unexpected error occurred', 'error');
            }
        }
    };

    const handleEdit = (reference: Reference) => {
        setCurrentReference(reference);
        setAdditiveCount(reference.additive.length);
        setFormData({
            customer: reference.customer,
            reference: reference.reference,
            product_type: reference.product_type,
            material: reference.material,
            width: reference.width,
            length: reference.length,
            measure_unit: reference.measure_unit,
            caliber: reference.caliber,
            film_color: reference.film_color,
            additive: reference.additive,
            sealing_type: reference.sealing_type,
            flap_type: reference.flap_type,
            flap_size: reference.flap_size,
            gussets_type: reference.gussets_type,
            first_gusset: reference.first_gusset,
            second_gusset: reference.second_gusset,
            tape: reference.tape,
            die_cut_type: reference.die_cut_type,
            roller_size: reference.roller_size,
            dynas_treaty_faces: reference.dynas_treaty_faces,
            pantones_quantity: reference.pantones_quantity,
            pantones_codes: reference.pantones_codes,
            sketch_url: reference.sketch_url,
            is_active: reference.is_active,
            has_print: false,
        });
        setFormModalOpen(true);
    };

    const handleView = (reference: Reference) => {
        setCurrentReference(reference);
        setViewModalOpen(true);
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
                    const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/references/${id}/`);
                    if (response.status === 204) {
                        showToast('Referencia eliminada correctamente', 'success');
                        fetchReferences();
                    } else {
                        showToast(response.data.message, 'error');
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

    const handleSwitchChange = async (id: number, currentStatus: boolean) => {
        showAlert(
            {
                title: 'Confirmar cambio de estado',
                text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} esta referencia?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const newStatus = !currentStatus;
                    const reference = references.find(r => r.id === id);
                    if (!reference) {
                        showToast('Reference not found', 'error');
                        return;
                    }

                    const updatedData = {
                        ...reference,
                        is_active: newStatus
                    };

                    const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/references/${id}/`, updatedData);
                    if (response.data.status === 'success') {
                        showToast(response.data.message, 'success');
                        setReferences(references.map(r =>
                            r.id === id ? { ...r, is_active: newStatus } : r
                        ));
                    } else {
                        showToast(response.data.message, 'error');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error updating reference status', 'error');
                    } else {
                        showToast('An unexpected error occurred', 'error');
                    }
                }
            },
            () => {
                showToast('Cambio de estado cancelado', 'info');
            }
        );
    };

    const handleCancel = () => {
        setIsReferenceEditable(false);
        setCurrentReference(null);
        setAdditiveCount(0);
        setFormData({
            customer: parseInt(params.customerID),
            reference: '',
            product_type: 0,
            material: 0,
            width: 0,
            length: 0,
            measure_unit: 0,
            caliber: 0,
            film_color: '',
            additive: [],
            sealing_type: 0,
            flap_type: 0,
            flap_size: null,
            gussets_type: 0,
            first_gusset: null,
            second_gusset: null,
            tape: 0,
            die_cut_type: 0,
            roller_size: 0,
            dynas_treaty_faces: 0,
            pantones_quantity: 0,
            pantones_codes: [],
            sketch_url: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1728476524/sketches/hlmgblou2onqaf0efh6b.webp',
            is_active: true,
            has_print: false,
        });
        setFormModalOpen(false);
        showToast('Acción cancelada', 'info');
    };

    const inputs = {
        customer: (
            <SelectInput
                label="Cliente"
                name="customer"
                value={{ value: currentCustomer?.id, label: currentCustomer?.company_name }}
                onChange={(option) => handleInputChange({ target: { name: 'customer', value: option?.value || 0 } } as any)}
                options={[]}
                required
                disabled
            />
        ),
        product_type: (
            <SelectInput
                label="Tipo de Producto"
                name="product_type"
                value={{ value: formData.product_type, label: productTypes.find(pt => pt.id === formData.product_type)?.name }}
                onChange={(option) => handleInputChange({ target: { name: 'product_type', value: option?.value || 0 } } as any)}
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
                name="material"
                value={{ value: formData.material, label: materials.find(m => m.id === formData.material)?.name }}
                onChange={(option) => handleInputChange({ target: { name: 'material', value: option?.value || 0 } } as any)}
                options={materials.map(material => ({
                    value: material.id,
                    label: material.name
                }))}
                required
            />
        ),
        reference: (
            <div className="relative">
                <TextInput
                    label="Referencia"
                    name="reference"
                    value={formData.reference}
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
        measure_unit: (
            <SelectInput
                label="Unidad de Medida"
                name="measure_unit"
                value={{ value: formData.measure_unit, label: measureUnitChoices[formData.measure_unit as keyof typeof measureUnitChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'measure_unit', value: option?.value || 0 } } as any)}
                options={Object.entries(measureUnitChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
                required
            />
        ),
        film_color: (
            <TextInput
                label="Color de Película"
                name="film_color"
                value={materials.find(m => m.id === formData.material)?.name === 'Maíz' ? 'Beige' : formData.film_color}
                onChange={handleInputChange}
                disabled={materials.find(m => m.id === formData.material)?.name === 'Maíz'}
                required
            />
        ),
        width: (
            <NumberInput
                label="Ancho"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        length: ['Lamina', 'Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) && (
            <NumberInput
                label="Largo"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        gussets_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) && (
            <SelectInput
                label="Tipo de Fuelle"
                name="gussets_type"
                value={{ value: formData.gussets_type, label: gussetsTypeChoices[formData.gussets_type as keyof typeof gussetsTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'gussets_type', value: option?.value || 0 } } as any)}
                options={Object.entries(gussetsTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        first_gusset: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) && formData.gussets_type !== 0 && (
            <NumberInput
                label="Tamaño de Fuelle"
                name="first_gusset"
                value={formData.first_gusset || 0}
                onChange={handleInputChange}
                min={0}
                step={0.01}
                required
            />
        ),
        flap_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) && formData.gussets_type !== 1 && (
            <SelectInput
                label="Tipo de Solapa"
                name="flap_type"
                value={{ value: formData.flap_type, label: flapTypeChoices[formData.flap_type as keyof typeof flapTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'flap_type', value: option?.value || 0 } } as any)}
                options={Object.entries(flapTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        flap_size: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) &&
            formData.gussets_type !== 1 &&
            formData.flap_type !== 0 && (
                <NumberInput
                    label="Tamaño de Solapa"
                    name="flap_size"
                    value={formData.flap_size || 0}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    required
                />
            ),
        die_cut_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) &&
            formData.flap_type !== 4 && (
                <div>
                    <SelectInput
                        label="Tipo de Troquel"
                        name="die_cut_type"
                        value={{
                            value: formData.die_cut_type,
                            label: dieCutTypeChoices[formData.die_cut_type as keyof typeof dieCutTypeChoices]
                        }}
                        onChange={(option) => handleInputChange({
                            target: { name: 'die_cut_type', value: option?.value || 0 }
                        } as any)}
                        options={Object.entries(dieCutTypeChoices)
                            .filter(([key, _]) => {
                                if (formData.gussets_type === 1) {
                                    return Number(key) === 2;
                                }
                                return Number(key) !== 2;
                            })
                            .map(([key, value]) => ({
                                value: Number(key),
                                label: value
                            }))}
                        required
                        disabled={formData.gussets_type === 1}
                    />
                    {formData.gussets_type === 1 && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                            El troquel se establece automáticamente como camiseta para bolsas con fuelle lateral
                        </p>
                    )}
                </div>
            ),
        sealing_type: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) && (
            <SelectInput
                label="Tipo de Sellado"
                name="sealing_type"
                value={{ value: formData.sealing_type, label: sealingTypeChoices[formData.sealing_type as keyof typeof sealingTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'sealing_type', value: option?.value || 0 } } as any)}
                options={Object.entries(sealingTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
        caliber: (
            <NumberInput
                label="Calibre"
                name="caliber"
                value={formData.caliber}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        roller_size: (
            <NumberInput
                label="Tamaño del Rodillo"
                name="roller_size"
                value={formData.roller_size}
                onChange={handleInputChange}
                required
                min={0}
                step={0.01}
            />
        ),
        tape: ['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name) &&
            formData.flap_type === 4 && (
                <SelectInput
                    label="Tipo de Cinta"
                    name="tape"
                    value={{ value: formData.tape, label: tapeChoices[formData.tape as keyof typeof tapeChoices] }}
                    onChange={(option) => handleInputChange({ target: { name: 'tape', value: option?.value || 0 } } as any)}
                    options={Object.entries(tapeChoices).map(([key, value]) => ({
                        value: Number(key),
                        label: value
                    }))}
                />
            ),
        has_print: (
            <div className="flex items-center space-x-2">
                <label htmlFor="has_print" className="text-sm font-medium">
                    ¿Lleva impresión?
                </label>
                <Switch
                    id="has_print"
                    checked={formData.has_print || false}
                    onCheckedChange={(checked) => {
                        setFormData(prev => ({
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
        dynas_treaty_faces: formData.has_print && (
            <SelectInput
                label="Caras Tratadas"
                name="dynas_treaty_faces"
                value={{
                    value: formData.dynas_treaty_faces,
                    label: dynasTreatyFacesChoices[formData.dynas_treaty_faces as keyof typeof dynasTreatyFacesChoices]
                }}
                onChange={(option) => handleInputChange({
                    target: { name: 'dynas_treaty_faces', value: option?.value || 0 }
                } as any)}
                options={Object.entries(dynasTreatyFacesChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
                required
            />
        ),
        pantones_quantity: formData.has_print && (
            <SelectInput
                label="Cantidad de Pantones"
                name="pantones_quantity"
                value={{
                    value: formData.pantones_quantity,
                    label: formData.pantones_quantity.toString()
                }}
                onChange={(option) => {
                    const value = option?.value || 0;
                    setFormData(prev => ({
                        ...prev,
                        pantones_quantity: value,
                        pantones_codes: Array(value).fill('').slice(0, 4) // Reset pantone codes array with new length
                    }));
                }}
                options={[1, 2, 3, 4].map(num => ({
                    value: num,
                    label: num.toString()
                }))}
                required
            />
        ),
        pantones_codes: formData.has_print && formData.pantones_quantity > 0 && (
            <div className="space-y-2">
                <div className="space-y-2">
                    {Array.from({ length: Math.min(formData.pantones_quantity, 4) }).map((_, index) => (
                        <TextInput
                            key={index}
                            label={`Pantone ${index + 1}`}
                            name={`pantone_${index}`}
                            value={formData.pantones_codes[index] || ''}
                            onChange={(e) => {
                                const newPantoneCodes = [...formData.pantones_codes];
                                newPantoneCodes[index] = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    pantones_codes: newPantoneCodes
                                }));
                            }}
                            required
                        />
                    ))}
                </div>
            </div>
        ),
        additive_count: (
            <SelectInput
                label="Cantidad de Aditivos"
                name="additive_count"
                value={{
                    value: additiveCount,
                    label: additiveCount.toString()
                }}
                onChange={(option) => {
                    const value = option?.value || 0;
                    setAdditiveCount(value);
                    setFormData(prev => ({
                        ...prev,
                        additive: Array(value).fill('') // Reset additive array with new length
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
                <div className="space-y-2">
                    {Array.from({ length: Math.min(additiveCount, 4) }).map((_, index) => (
                        <TextInput
                            key={index}
                            label={`Aditivo ${index + 1}`}
                            name={`additive_${index}`}
                            value={formData.additive[index] || ''}
                            onChange={(e) => {
                                const newAdditives = [...formData.additive];
                                newAdditives[index] = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    additive: newAdditives
                                }));
                            }}
                            required
                        />
                    ))}
                </div>
            </div>
        ),
        line:
            <div>
                <hr className="my-5 border-small border-gray-500 border-dashed" />
            </div>
    };

    const getFormLayout = () => {
        const commonFields = ['customer', 'product_type', 'material'];
        const dimensionFields = ['measure_unit'];
        const printFields = formData.has_print
            ? ['dynas_treaty_faces', 'pantones_quantity', 'pantones_codes']
            : [];

        // Añade un campo de línea divisoria
        const line = ['line'];

        if (['Tubular', 'Semi-tubular'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name)) {
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
        } else if (['Lamina'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name)) {
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
        } else if (['Bolsa'].includes(productTypes.find(pt => pt.id === formData.product_type)?.name)) {
            const bagFields1 = ['gussets_type'];
            if (formData.gussets_type !== 0) {
                bagFields1.push('first_gusset');
            }
            if (formData.gussets_type !== 1) {
                bagFields1.push('flap_type');
                if (formData.flap_type !== 0) {
                    bagFields1.push('flap_size');
                }
            }

            const bagFields2 = [];
            if (formData.gussets_type !== 1 && formData.flap_type !== 4) {
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

        return [commonFields];
    };

    const viewContent = {
        customer: (
            <div>
                <strong className="block mb-1">Cliente</strong>
                <p className="dark:text-gray-300">
                    {currentCustomer?.company_name || 'N/A'}
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
                    {`${currentReference?.width} x ${currentReference?.length} ${measureUnitChoices[currentReference?.measure_unit as keyof typeof measureUnitChoices]
                        }`}
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
    };

    useEffect(() => {
        if (materials.find(m => m.id === formData.material)?.name === 'Maíz') {
            setFormData(prev => ({
                ...prev,
                film_color: 'SIN COLOR'
            }));
        }
    }, [formData.material]);

    return (
        <div className="container">
            {currentCustomer && (
                <div className="mb-2 pl-2">
                    <p className="text-gray-600 dark:text-gray-400">
                        NIT: {currentCustomer.nit}
                    </p>
                </div>
            )}

            <TopTableElements
                onAdd={() => setFormModalOpen(true)}
                onSearch={(term) => setSearchTerm(term)}
                onFilter={() => { }}
                filterOptions={[]}
                showBackButton={true}
                onBack={() => router.push('/pot/customers')}
            />

            {references.length === 0 ? (
                <div className="flex justify-center items-center h-full pt-20">
                    <p className="text-gray-600 dark:text-gray-400">No hay referencias para este cliente</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Table>
                        <TableHeader>
                            <TableHead>Referencia</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableHeader>
                        <TableBody>
                            {references
                                .filter(ref =>
                                    ref.reference.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((reference) => (
                                    <TableRow key={reference.id}>
                                        <TableCell className={reference.is_active ? '' : 'opacity-40'}>
                                            {reference.reference}
                                        </TableCell>
                                        <TableCell className={reference.is_active ? '' : 'bg-white/30 dark:bg-gray-800/30'}>
                                            <Switch
                                                checked={reference.is_active}
                                                onCheckedChange={() => handleSwitchChange(reference.id, reference.is_active)}
                                                size='sm'
                                            />
                                        </TableCell>
                                        <TableCell className={reference.is_active ? '' : 'bg-white/30 dark:bg-gray-800/30'}>
                                            <button
                                                className="text-sky-500 hover:text-sky-700 mr-3 transition-colors"
                                                onClick={() => handleView(reference)}
                                            >
                                                <LuView size={20} />
                                            </button>
                                            <button
                                                className={`${reference.is_active ? 'text-orange-500 hover:text-orange-700' : 'text-gray-400 opacity-40'
                                                    } mr-3 transition-colors`}
                                                onClick={() => handleEdit(reference)}
                                                disabled={!reference.is_active}
                                            >
                                                <LuClipboardEdit size={20} />
                                            </button>
                                            <button
                                                className={`${reference.is_active ? 'text-red-500 hover:text-red-700' : 'text-gray-400 opacity-40'
                                                    } transition-colors`}
                                                onClick={() => handleDelete(reference.id)}
                                                disabled={!reference.is_active}
                                            >
                                                <LuTrash2 size={20} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </motion.div>
            )}

            {isFormModalOpen && (
                <FormModal
                    title={currentReference ? `Editar Referencia de ${currentCustomer?.company_name}` : `Agregar Referencia para ${currentCustomer?.company_name}`}
                    layout={getFormLayout()}
                    inputs={inputs}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    submitLabel={currentReference ? 'Actualizar' : 'Crear'}
                    width='max-w-[70%]'
                />
            )}

            {isViewModalOpen && currentReference && (
                <ViewModal
                    title="Detalles de la Referencia"
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
            )}
        </div>
    );
}