'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuClipboardEdit, LuTrash2, LuX } from 'react-icons/lu';
import axios from 'axios';
import Select from 'react-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';

interface Employee {
  id: number;
  first_name: string;
  second_name: string;
  phone_number: string;
  email: string;
  entity: string;
  position: number;
  is_active: boolean;
}

interface Position {
  id: number;
  name: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    phone_number: '',
    email: '',
    entity: '',
    position: 0
  });

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/positions/');
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const options = positions.map(pos => ({ value: pos.id, label: pos.name }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData({ ...formData, position: selectedOption ? selectedOption.value : 0 });
    console.log(formData)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEmployee) {
        await axios.put(`http://127.0.0.1:8000/beiplas/business/employees/${currentEmployee.id}/`, formData);
      } else {
        await axios.post('http://127.0.0.1:8000/beiplas/business/employees/', formData);
      }
      fetchEmployees();
      setIsModalOpen(false);
      setCurrentEmployee(null);
      setFormData({
        first_name: '',
        second_name: '',
        phone_number: '',
        email: '',
        entity: '',
        position: 0
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting employee:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      second_name: employee.second_name,
      phone_number: employee.phone_number,
      email: employee.email,
      entity: employee.entity,
      position: employee.position
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/beiplas/business/employees/${id}/`);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleSwitchChange = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      const employee = employees.find(e => e.id === id);
      if (!employee) {
        console.error('Employee not found');
        return;
      }
      
      const updatedData = {
        ...employee,
        is_active: newStatus
      };
      
      await axios.patch(`http://127.0.0.1:8000/beiplas/business/employees/${id}/`, updatedData);
      setEmployees(employees.map(e => 
        e.id === id ? { ...e, is_active: newStatus } : e
      ));
    } catch (error) {
      console.error('Error updating employee status:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  return (
    <div className="container">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg mb-2 flex items-center transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <LuPlus className="mr-2" /> Agregar Empleado
      </motion.button>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Table>
          <TableHeader>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entidad</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (  
              <TableRow key={employee.id}>
                <TableCell className={employee.is_active ? '' : 'opacity-40'}>{employee.first_name} {employee.second_name}</TableCell>
                <TableCell className={employee.is_active ? '' : 'opacity-40'}>{employee.phone_number}</TableCell>
                <TableCell className={employee.is_active ? '' : 'opacity-40'}>{employee.email}</TableCell>
                <TableCell className={employee.is_active ? '' : 'opacity-40'}>{employee.entity}</TableCell>
                <TableCell className={employee.is_active ? '' : 'opacity-40'}>
                  {positions.find(p => p.id === employee.position)?.name || 'N/A'}
                </TableCell>
                <TableCell className={employee.is_active ? '' : 'bg-white/30 dark:bg-gray-800/30'}>
                  <Switch
                    checked={employee.is_active}
                    onCheckedChange={() => handleSwitchChange(employee.id, employee.is_active)}
                    size='sm'
                  />
                </TableCell>
                <TableCell className={employee.is_active ? '' : 'opacity-40'}>
                  <button
                    className={`${employee.is_active ? 'text-sky-500 hover:text-sky-600' : 'text-gray-400'} mr-3 transition-colors`}
                    onClick={() => handleEdit(employee)}
                    disabled={!employee.is_active}
                  >
                    <LuClipboardEdit size={20} />
                  </button>
                  <button
                    className={`${employee.is_active ? 'text-red-500 hover:text-red-600' : 'text-gray-400'} transition-colors`}
                    onClick={() => handleDelete(employee.id)}
                    disabled={!employee.is_active}
                  >
                    <LuTrash2 size={20} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <LuX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block mb-2">Primer Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="secondName" className="block mb-2">Segundo Nombre</label>
                <input
                  type="text"
                  id="secondName"
                  name="second_name"
                  value={formData.second_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block mb-2">Número de Teléfono</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="entity" className="block mb-2">Entidad</label>
                <input
                  type="text"
                  id="entity"
                  name="entity"
                  value={formData.entity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="position" className="block mb-2">Cargo</label>
                <Select
                  id="position"
                  name="position"
                  value={options.find(option => option.value === formData.position)}
                  onChange={handleSelectChange}
                  options={options}
                  className="dark:bg-gray-700 dark:border-gray-600"
                  isClearable
                />
              </div>
              <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg w-full transition-colors">
                {currentEmployee ? 'Actualizar' : 'Crear'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
