'use client'

import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, NumberInput, SelectInput } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'
import { RawMaterial } from '@/components/interfaces'

const rawMaterialTypeChoices = {
    0: 'Materia prima',
    1: 'Recuperado',
    2: 'Aditivos',
    3: 'Tintas y pigmentos'
};

export default function RawMaterialsPage() {
    const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
    const [isFormModalOpen, setFormModalOpen] = useState(false)
    const [currentRawMaterial, setCurrentRawMaterial] = useState<RawMaterial | null>(null)
    const [formData, setFormData] = useState({ name: '', quantity: 0, raw_material_type: 0, is_active: true })
    const [searchTerm, setSearchTerm] = useState('')
    const [formErrors, setFormErrors] = useState({ name: '', quantity: '', raw_material_type: '' })
    const [touchedFields, setTouchedFields] = useState({ name: false, quantity: false })

    useEffect(() => {
        fetchRawMaterials()
    }, [])

    const fetchRawMaterials = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/production/rawMaterials/')
            setRawMaterials(response.data)
        } catch (error) {
            console.error('Error fetching raw materials:', error)
            showToast('Error fetching raw materials', 'error')
        }
    }

    const validateName = (name: string) => {
        if (!name.trim()) {
            return 'El nombre es obligatorio'
        }
        if (rawMaterials.some(rawMaterial => rawMaterial.name.trim().toLowerCase() === name.trim().toLowerCase() && rawMaterial.id !== currentRawMaterial?.id)) {
            return 'Ya existe un material con este nombre'
        }
        return ''
    }

    const validateQuantity = (quantity: string) => {
        const number = parseFloat(quantity);
        if (isNaN(number) || number <= 0) {
            return 'La cantidad debe ser mayor que 0';
        }
        return '';
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'name') {
            setFormErrors(prev => ({ ...prev, name: validateName(value) }));
        }
        if (name === 'quantity') {
            setFormErrors(prev => ({ ...prev, quantity: validateQuantity(value) }));
        }
        if (name === 'raw_material_type') {
            setFormErrors(prev => ({ ...prev, raw_material_type: validateQuantity(value) }))
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const nameError = validateName(formData.name);
        const quantityError = validateQuantity(formData.quantity.toString());
        const raw_material_typeError = validateQuantity(formData.raw_material_type.toString());
        setFormErrors({ name: nameError, quantity: quantityError, raw_material_type: raw_material_typeError });

        if (nameError || quantityError) {
            showToast('Por favor, corrija los errores antes de enviar', 'error');
            return;
        }

        try {
            let response;
            let message = '';

            if (currentRawMaterial) {
                response = await axios.put(`http://127.0.0.1:8000/beiplas/production/rawMaterials/${currentRawMaterial.id}/`, formData);
                message = 'Materia prima actualizada correctamente';
            } else {
                response = await axios.post('http://127.0.0.1:8000/beiplas/production/rawMaterials/', formData);
                message = 'Materia prima creada correctamente';
            }

            if (response.data.status === 'success') {
                showToast(message, 'success');
                fetchRawMaterials();
                setFormModalOpen(false);
                setCurrentRawMaterial(null);
                setFormData({ name: '', quantity: 0, raw_material_type: 0, is_active: true });
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
    }

    const handleEdit = (rawMaterial: RawMaterial) => {
        setCurrentRawMaterial(rawMaterial);
        setFormData({ name: rawMaterial.name, quantity: rawMaterial.quantity, raw_material_type: rawMaterial.raw_material_type, is_active: rawMaterial.is_active });
        setFormModalOpen(true);
    };

    const handleDelete = async (rawMaterial: RawMaterial) => {
        showAlert(
            {
                title: `¿Estás seguro de eliminar la materia prima "${rawMaterial.name}"?`,
                text: 'No podrás revertir esta acción',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const response = await axios.delete(`http://127.0.0.1:8000/beiplas/production/rawMaterials/${rawMaterial.id}/`);
                    if (response.status === 200) {
                        showToast('Materia prima eliminada correctamente', 'success');
                        fetchRawMaterials();
                    } else {
                        showToast(response.data.message, 'error');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error al eliminar la materia prima', 'error');
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
                text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} esta materia prima?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const newStatus = !currentStatus;
                    const rawMaterial = rawMaterials.find(m => m.id === id);
                    if (!rawMaterial) {
                        showToast('Materia prima no encontrada', 'error');
                        return;
                    }

                    const updatedData = {
                        ...rawMaterial,
                        is_active: newStatus
                    };

                    const response = await axios.patch(`http://127.0.0.1:8000/beiplas/production/rawMaterials/${id}/`, updatedData);
                    if (response.data.status === 'success') {
                        showToast(response.data.message, 'success');
                        setRawMaterials(rawMaterials.map(m =>
                            m.id === id ? { ...m, is_active: newStatus } : m
                        ));
                    } else {
                        showToast(response.data.message, 'error');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error al actualizar el estado de la materia prima', 'error');
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
        setCurrentRawMaterial(null);
        setFormData({ name: '', quantity: 0, raw_material_type: 0, is_active: true });
        setFormErrors({ name: '', quantity: '', raw_material_type: '' });
        setTouchedFields({ name: false, quantity: false });
        setFormModalOpen(false);
        showToast('Acción cancelada', 'info');
    };

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const filteredRawMaterials = useMemo(() => {
        return rawMaterials.filter(rawMaterial =>
            rawMaterial.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [rawMaterials, searchTerm]);

    const filterOptions = [
        { key: 'name', label: 'Nombre' },
        { key: 'quantity', label: 'Cantidad' },
        { key: 'raw_material_type', label: 'Tipo de materia prima' },
        { key: 'is_active', label: 'Estado' },
    ];

    const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
        if (field === null) {
            fetchRawMaterials();
        } else {
            const sortedRawMaterials = [...rawMaterials].sort((a, b) => {
                if (a[field as keyof RawMaterial] < b[field as keyof RawMaterial]) return order === 'asc' ? -1 : 1;
                if (a[field as keyof RawMaterial] > b[field as keyof RawMaterial]) return order === 'asc' ? 1 : -1;
                return 0;
            });
            setRawMaterials(sortedRawMaterials);
        }
    };

    const inputs = {
        name: (
            <TextInput
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={true}
            />
        ),
        quantity: (
            <NumberInput
                label="Cantidad"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required={true}
            />
        ),
        raw_material_type: (
            <SelectInput
                label="Tipo de materia prima"
                name="raw_material_type"
                value={{ value: formData.raw_material_type, label: rawMaterialTypeChoices[formData.raw_material_type as keyof typeof rawMaterialTypeChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'raw_material_type', value: option?.value || 0 } } as any)}
                options={Object.entries(rawMaterialTypeChoices).map(([key, value]) => ({
                    value: Number(key),
                    label: value
                }))}
            />
        ),
    }

    return (
        <div className="container">
            <TopTableElements
                showAddButton
                onAdd={() => setFormModalOpen(true)}
                onSearch={handleSearch}
                onFilter={handleFilter}
                filterOptions={filterOptions}
            />

            {filteredRawMaterials.length === 0 ? (
                <div className="flex justify-center items-center h-full pt-20">
                    <p className="text-gray-600 dark:text-gray-400">No hay materias primas disponibles</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredRawMaterials.map((rawMaterial) => (
                        <Card
                            key={rawMaterial.id}
                            title={rawMaterial.name}
                            description={`Cantidad: ${rawMaterial.quantity}`}
                            onEdit={() => handleEdit(rawMaterial)}
                            onDelete={() => handleDelete(rawMaterial)}
                            showSwitch={true}
                            switchState={rawMaterial.is_active}
                            onSwitchChange={() => handleSwitchChange(rawMaterial.id, rawMaterial.is_active)}
                        />
                    ))}
                </motion.div>
            )}

            {isFormModalOpen && (
                <FormModal
                    title={currentRawMaterial ? 'Editar Materia Prima' : 'Agregar Materia Prima'}
                    layout={[['name'], ['quantity', 'raw_material_type']]}
                    inputs={inputs}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    submitLabel={currentRawMaterial ? 'Actualizar' : 'Crear'}
                />
            )}
        </div>
    );
}
