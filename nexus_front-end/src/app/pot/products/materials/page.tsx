'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, TextArea, NumberInput } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'
import { Material } from '@/components/interfaces'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', weight_constant: 0, is_active: true })
  const [searchTerm, setSearchTerm] = useState('')
  const [formErrors, setFormErrors] = useState({ name: '', weight_constant: '' })
  const [touchedFields, setTouchedFields] = useState({ name: false, weight_constant: false })

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/materials/')
      setMaterials(response.data)
    } catch (error) {
      console.error('Error fetching materials:', error)
      showToast('Error fetching materials', 'error')
    }
  }

  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'El nombre es obligatorio'
    }
    if (materials.some(material => material.name.trim().toLowerCase() === name.trim().toLowerCase() && material.id !== currentMaterial?.id)) {
      return 'Ya existe un material con este nombre'
    }
    return ''
  }

  const validateWeightConstant = (weight_constant: string) => {
    const number = parseFloat(weight_constant);
    if (isNaN(number) || number <= 0) {
      return 'La constante de peso debe ser mayor que 0';
    }
    return '';
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value.trimStart().replace(/\s{2,}/g, ' ');

    if (name === 'weight_constant') {
      if (!/^\d*\.?\d*$/.test(sanitizedValue) && sanitizedValue !== '') {
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight_constant' ? sanitizedValue : sanitizedValue
    }));

    if (name === 'name' && touchedFields.name) {
      setFormErrors(prev => ({ ...prev, name: validateName(sanitizedValue) }));
    }
    if (name === 'weight_constant' && touchedFields.weight_constant) {
      setFormErrors(prev => ({ ...prev, weight_constant: validateWeightConstant(sanitizedValue) }));
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    if (name === 'name') {
      setFormErrors(prev => ({ ...prev, name: validateName(formData.name) }));
    }
    if (name === 'weight_constant') {
      setFormErrors(prev => ({ ...prev, weight_constant: validateWeightConstant(formData.weight_constant.toString()) }));
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameError = validateName(formData.name);
    const weightConstantError = validateWeightConstant(formData.weight_constant.toString());
    setFormErrors({ name: nameError, weight_constant: weightConstantError });
    setTouchedFields({ name: true, weight_constant: true });

    if (nameError || weightConstantError) {
      showToast('Por favor, corrija los errores antes de enviar', 'error');
      return;
    }
    try {
      let response;
      let message = '';

      if (currentMaterial) {
        response = await axios.put(`http://127.0.0.1:8000/beiplas/business/materials/${currentMaterial.id}/`, formData);
        message = 'Material actualizado correctamente';
      } else {
        response = await axios.post('http://127.0.0.1:8000/beiplas/business/materials/', formData);
        message = 'Material creado correctamente';
      }

      if (response.data.status === 'success') {
        showToast(message, 'success');
        fetchMaterials();
        setFormModalOpen(false);
        setCurrentMaterial(null);
        setFormData({ name: '', description: '', weight_constant: 0, is_active: true });
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

  const handleEdit = (material: Material) => {
    setCurrentMaterial(material);
    setFormData({ name: material.name, description: material.description, weight_constant: material.weight_constant, is_active: material.is_active });
    setFormModalOpen(true);
  };

  const handleDelete = async (material: Material) => {
    showAlert(
      {
        title: `¿Estás seguro de eliminar el material "${material.name}"?`,
        text: 'No podrás revertir esta acción',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/materials/${material.id}/`);
          if (response.status === 204) {
            showToast('Material eliminado correctamente', 'success');
            fetchMaterials();
          } else {
            showToast(response.data.message, 'error');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error al eliminar el material', 'error');
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
        text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} este material?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const newStatus = !currentStatus;
          const material = materials.find(m => m.id === id);
          if (!material) {
            showToast('Material not found', 'error');
            return;
          }

          const updatedData = {
            name: material.name,
            description: material.description,
            weight_constant: material.weight_constant,
            is_active: newStatus
          };

          const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/materials/${id}/`, updatedData);
          if (response.data.status === 'success') {
            showToast(response.data.message, 'success');
            setMaterials(materials.map(m =>
              m.id === id ? { ...m, is_active: newStatus } : m
            ));
          } else {
            showToast(response.data.message, 'error');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error updating material status', 'error');
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

  const inputs = {
    name: (
      <div>
        <TextInput
          label="Nombre"
          name="name"
          placeholder='Ej. Maíz'
          value={formData.name}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
        />
        {touchedFields.name && formErrors.name && (
          <p className="text-red-500 ml-1">{formErrors.name}</p>
        )}
      </div>
    ),
    description: (
      <div>
        <TextArea
          label="Descripción"
          name="description"
          placeholder='Opcional: Descripción del material'
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
    ),
    weight_constant: (
      <div>
        <TextInput
          label="Constante de peso"
          name="weight_constant"
          value={formData.weight_constant.toString()}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
          placeholder='Ej. 0.001'
        />
        {touchedFields.weight_constant && formErrors.weight_constant && (
          <p className="text-red-500 ml-1">{formErrors.weight_constant}</p>
        )}
      </div>
    ),
  }

  const handleCancel = () => {
    setCurrentMaterial(null);
    setFormData({ name: '', description: '', weight_constant: 0, is_active: true });
    setFormErrors({ name: '', weight_constant: '' });
    setTouchedFields({ name: false, weight_constant: false });
    setFormModalOpen(false);
    showToast('Acción cancelada', 'info');
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(material =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materials, searchTerm]);

  const filterOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'weight_constant', label: 'Constante de peso' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      fetchMaterials();
    } else {
      const sortedMaterials = [...materials].sort((a, b) => {
        if (a[field as keyof Material] < b[field as keyof Material]) return order === 'asc' ? -1 : 1;
        if (a[field as keyof Material] > b[field as keyof Material]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      setMaterials(sortedMaterials);
    }
  };

  return (
    <div className="container">
      <TopTableElements
        showAddButton
        onAdd={() => setFormModalOpen(true)}
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={filterOptions}
      />


      {filteredMaterials.length === 0 ? (
        <div className="flex justify-center items-center h-full pt-20">
          <p className="text-gray-600 dark:text-gray-400">No hay materiales disponibles</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredMaterials.map((material) => (
            <Card
              key={material.id}
              title={material.name}
              description={`${material.description}\nConstante de peso: ${material.weight_constant}`}
              onEdit={() => handleEdit(material)}
              onDelete={() => handleDelete(material)}
              showSwitch={true}
              switchState={material.is_active}
              onSwitchChange={() => handleSwitchChange(material.id, material.is_active)}
            />

          ))}
        </motion.div>
      )}


      {isFormModalOpen && (
        <FormModal
          title={currentMaterial ? 'Editar Material' : 'Agregar Material'}
          layout={[['name'], ['description'], ['weight_constant']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentMaterial ? 'Actualizar' : 'Crear'}
        />
      )}
    </div>
  );
}