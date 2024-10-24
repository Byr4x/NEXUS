'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LuPlus, LuX } from 'react-icons/lu'
import axios from 'axios'
import { Card } from '@/components/ui/Card'
import FormModal from '@/components/modals/FormModal'
import ViewModal from '@/components/modals/ViewModal'
import { TextInput, SelectInput } from '@/components/ui/StyledInputs'

interface Position {
  id: number
  name: string
  description: string
  is_active: boolean
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [isFormModalOpen, setFormModalOpen] = useState(false)
  const [isViewModalOpen, setViewModalOpen] = useState(false)
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
    } 
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentPosition) {
        await axios.put(`http://127.0.0.1:8000/beiplas/business/positions/${currentPosition.id}/`, formData)
      } else {
        await axios.post('http://127.0.0.1:8000/beiplas/business/positions/', formData)
      }
      fetchPositions()
      setFormModalOpen(false)
      setCurrentPosition(null)
      setFormData({ name: '', description: '', is_active: true })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting position:', error.message)
      } else {
        console.error('Unexpected error:', error)
      }
    }
  }

  const handleEdit = (position: Position) => {
    setCurrentPosition(position)
    setFormData({ name: position.name, description: position.description, is_active: position.is_active })
    setFormModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta posición?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/beiplas/business/positions/${id}/`)
        fetchPositions()
      } catch (error) {
        console.error('Error deleting position:', error)
      }
    }
  }
  
  const handleView = (position: Position) => {
    setCurrentPosition(position)
    setViewModalOpen(true)
  }

  const handleSwitchChange = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const position = positions.find(p => p.id === id);
      if (!position) {
        console.error('Position not found');
        return;
      }
      
      const updatedData = {
        name: position.name,
        description: position.description,
        is_active: newStatus
      };
      
      await axios.patch(`http://127.0.0.1:8000/beiplas/business/positions/${id}/`, updatedData);
      setPositions(positions.map(p => 
        p.id === id ? { ...p, is_active: newStatus } : p
      ));
    } catch (error) {
      console.error('Error updating position status:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  }
  
  const inputs = {
    name: <TextInput label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />,
    description: <TextInput label="Description" name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />,
  }

  const content = {
    name: <p>Name: {currentPosition?.name}</p>,
    description: <p>Description: {currentPosition?.description}</p>,
    is_active: <p>Status: {currentPosition?.is_active ? 'Active' : 'Inactive'}</p>,
  } // <-- Cierra el objeto content correctamente

  return (
    <div className="container">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sky-500 text-white px-4 py-2 rounded-lg mb-2 flex items-center hover:bg-sky-600"
        onClick={() => setFormModalOpen(true)}
      >
        <LuPlus className="mr-2" /> Agregar Cargo
      </motion.button>

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
            onDelete={() => handleDelete(position.id)}
            showSwitch={true}
            switchState={position.is_active}
            onSwitchChange={() => handleSwitchChange(position.id, position.is_active)}
            onView={() => handleView(position)} // Pass onView prop
          />
        ))}
      </motion.div>

      {isFormModalOpen && (
        <FormModal
          title={currentPosition ? 'Editar Cargo' : 'Agregar Cargo'}
          layout={[['name'], ['description']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          submitLabel={currentPosition ? 'Actualizar' : 'Crear'}
        />
      )}

      {isViewModalOpen && (
        <ViewModal
          title="Detalles del Cargo"
          layout={[['name'], ['description'], ['is_active']]}
          content={content}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  )
}
