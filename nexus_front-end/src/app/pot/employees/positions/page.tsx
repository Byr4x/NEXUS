'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import { TextInput, TextArea } from '@/components/ui/StyledInputs'
import { showAlert, showToast } from '@/components/ui/Alerts'
import TopTableElements from '@/components/ui/TopTableElements'

interface Position {
  id: number
  name: string
  description: string
  is_active: boolean
  employees: any[]
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true })
  const [searchTerm, setSearchTerm] = useState('')
  const [formErrors, setFormErrors] = useState({ name: '' })
  const [touchedFields, setTouchedFields] = useState({ name: false })

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/positions/')
      setPositions(response.data)
    } catch (error) {
      console.error('Error fetching positions:', error)
      showToast('Error fetching positions', 'error')
    }
  }

  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'El nombre es obligatorio'
    }
    if (positions.some(position => position.name.trim().toLowerCase() === name.trim().toLowerCase() && position.id !== currentPosition?.id)) {
      return 'Ya existe un cargo con este nombre'
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

      if (currentPosition) {
        response = await axios.put(`http://127.0.0.1:8000/beiplas/business/positions/${currentPosition.id}/`, formData)
        message = 'Posición actualizada correctamente';
      } else {
        response = await axios.post('http://127.0.0.1:8000/beiplas/business/positions/', formData)
        message = 'Posición creada correctamente';
      }

      if (response.data.status === 'success') {
        showToast(message, 'success')
        fetchPositions()
        setFormModalOpen(false)
        setCurrentPosition(null)
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

  const handleEdit = (position: Position) => {
    setCurrentPosition(position)
    setFormData({ name: position.name, description: position.description, is_active: position.is_active })
    setFormModalOpen(true)
  }

  const handleDelete = async (position: Position) => {
    showAlert(
      {
        title: `¿Estás seguro de eliminar la posición "${position.name}"?`,
        text: 'No podrás revertir esta acción',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        if (position.employees.length > 0) {
          showToast('No se puede eliminar la posición porque tiene empleados asignados', 'error');
          return;
        }

        try {
          const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/positions/${position.id}/`)
          console.log(response)
          if (response.status === 204) {
            showToast('Posición eliminada correctamente', 'success')
            fetchPositions()
          } else {
            showToast(response.data.message, 'error')
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error al eliminar la posición', 'error')
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
        text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} esta posición?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const newStatus = !currentStatus;
          const position = positions.find(p => p.id === id);
          if (!position) {
            showToast('Position not found', 'error')
            return;
          }

          const updatedData = {
            name: position.name,
            description: position.description,
            is_active: newStatus
          };

          const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/positions/${id}/`, updatedData);
          if (response.data.status === 'success') {
            showToast(response.data.message, 'success')
            setPositions(positions.map(p =>
              p.id === id ? { ...p, is_active: newStatus } : p
            ));
          } else {
            showToast(response.data.message, 'error')
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error updating position status', 'error')
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
          placeholder='Cargo del empleado'
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
          placeholder='Descripción del cargo'
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
    ),
  }

  const handleCancel = () => {
    setCurrentPosition(null)
    setFormData({ name: '', description: '', is_active: true })
    setFormErrors({ name: '' })
    setTouchedFields({ name: false })
    setFormModalOpen(false)
    showToast('Acción cancelada', 'info')
  }

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredPositions = useMemo(() => {
    return positions.filter(position =>
      position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [positions, searchTerm]);

  const filterOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      fetchPositions();
    } else {
      const sortedPositions = [...positions].sort((a, b) => {
        if (a[field as keyof Position] < b[field as keyof Position]) return order === 'asc' ? -1 : 1;
        if (a[field as keyof Position] > b[field as keyof Position]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      setPositions(sortedPositions);
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredPositions.length === 0 ? (
          <div className="flex justify-center items-center h-full pt-20">
            <p className="text-gray-600 dark:text-gray-400">No hay cargos disponibles</p>
          </div>
        ) : (
          filteredPositions.map((position) => (
            <Card
              key={position.id}
              title={position.name}
              description={position.description}
              onEdit={() => handleEdit(position)}
              onDelete={() => handleDelete(position)}
              showSwitch={true}
              switchState={position.is_active}
              onSwitchChange={() => handleSwitchChange(position.id, position.is_active)}
            />
          ))
        )}
      </motion.div>

      {isFormModalOpen && (
        <FormModal
          title={currentPosition ? 'Editar Cargo' : 'Agregar Cargo'}
          layout={[['name'], ['description']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentPosition ? 'Actualizar' : 'Crear'}
        />
      )}
    </div>
  )
}