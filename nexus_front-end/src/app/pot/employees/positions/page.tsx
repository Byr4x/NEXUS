'use client'

import React, { useState, useEffect } from 'react'
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        if(position.employees.length > 0) {
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
      }
    )
  }

  const inputs = {
    name: <TextInput label="Nombre" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />,
    description: <TextArea label="Descripcion" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />,
  }

  const handleCancel = () => {
    setCurrentPosition(null)
    setFormData({ name: '', description: '', is_active: true })
    setFormModalOpen(false)
  }

  const handleSearch = (searchTerm: string) => {
    // Implement search logic here
    console.log('Searching for:', searchTerm);
  };

  const filterOptions = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      // Reset to original order
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
        {positions.map((position) => (
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
        ))}
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
