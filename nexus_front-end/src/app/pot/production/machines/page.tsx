'use client'

import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, SelectInput } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'
import { Machine } from '@/components/interfaces'

const areaChoices = {
    0: 'N/A',
    1: 'Extrusión',
    2: 'Impresión',
    3: 'Sellado',
    4: 'Manualidad'
};

export default function MachinesPage() {
    const [machines, setMachines] = useState<Machine[]>([])
    const [isFormModalOpen, setFormModalOpen] = useState(false)
    const [currentMachine, setCurrentMachine] = useState<Machine | null>(null)
    const [formData, setFormData] = useState({ name: '', area: 0, is_active: true })
    const [searchTerm, setSearchTerm] = useState('')
    const [formErrors, setFormErrors] = useState({ name: '', area: '' })

    useEffect(() => {
        fetchMachines()
    }, [])

    const fetchMachines = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/beiplas/production/machines/')
            setMachines(response.data)
        } catch (error) {
            console.error('Error fetching machines:', error)
            showToast('Error fetching machines', 'error')
        }
    }

    const validateName = (name: string) => {
        if (!name.trim()) {
            return 'El nombre es obligatorio'
        }
        if (machines.some(machine => machine.name.trim().toLowerCase() === name.trim().toLowerCase() && machine.id !== currentMachine?.id)) {
            return 'Ya existe una máquina con este nombre'
        }
        return ''
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'name') {
            setFormErrors(prev => ({ ...prev, name: validateName(value) }));
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const nameError = validateName(formData.name);
        setFormErrors({ name: nameError, area: '' });

        if (nameError) {
            showToast('Por favor, corrija los errores antes de enviar', 'error');
            return;
        }

        try {
            let response;
            let message = '';

            if (currentMachine) {
                response = await axios.put(`http://127.0.0.1:8000/beiplas/production/machines/${currentMachine.id}/`, formData);
                message = 'Máquina actualizada correctamente';
            } else {
                response = await axios.post('http://127.0.0.1:8000/beiplas/production/machines/', formData);
                message = 'Máquina creada correctamente';
            }

            if (response.data.status === 'success') {
                showToast(message, 'success');
                fetchMachines();
                setFormModalOpen(false);
                setCurrentMachine(null);
                setFormData({ name: '', area: 0, is_active: true });
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

    const handleEdit = (machine: Machine) => {
        setCurrentMachine(machine);
        setFormData({ name: machine.name, area: machine.area, is_active: machine.is_active });
        setFormModalOpen(true);
    };

    const handleDelete = async (machine: Machine) => {
        showAlert(
            {
                title: `¿Estás seguro de eliminar la máquina "${machine.name}"?`,
                text: 'No podrás revertir esta acción',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const response = await axios.delete(`http://127.0.0.1:8000/beiplas/production/machines/${machine.id}/`);
                    if (response.status === 200) {
                        showToast('Máquina eliminada correctamente', 'success');
                        fetchMachines();
                    } else {
                        showToast(response.data.message, 'error');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error al eliminar la máquina', 'error');
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
                text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} esta máquina?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
                cancelButtonText: 'Cancelar'
            },
            async () => {
                try {
                    const newStatus = !currentStatus;
                    const machine = machines.find(m => m.id === id);
                    if (!machine) {
                        showToast('Máquina no encontrada', 'error');
                        return;
                    }

                    const updatedData = {
                        ...machine,
                        is_active: newStatus
                    };

                    const response = await axios.patch(`http://127.0.0.1:8000/beiplas/production/machines/${id}/`, updatedData);
                    if (response.data.status === 'success') {
                        showToast(response.data.message, 'success');
                        setMachines(machines.map(m =>
                            m.id === id ? { ...m, is_active: newStatus } : m
                        ));
                    } else {
                        showToast(response.data.message, 'error');
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        showToast(error.response.data.message || 'Error al actualizar el estado de la máquina', 'error');
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
        setCurrentMachine(null);
        setFormData({ name: '', area: 0, is_active: true });
        setFormErrors({ name: '', area: '' });
        setFormModalOpen(false);
        showToast('Acción cancelada', 'info');
    };

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    const filteredMachines = useMemo(() => {
        return machines.filter(machine =>
            machine.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [machines, searchTerm]);

    const filterOptions = [
        { key: 'name', label: 'Nombre' },
        { key: 'area', label: 'Área' },
        { key: 'is_active', label: 'Estado' },
    ];

    const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
        if (field === null) {
            fetchMachines();
        } else {
            const sortedMachines = [...machines].sort((a, b) => {
                if (a[field as keyof Machine] < b[field as keyof Machine]) return order === 'asc' ? -1 : 1;
                if (a[field as keyof Machine] > b[field as keyof Machine]) return order === 'asc' ? 1 : -1;
                return 0;
            });
            setMachines(sortedMachines);
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
        area: (
            <SelectInput
                label="Área"
                name="area"
                value={{ value: formData.area, label: areaChoices[formData.area as keyof typeof areaChoices] }}
                onChange={(option) => handleInputChange({ target: { name: 'area', value: option?.value || 0 } } as any)}
                options={Object.entries(areaChoices).map(([key, value]) => ({
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

            {filteredMachines.length === 0 ? (
                <div className="flex justify-center items-center h-full pt-20">
                    <p className="text-gray-600 dark:text-gray-400">No hay máquinas disponibles</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {filteredMachines.map((machine) => (
                        <Card
                            key={machine.id}
                            title={machine.name}
                            description={`Área: ${areaChoices[machine.area as keyof typeof areaChoices]}`}
                            onEdit={() => handleEdit(machine)}
                            onDelete={() => handleDelete(machine)}
                            showSwitch={true}
                            switchState={machine.is_active}
                            onSwitchChange={() => handleSwitchChange(machine.id, machine.is_active)}
                            bgColor={machine.area === 0 ? undefined : machine.area === 1 ? 'bg-orange-200/90 dark:bg-orange-700/60' : machine.area === 2 ? 'bg-green-200/90 dark:bg-green-700/60' : machine.area === 3 ? 'bg-blue-200/90 dark:bg-blue-700/60' : machine.area === 4 ? 'bg-yellow-200/90 dark:bg-yellow-700/60' : ''}
                        />
                    ))}
                </motion.div>
            )}

            {isFormModalOpen && (
                <FormModal
                    title={currentMachine ? 'Editar Máquina' : 'Agregar Máquina'}
                    layout={[['name'], ['area']]}
                    inputs={inputs}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    submitLabel={currentMachine ? 'Actualizar' : 'Crear'}
                />
            )}
        </div>
    );
}