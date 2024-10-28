'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, TextArea, ImageInput, SelectInput } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'

interface Product {
  id: number
  name: string
  description: string
  product_type: number
  material: number
  image_url: string
  is_active: boolean
}

interface ProductType {
  id: number
  name: string
}

interface Material {
  id: number
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    product_type: null as number | null, 
    material: null as number | null, 
    image_url: '', 
    is_active: true 
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [formErrors, setFormErrors] = useState({ name: '', product_type: '', material: '' })
  const [touchedFields, setTouchedFields] = useState({ name: false, product_type: false, material: false })

  useEffect(() => {
    fetchProducts()
    fetchProductTypes()
    fetchMaterials()
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

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/productTypes/')
      setProductTypes(response.data)
    } catch (error) {
      console.error('Error fetching product types:', error)
      showToast('Error fetching product types', 'error')
    }
  }

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
    if (products.some(product => product.name.trim().toLowerCase() === name.trim().toLowerCase() && product.id !== currentProduct?.id)) {
      return 'Ya existe un producto con este nombre'
    }
    return ''
  }

  const validateProductType = (productType: number | null) => {
    if (productType === null) {
      return 'El tipo de producto es obligatorio'
    }
    return ''
  }

  const validateMaterial = (material: number | null) => {
    if (material === null) {
      return 'El material es obligatorio'
    }
    return ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target
    
    let sanitizedValue = typeof value === 'string' ? value.trimStart().replace(/\s{2,}/g, ' ') : value
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
    
    if (name === 'name' && touchedFields.name) {
      setFormErrors(prev => ({ ...prev, name: validateName(sanitizedValue) }))
    }
    if (name === 'product_type' && touchedFields.product_type) {
      setFormErrors(prev => ({ ...prev, product_type: validateProductType(sanitizedValue) }))
    }
    if (name === 'material' && touchedFields.material) {
      setFormErrors(prev => ({ ...prev, material: validateMaterial(sanitizedValue) }))
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string } }) => {
    const { name } = e.target
    setTouchedFields(prev => ({ ...prev, [name]: true }))
    if (name === 'name') {
      setFormErrors(prev => ({ ...prev, name: validateName(formData.name) }))
    }
    if (name === 'product_type') {
      setFormErrors(prev => ({ ...prev, product_type: validateProductType(formData.product_type) }))
    }
    if (name === 'material') {
      setFormErrors(prev => ({ ...prev, material: validateMaterial(formData.material) }))
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
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nameError = validateName(formData.name)
    const productTypeError = validateProductType(formData.product_type)
    const materialError = validateMaterial(formData.material)
    setFormErrors({ name: nameError, product_type: productTypeError, material: materialError })
    setTouchedFields({ name: true, product_type: true, material: true })

    if (nameError || productTypeError || materialError) {
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
        setFormData({ name: '', description: '', product_type: null, material: null, image_url: '', is_active: true })
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
    setFormData({ 
      name: product.name, 
      description: product.description, 
      product_type: product.product_type,
      material: product.material,
      image_url: product.image_url, 
      is_active: product.is_active 
    })
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
            product_type: product.product_type,
            material: product.material,
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
    product_type: (
      <div>
        <SelectInput
          label="Tipo de Producto"
          name="product_type"
          value={productTypes.find(pt => pt.id === formData.product_type)}
          onChange={(selectedOption) => handleInputChange({ target: { name: 'product_type', value: selectedOption ? selectedOption.value : null } })}
          options={productTypes.map(pt => ({ value: pt.id, label: pt.name }))}
          required={true}
        />
        {touchedFields.product_type && formErrors.product_type && (
          <p className="text-red-500 ml-1">{formErrors.product_type}</p>
        )}
      </div>
    ),
    material: (
      <div>
        <SelectInput
          label="Material"
          name="material"
          value={materials.find(m => m.id === formData.material)}
          onChange={(selectedOption) => handleInputChange({ target: { name: 'material', value: selectedOption ? selectedOption.value : null } })}
          options={materials.map(m => ({ value: m.id, label: m.name }))}
          required={true}
        />
        {touchedFields.material && formErrors.material && (
          <p className="text-red-500 ml-1">{formErrors.material}</p>
        )}
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
    setFormData({ name: '', description: '', product_type: null, material: null, image_url: '', is_active: true })
    setFormErrors({ name: '', product_type: '', material: '' })
    setTouchedFields({ name: false, product_type: false, material: false })
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
            description={`${product.description}\nTipo: ${productTypes.find(pt => pt.id === product.product_type)?.name}\nMaterial: ${materials.find(m => m.id === product.material)?.name}`}
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
          layout={[['name'], ['description'], ['product_type', 'material'], ['image']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentProduct ? 'Actualizar' : 'Crear'}
        />
      )}
    </div>
  )
}
