'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, TextArea, ImageInput } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'

interface Product {
  id: number
  name: string
  description: string
  image_url: string
  is_active: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '', is_active: true })
  const [searchTerm, setSearchTerm] = useState('')
  const [formErrors, setFormErrors] = useState({ name: '' })
  const [touchedFields, setTouchedFields] = useState({ name: false })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/products/')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      showToast('Error fetching products', 'error')
    }
  }

  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'El nombre es obligatorio'
    }
    if (products.some(product => product.name.trim().toLowerCase() === name.trim().toLowerCase() && product.id !== currentProduct?.id)) {
      return 'Ya existe un producto con este nombre'
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'ml_default')
      formData.append('folder', 'products')

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/db5lqptwu/image/upload`,
          formData
        )
        setFormData(prev => ({ ...prev, image_url: response.data.secure_url }))
      } catch (error) {
        console.error('Error uploading image:', error)
        showToast('Error al subir la imagen', 'error')
      }
    }
  }

  const handleImageDelete = () => {
    setFormData(prev => ({ ...prev, image_url: '' }))
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

      if (currentProduct) {
        response = await axios.put(`http://127.0.0.1:8000/beiplas/business/products/${currentProduct.id}/`, formData)
        message = 'Producto actualizado correctamente';
      } else {
        response = await axios.post('http://127.0.0.1:8000/beiplas/business/products/', formData)
        message = 'Producto creado correctamente';
      }

      if (response.data.status === 'success') {
        showToast(message, 'success')
        fetchProducts()
        setFormModalOpen(false)
        setCurrentProduct(null)
        setFormData({ name: '', description: '', image_url: '', is_active: true })
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

  const handleEdit = (product: Product) => {
    setCurrentProduct(product)
    setFormData({ name: product.name, description: product.description, image_url: product.image_url, is_active: product.is_active })
    setFormModalOpen(true)
  }

  const handleDelete = async (product: Product) => {
    showAlert(
      {
        title: `¿Estás seguro de eliminar el producto "${product.name}"?`,
        text: 'No podrás revertir esta acción',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/products/${product.id}/`)
          if (response.status === 204) {
            showToast('Producto eliminado correctamente', 'success')
            fetchProducts()
          } else {
            showToast(response.data.message, 'error')
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error al eliminar el producto', 'error')
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
        text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} este producto?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const newStatus = !currentStatus;
          const product = products.find(p => p.id === id);
          if (!product) {
            showToast('Product not found', 'error')
            return;
          }

          const updatedData = {
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            is_active: newStatus
          };

          const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/products/${id}/`, updatedData);
          if (response.data.status === 'success') {
            showToast(response.data.message, 'success')
            setProducts(products.map(p =>
              p.id === id ? { ...p, is_active: newStatus } : p
            ));
          } else {
            showToast(response.data.message, 'error')
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error updating product status', 'error')
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
          placeholder='Nombre del producto'
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
          placeholder='Descripción del producto'
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
    ),
    image: (
      <div>
        <ImageInput
          label="Imagen"
          name="image"
          value={formData.image_url}
          accept="image/*"
          onChange={handleImageUpload}
          onDelete={handleImageDelete}
        />
      </div>
    ),
  }

  const handleCancel = () => {
    setCurrentProduct(null)
    setFormData({ name: '', description: '', image_url: '', is_active: true })
    setFormErrors({ name: '' })
    setTouchedFields({ name: false })
    setFormModalOpen(false)
    showToast('Acción cancelada', 'info')
  }

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const filterOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      // Reset to original order
      fetchProducts();
    } else {
      const sortedProducts = [...products].sort((a, b) => {
        if (a[field as keyof Product] < b[field as keyof Product]) return order === 'asc' ? -1 : 1;
        if (a[field as keyof Product] > b[field as keyof Product]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      setProducts(sortedProducts);
    }
  };

  return (
    <div className="container">
      <TopTableElements
        onAdd={() => setFormModalOpen(true)}
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={filterOptions}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            title={product.name}
            description={product.description}
            imageUrl={product.image_url}
            onEdit={() => handleEdit(product)}
            onDelete={() => handleDelete(product)}
            showSwitch={true}
            switchState={product.is_active}
            onSwitchChange={() => handleSwitchChange(product.id, product.is_active)}
          />
        ))}
      </motion.div>

      {isFormModalOpen && (
        <FormModal
          title={currentProduct ? 'Editar Producto' : 'Agregar Producto'}
          layout={[['name'], ['description'], ['image']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentProduct ? 'Actualizar' : 'Crear'}
        />
      )}
    </div>
  )
}
