'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Employee } from '@/components/interfaces'
import { LuView, LuClipboardEdit, LuTrash2 } from 'react-icons/lu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { TextInput, NumberInput, SelectInput } from '@/components/ui/StyledInputs';
import FormModal from '@/components/modals/FormModal';
import ViewModal from '@/components/modals/ViewModal';
import TopTableElements from '@/components/ui/TopTableElements';
import { showAlert, showToast } from '@/components/ui/Alerts';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface Position {
  id: number;
  name: string;
}

interface FormErrors {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  position: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    entity: '',
    position: 0,
    is_active: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    position: ''
  });
  const [touchedFields, setTouchedFields] = useState({
    first_name: false,
    last_name: false,
    phone_number: false,
    email: false,
    position: false
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
      showToast('Error fetching employees', 'error');
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/positions/');
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      showToast('Error fetching positions', 'error');
    }
  };

  const validateField = (name: string, value: string | number) => {
    switch (name) {
      case 'first_name':
        return !value.toString().trim() ? 'El nombre es obligatorio' : '';
      case 'last_name':
        return !value.toString().trim() ? 'Los apellidos son obligatorios' :
          value.toString().trim().split(/\s+/).length < 2 ? 'Debe contener al menos dos palabras' : '';
      case 'phone_number':
        if (!value) return 'El número de teléfono es obligatorio';
        if (!/^\d+$/.test(value.toString())) return 'Solo se permiten números';
        if (value.toString().length < 7 || value.toString().length > 15) return 'El número debe tener entre 7 y 15 dígitos';
        return '';
      case 'email':
        return value && !/\S+@\S+\.\S+/.test(value.toString()) ? 'Formato de email inválido' : '';
      case 'position':
        return value === 0 ? 'El cargo es obligatorio' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value.trimStart().replace(/\s{2,}/g, ' ');
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (touchedFields[name as keyof typeof touchedFields]) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, sanitizedValue) }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    const truncatedValue = numericValue.slice(0, 15);
    setFormData(prev => ({ ...prev, [name]: truncatedValue }));
    if (touchedFields.phone_number) {
      setFormErrors(prev => ({ ...prev, phone_number: validateField('phone_number', truncatedValue) }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSelectChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : 0;
    setFormData({ ...formData, position: value });
    if (touchedFields.position) {
      setFormErrors(prev => ({ ...prev, position: validateField('position', value) }));
    }
    setTouchedFields(prev => ({ ...prev, position: true }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {
      first_name: validateField('first_name', formData.first_name),
      last_name: validateField('last_name', formData.last_name),
      phone_number: validateField('phone_number', formData.phone_number),
      email: validateField('email', formData.email),
      position: validateField('position', formData.position)
    };
    setFormErrors(newErrors);
    setTouchedFields({
      first_name: true,
      last_name: true,
      phone_number: true,
      email: true,
      position: true
    });

    if (Object.values(newErrors).some(error => error !== '')) {
      showToast('Por favor, corrija los errores antes de enviar', 'error');
      return;
    }

    try {
      let response;
      let message = '';

      const dataToSubmit = {
        ...formData,
        entity: formData.entity.trim() || 'Beiplas'
      };

      if (currentEmployee) {
        response = await axios.put(`http://127.0.0.1:8000/beiplas/business/employees/${currentEmployee.id}/`, dataToSubmit);
        message = 'Empleado actualizado correctamente';
      } else {
        response = await axios.post('http://127.0.0.1:8000/beiplas/business/employees/', dataToSubmit);
        message = 'Empleado creado correctamente';
      }

      if (response.data.status === 'success') {
        showToast(message, 'success');
        fetchEmployees();
        setFormModalOpen(false);
        setCurrentEmployee(null);
        setFormData({
          first_name: '',
          last_name: '',
          phone_number: '',
          email: '',
          entity: '',
          position: 0,
          is_active: true
        });
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
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone_number: employee.phone_number,
      email: employee.email,
      entity: employee.entity,
      position: employee.position,
      is_active: employee.is_active
    });
    setFormModalOpen(true);
  };

  const handleView = (employee: Employee) => {
    setCurrentEmployee(employee);
    setViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    showAlert(
      {
        title: '¿Estás seguro de eliminar este empleado?',
        text: 'No podrás revertir esta acción',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/employees/${id}/`);
          if (response.status === 204) {
            showToast('Empleado eliminado correctamente', 'success');
            fetchEmployees();
          } else {
            showToast(response.data.message, 'error');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error al eliminar el empleado', 'error');
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
        text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} este empleado?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const newStatus = !currentStatus;
          const employee = employees.find(e => e.id === id);
          if (!employee) {
            showToast('Employee not found', 'error');
            return;
          }

          const updatedData = {
            ...employee,
            is_active: newStatus
          };

          const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/employees/${id}/`, updatedData);
          if (response.data.status === 'success') {
            showToast(response.data.message, 'success');
            setEmployees(employees.map(e =>
              e.id === id ? { ...e, is_active: newStatus } : e
            ));
          } else {
            showToast(response.data.message, 'error');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error updating employee status', 'error');
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
    setCurrentEmployee(null);
    setFormData({
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      entity: '',
      position: 0,
      is_active: true
    });
    setFormErrors({
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      position: ''
    });
    setTouchedFields({ first_name: false, last_name: false, phone_number: false, email: false, position: false });
    setFormModalOpen(false);
    showToast('Acción cancelada', 'info');
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee =>
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.entity.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const filterOptions = [
    { key: 'first_name', label: 'Nombres' },
    { key: 'last_name', label: 'Apellidos' },
    { key: 'email', label: 'Email' },
    { key: 'entity', label: 'Entidad' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      fetchEmployees();
    } else {
      const sortedEmployees = [...employees].sort((a, b) => {
        if (a[field as keyof Employee] < b[field as keyof Employee]) return order === 'asc' ? -1 : 1;
        if (a[field as keyof Employee] > b[field as keyof Employee]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      setEmployees(sortedEmployees);
    }
  };

  const positionsOptions = positions.map(pos => ({ value: pos.id, label: pos.name }));

  const inputs = {
    first_name: (
      <div>
        <TextInput
          label="Nombres"
          name="first_name"
          placeholder='Ej. Juan Camilo'
          value={formData.first_name}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
        />
        {touchedFields.first_name && formErrors.first_name && (
          <p  className="text-red-500 ml-1">{formErrors.first_name}</p>
        )}
      </div>
    ),
    last_name: (
      <div>
        <TextInput
          label="Apellidos"
          name="last_name"
          placeholder='Ej. Pérez Gómez'
          value={formData.last_name}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
        />
        {touchedFields.last_name && formErrors.last_name && (
          <p className="text-red-500 ml-1">{formErrors.last_name}</p>
        )}
      </div>
    ),
    phone_number: (
      <div>
        <TextInput
          label="Teléfono"
          name="phone_number"
          value={formData.phone_number}
          onChange={handlePhoneChange}
          onBlur={handleInputBlur}
          placeholder="Ej. 3001234567"
          required={true}
        />
        {touchedFields.phone_number && formErrors.phone_number && (
          <p className="text-red-500 ml-1">{formErrors.phone_number}</p>
        )}
      </div>
    ),
    email: (
      <div>
        <TextInput
          label="Email"
          name="email"
          value={formData.email}
          placeholder='example@domain.com'
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {touchedFields.email && formErrors.email && (
          <p className="text-red-500 ml-1">{formErrors.email}</p>
        )}
      </div>
    ),
    entity: (
      <TextInput
        label="Entidad"
        name="entity"
        placeholder='Beiplas'
        value={formData.entity}
        onChange={handleInputChange}
      />
    ),
    position: (
      <div>
        <SelectInput
          label="Cargo"
          name="position"
          value={{ label: positionsOptions.find(option => option.value === formData.position)?.label, value: formData.position }}
          onChange={handleSelectChange}
          options={positionsOptions}
          required={true}
        />
        {touchedFields.position && formErrors.position && (
          <p className="text-red-500 ml-1">{formErrors.position}</p>
        )}
      </div>
    )
  };

  const viewContent = {
    first_name: <div><strong className="block mb-1">Primer Nombre</strong> <p className="dark:text-gray-300">{currentEmployee?.first_name}</p></div>,
    last_name: <div><strong className="block mb-1">Segundo Nombre</strong> <p className="dark:text-gray-300">{currentEmployee?.last_name}</p></div>,
    phone_number: <div><strong className="block mb-1">Número de Teléfono</strong> <p className="dark:text-gray-300">{currentEmployee?.phone_number}</p></div>,
    email: <div><strong className="block mb-1">Email</strong> <p className="dark:text-gray-300">{currentEmployee?.email || 'N/A'}</p></div>,
    entity: <div><strong className="block mb-1">Entidad</strong> <p className="dark:text-gray-300">{currentEmployee?.entity}</p></div>,
    position: <div><strong className="block mb-1">Cargo</strong> <p className="dark:text-gray-300">{positions.find(p => p.id === currentEmployee?.position)?.name || 'N/A'}</p></div>,
    is_active: <div><strong className="block mb-1">Estado</strong> <p className={`inline-block py-1 px-2 rounded-lg font-semibold w-36 text-center ${currentEmployee?.is_active ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{currentEmployee?.is_active ? 'Activo' : 'Inactivo'}</p></div>
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredEmployees.length === 0 ? (
          <div className="flex justify-center items-center h-full pt-20">
            <p className="text-gray-600 dark:text-gray-400">No hay empleados disponibles</p>
          </div>
        ) : (
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
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className={employee.is_active ? '' : 'opacity-40'}>{employee.first_name} {employee.last_name}</TableCell>
                  <TableCell className={employee.is_active ? '' : 'opacity-40'}>
                    {employee.phone_number ? employee.phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3') : 'N/A'}
                  </TableCell>
                  <TableCell className={employee.is_active ? '' : 'opacity-40'}>{employee.email || 'N/A'}</TableCell>
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
                  <TableCell className={employee.is_active ? '' : 'bg-white/30 dark:bg-gray-800/30'}>
                    <button
                      className={`text-sky-500 hover:text-sky-700 mr-3 transition-colors`}
                      onClick={() => handleView(employee)}
                    >
                      <LuView size={20} />
                    </button>
                    <button
                      className={`${employee.is_active ? 'text-orange-500 hover:text-orange-700' : 'text-gray-400 opacity-40'} mr-3 transition-colors`}
                      onClick={() => handleEdit(employee)}
                      disabled={!employee.is_active}
                    >
                      <LuClipboardEdit size={20} />
                    </button>
                    <button
                      className={`${employee.is_active ? 'text-red-500 hover:text-red-700' : 'text-gray-400 opacity-40'} transition-colors`}
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
        )}
      </motion.div>

      {isFormModalOpen && (
        <FormModal
          title={currentEmployee ? 'Editar Empleado' : 'Agregar Empleado'}
          layout={[['first_name', 'last_name'], ['phone_number', 'email'], ['entity', 'position']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentEmployee ? 'Actualizar' : 'Crear'}
        />
      )}

      {isViewModalOpen && currentEmployee && (
        <ViewModal
          title="Detalles del Empleado"
          layout={[['first_name', 'last_name'], ['phone_number', 'email'], ['entity', 'position'], ['is_active']]}
          content={viewContent}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
}