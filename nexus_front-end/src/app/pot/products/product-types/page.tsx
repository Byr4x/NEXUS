'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, TextArea } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'

interface ProductType {
  id: number
  name: string
  description: string
  is_active: boolean
}

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [currentProductType, setCurrentProductType] = useState<ProductType | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true })
  const [searchTerm, setSearchTerm] = useState('')
  const [formErrors, setFormErrors] = useState({ name: '' })
  const [touchedFields, setTouchedFields] = useState({ name: false })

  useEffect(() => {
    fetchProductTypes()
  }, [])

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/productTypes/')
      setProductTypes(response.data)
    } catch (error) {
      console.error('Error fetching product types:', error)
      showToast('Error fetching product types', 'error')
    }
  }

  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'El nombre es obligatorio'
    }
    if (productTypes.some(productType => productType.name.trim().toLowerCase() === name.trim().toLowerCase() && productType.id !== currentProductType?.id)) {
      return 'Ya existe un tipo de producto con este nombre'
    }
    return ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    let sanitizedValue = value.trimStart().replace(/\s{2,}/g, ' ')

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }))

    if (name === 'name' && touchedFields.name) {
      setFormErrors(prev => ({ ...prev, name: validateName(sanitizedValue) }))
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target
    setTouchedFields(prev => ({ ...prev, [name]: true }))
    if (name === 'name') {
      setFormErrors(prev => ({ ...prev, name: validateName(formData.name) }))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nameError = validateName(formData.name)
    setFormErrors({ name: nameError })
    setTouchedFields({ name: true })

    if (nameError) {
      showToast('Por favor, corrija los errores antes de enviar', 'error')
      return
    }
    try {
      let response;
      let message = '';

      if (currentProductType) {
        response = await axios.put(`http://127.0.0.1:8000/beiplas/business/productTypes/${currentProductType.id}/`, formData)
        message = 'Tipo de producto actualizado correctamente';
      } else {
        response = await axios.post('http://127.0.0.1:8000/beiplas/business/productTypes/', formData)
        message = 'Tipo de producto creado correctamente';
      }

      if (response.data.status === 'success') {
        showToast(message, 'success')
        fetchProductTypes()
        setFormModalOpen(false)
        setCurrentProductType(null)
        setFormData({ name: '', description: '', is_active: true })
      } else {
        showToast(response.data.message, 'error')
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showToast(error.response.data.message || 'An error occurred', 'error')
      } else {
        showToast('An unexpected error occurred', 'error')
      }
    }
  }

  const handleEdit = (productType: ProductType) => {
    setCurrentProductType(productType)
    setFormData({ name: productType.name, description: productType.description, is_active: productType.is_active })
    setFormModalOpen(true)
  }

  const handleDelete = async (productType: ProductType) => {
    showAlert(
      {
        title: `¿Estás seguro de eliminar el tipo de producto "${productType.name}"?`,
        text: 'No podrás revertir esta acción',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/productTypes/${productType.id}/`)
          if (response.status === 204) {
            showToast('Tipo de producto eliminado correctamente', 'success')
            fetchProductTypes()
          } else {
            showToast(response.data.message, 'error')
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error al eliminar el tipo de producto', 'error')
          } else {
            showToast('An unexpected error occurred', 'error')
          }
        }
      },
      () => {
        showToast('Eliminación cancelada', 'info')
      }
    )
  }

  const handleSwitchChange = async (id: number, currentStatus: boolean) => {
    showAlert(
      {
        title: 'Confirmar cambio de estado',
        text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} este tipo de producto?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const newStatus = !currentStatus;
          const productType = productTypes.find(p => p.id === id);
          if (!productType) {
            showToast('Product type not found', 'error')
            return;
          }

          const updatedData = {
            name: productType.name,
            description: productType.description,
            is_active: newStatus
          };

          const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/productTypes/${id}/`, updatedData);
          if (response.data.status === 'success') {
            showToast(response.data.message, 'success')
            setProductTypes(productTypes.map(p =>
              p.id === id ? { ...p, is_active: newStatus } : p
            ));
          } else {
            showToast(response.data.message, 'error')
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error updating product type status', 'error')
          } else {
            showToast('An unexpected error occurred', 'error')
          }
        }
      },
      () => {
        showToast('Cambio de estado cancelado', 'info')
      }
    )
  }

  const inputs = {
    name: (
      <div>
        <TextInput
          label="Nombre"
          name="name"
          placeholder='Ej. Bolsa'
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
          placeholder='Opcional: Descripción del tipo de producto'
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
    ),
  }

  const handleCancel = () => {
    setCurrentProductType(null)
    setFormData({ name: '', description: '', is_active: true })
    setFormErrors({ name: '' })
    setTouchedFields({ name: false })
    setFormModalOpen(false)
    showToast('Acción cancelada', 'info')
  }

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredProductTypes = useMemo(() => {
    return productTypes.filter(productType =>
      productType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productType.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productTypes, searchTerm]);

  const filterOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      fetchProductTypes();
    } else {
      const sortedProductTypes = [...productTypes].sort((a, b) => {
        if (a[field as keyof ProductType] < b[field as keyof ProductType]) return order === 'asc' ? -1 : 1;
        if (a[field as keyof ProductType] > b[field as keyof ProductType]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      setProductTypes(sortedProductTypes);
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

      {filteredProductTypes.length === 0 ? (
        <div className="flex justify-center items-center h-full pt-20">
          <p className="text-gray-600 dark:text-gray-400">No hay tipos de productos disponibles</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredProductTypes.map((productType) => (
            <Card
              key={productType.id}
              title={productType.name}
              description={productType.description}
              onEdit={() => handleEdit(productType)}
              onDelete={() => handleDelete(productType)}
              showSwitch={true}
              switchState={productType.is_active}
              onSwitchChange={() => handleSwitchChange(productType.id, productType.is_active)}
            />
          ))}
        </motion.div>
      )}

      {isFormModalOpen && (
        <FormModal
          title={currentProductType ? 'Editar Tipo de Producto' : 'Agregar Tipo de Producto'}
          layout={[['name'], ['description']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentProductType ? 'Actualizar' : 'Crear'}
        />
      )}
    </div>
  )
}