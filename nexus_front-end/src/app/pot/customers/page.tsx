'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { LuView, LuClipboardEdit, LuTrash2, LuClipboardList } from 'react-icons/lu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { TextInput, NumberInput } from '@/components/ui/StyledInputs';
import FormModal from '@/components/modals/FormModal';
import ViewModal from '@/components/modals/ViewModal';
import TopTableElements from '@/components/ui/TopTableElements';
import { showAlert, showToast } from '@/components/ui/Alerts';
import { useRouter } from 'next/navigation';

interface Customer {
  id: number;
  nit: number;
  company_name: string;
  contact: string;
  contact_email: string;
  contact_phone_number: string;
  location: string;
  is_active: boolean;
}

interface FormErrors {
  nit: string;
  company_name: string;
  contact_email: string;
  contact_phone_number: string;
  location: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    nit: '',
    company_name: '',
    contact: '',
    contact_email: '',
    contact_phone_number: '',
    location: '',
    is_active: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nit: '',
    company_name: '',
    contact_email: '',
    contact_phone_number: '',
    location: ''
  });
  const [touchedFields, setTouchedFields] = useState({
    nit: false,
    company_name: false,
    contact_email: false,
    contact_phone_number: false,
    location: false
  });
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showToast('Error fetching customers', 'error');
    }
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'nit':
        if (!value) return 'El NIT es obligatorio';
        if (!/^\d{8,10}(-\d)?$/.test(value)) return 'El NIT debe tener entre 8 y 10 dígitos, o 10 dígitos seguidos de un guion y un número';
        if (customers.some(c => c.nit.toString() === value && c.id !== currentCustomer?.id)) return 'Este NIT ya está en uso';
        return '';
      case 'company_name':
        return !value.trim() ? 'El nombre de la empresa es obligatorio' :
          value.trim().length < 3 ? 'El nombre debe tener al menos 3 letras' : '';
      case 'contact_email':
        return value && !/\S+@\S+\.\S+/.test(value) ? 'Formato de email inválido' :
          customers.some(c => c.contact_email === value && c.id !== currentCustomer?.id) ? 'Este email ya está en uso' : '';
      case 'contact_phone_number':
        return value && !/^\d{7,15}$/.test(value) ? 'El número de teléfono debe tener entre 7 y 15 dígitos' : '';
      case 'location':
        return !value.trim() ? 'La ubicación es obligatoria' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === 'nit') {
      sanitizedValue = value.replace(/\s/g, '');
    } else {
      sanitizedValue = value.trimStart().replace(/\s{2,}/g, ' ');
    }

    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));

    if (touchedFields[name as keyof typeof touchedFields]) {
      setFormErrors(prev => ({ ...prev, [name]: validateField(name, sanitizedValue) }));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    setFormErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {
      nit: validateField('nit', formData.nit),
      company_name: validateField('company_name', formData.company_name),
      contact_email: validateField('contact_email', formData.contact_email),
      contact_phone_number: validateField('contact_phone_number', formData.contact_phone_number),
      location: validateField('location', formData.location)
    };
    setFormErrors(newErrors);
    setTouchedFields({
      nit: true,
      company_name: true,
      contact_email: true,
      contact_phone_number: true,
      location: true
    });

    if (Object.values(newErrors).some(error => error !== '')) {
      showToast('Por favor, corrija los errores antes de enviar', 'error');
      return;
    }

    try {
      let response;
      let message = '';

      if (currentCustomer) {
        response = await axios.put(`http://127.0.0.1:8000/beiplas/business/customers/${currentCustomer.id}/`, formData);
        message = 'Cliente actualizado correctamente';
      } else {
        response = await axios.post('http://127.0.0.1:8000/beiplas/business/customers/', formData);
        message = 'Cliente creado correctamente';
      }

      if (response.data.status === 'success') {
        showToast(message, 'success');
        fetchCustomers();
        setFormModalOpen(false);
        setCurrentCustomer(null);
        setFormData({
          nit: '',
          company_name: '',
          contact: '',
          contact_email: '',
          contact_phone_number: '',
          location: '',
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

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({
      nit: customer.nit.toString(),
      company_name: customer.company_name,
      contact: customer.contact || '',
      contact_email: customer.contact_email || '',
      contact_phone_number: customer.contact_phone_number || '',
      location: customer.location,
      is_active: customer.is_active
    });
    setFormModalOpen(true);
  };

  const handleView = (customer: Customer) => {
    setCurrentCustomer(customer);
    setViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    showAlert(
      {
        title: '¿Estás seguro de eliminar este cliente?',
        text: 'No podrás revertir esta acción',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/beiplas/business/customers/${id}/`);
          if (response.status === 204) {
            showToast('Cliente eliminado correctamente', 'success');
            fetchCustomers();
          } else {
            showToast(response.data.message, 'error');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error al eliminar el cliente', 'error');
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
        text: `¿Quieres ${currentStatus ? 'desactivar' : 'activar'} este cliente?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: currentStatus ? 'Desactivar' : 'Activar',
        cancelButtonText: 'Cancelar'
      },
      async () => {
        try {
          const newStatus = !currentStatus;
          const customer = customers.find(c => c.id === id);
          if (!customer) {
            showToast('Customer not found', 'error');
            return;
          }

          const updatedData = {
            ...customer,
            is_active: newStatus
          };

          const response = await axios.patch(`http://127.0.0.1:8000/beiplas/business/customers/${id}/`, updatedData);
          if (response.data.status === 'success') {
            showToast(response.data.message, 'success');
            setCustomers(customers.map(c =>
              c.id === id ? { ...c, is_active: newStatus } : c
            ));
          } else {
            showToast(response.data.message, 'error');
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            showToast(error.response.data.message || 'Error updating customer status', 'error');
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
    setCurrentCustomer(null);
    setFormData({
      nit: '',
      company_name: '',
      contact: '',
      contact_email: '',
      contact_phone_number: '',
      location: '',
      is_active: true
    });
    setFormErrors({
      nit: '',
      company_name: '',
      contact_email: '',
      contact_phone_number: '',
      location: ''
    });
    setTouchedFields({ nit: false, company_name: false, contact_email: false, contact_phone_number: false, location: false });
    setFormModalOpen(false);
    showToast('Acción cancelada', 'info');
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nit.toString().includes(searchTerm) ||
      customer.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const filterOptions = [
    { key: 'company_name', label: 'Nombre de la Empresa' },
    { key: 'nit', label: 'NIT' },
    { key: 'location', label: 'Ubicación' },
    { key: 'is_active', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  const handleFilter = (field: string | null, order: 'asc' | 'desc') => {
    if (field === null) {
      fetchCustomers();
    } else {
      const sortedCustomers = [...customers].sort((a, b) => {
        if (a[field as keyof Customer] < b[field as keyof Customer]) return order === 'asc' ? -1 : 1;
        if (a[field as keyof Customer] > b[field as keyof Customer]) return order === 'asc' ? 1 : -1;
        return 0;
      });
      setCustomers(sortedCustomers);
    }
  };

  const inputs = {
    nit: (
      <div>
        <NumberInput
          label="NIT"
          name="nit"
          value={parseInt(formData.nit)}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
        />
        {touchedFields.nit && formErrors.nit && (
          <p className="text-red-500 ml-1">{formErrors.nit}</p>
        )}
      </div>
    ),
    company_name: (
      <div>
        <TextInput
          label="Nombre de la Empresa"
          name="company_name"
          value={formData.company_name}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
        />
        {touchedFields.company_name && formErrors.company_name && (
          <p className="text-red-500 ml-1">{formErrors.company_name}</p>
        )}
      </div>
    ),
    contact: (
      <TextInput
        label="Contacto"
        name="contact"
        value={formData.contact}
        onChange={handleInputChange}
      />
    ),
    contact_email: (
      <div>
        <TextInput
          label="Email de Contacto"
          name="contact_email"
          value={formData.contact_email}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {touchedFields.contact_email && formErrors.contact_email && (
          <p className="text-red-500 ml-1">{formErrors.contact_email}</p>
        )}
      </div>
    ),
    contact_phone_number: (
      <div>
        <TextInput
          label="Teléfono de Contacto"
          name="contact_phone_number"
          value={formData.contact_phone_number}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {touchedFields.contact_phone_number && formErrors.contact_phone_number && (
          <p className="text-red-500 ml-1">{formErrors.contact_phone_number}</p>
        )}
      </div>
    ),
    location: (
      <div>
        <TextInput
          label="Ubicación"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required={true}
        />
        {touchedFields.location && formErrors.location && (
          <p className="text-red-500 ml-1">{formErrors.location}</p>
        )}
      </div>
    )
  };

  const viewContent = {
    nit: <div><strong className="block mb-1">NIT</strong> <p className="dark:text-gray-300">{currentCustomer?.nit}</p></div>,
    company_name: <div><strong className="block mb-1">Nombre de la Empresa</strong> <p className="dark:text-gray-300">{currentCustomer?.company_name}</p></div>,
    contact: <div><strong className="block mb-1">Contacto</strong> <p className="dark:text-gray-300">{currentCustomer?.contact || 'N/A'}</p></div>,
    contact_email: <div><strong className="block mb-1">Email de Contacto</strong> <p className="dark:text-gray-300">{currentCustomer?.contact_email || 'N/A'}</p></div>,
    contact_phone_number: <div><strong className="block mb-1">Teléfono de Contacto</strong> <p className="dark:text-gray-300">{currentCustomer?.contact_phone_number || 'N/A'}</p></div>,
    location: <div><strong className="block mb-1">Ubicación</strong> <p className="dark:text-gray-300">{currentCustomer?.location}</p></div>,
    is_active: <div><strong className="block mb-1">Estado</strong> <p className={`inline-block py-1 px-2 rounded-lg font-semibold w-36 text-center ${currentCustomer?.is_active ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>{currentCustomer?.is_active ? 'Activo' : 'Inactivo'}</p></div>
  };

  const handleViewReferences = (customerId: number) => {
    router.push(`/pot/customers/references/${customerId}`);
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
      >
        {customers.length === 0 ? (
          <div className="flex justify-center items-center h-full pt-20">
            <p className="text-gray-600 dark:text-gray-400">No hay clientes disponibles</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>NIT</TableHead>
              <TableHead>Razón Social</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Email de Contacto</TableHead>
              <TableHead>Referencias</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className={customer.is_active ? '' : 'opacity-40'}>{customer.nit}</TableCell>
                  <TableCell className={customer.is_active ? '' : 'opacity-40'}>{customer.company_name}</TableCell>
                  <TableCell className={customer.is_active ? '' : 'opacity-40'}>{customer.contact || 'N/A'}</TableCell>
                  <TableCell className={customer.is_active ? '' : 'opacity-40'}>{customer.contact_email || 'N/A'}</TableCell>
                  <TableCell className={customer.is_active ? '' : 'opacity-40'}>
                    <button
                      className={`${customer.is_active
                          ? 'text-blue-500 hover:text-blue-700'
                          : 'text-gray-400'
                        } flex items-center gap-2 transition-colors`}
                      onClick={() => handleViewReferences(customer.id)}
                      disabled={!customer.is_active}
                    >
                      <LuClipboardList size={20} />
                      <span>Referencias</span>
                    </button>
                  </TableCell>
                  <TableCell className={customer.is_active ? '' : 'bg-white/30 dark:bg-gray-800/30'}>
                    <Switch
                      checked={customer.is_active}
                      onCheckedChange={() => handleSwitchChange(customer.id, customer.is_active)}
                      size='sm'
                    />
                  </TableCell>
                  <TableCell className={customer.is_active ? '' : 'bg-white/30 dark:bg-gray-800/30'}>
                    <button
                      className={`text-cyan-500 hover:text-cyan-700 mr-3 transition-colors`}
                      onClick={() => handleView(customer)}
                    >
                      <LuView size={20} />
                    </button>
                    <button
                      className={`${customer.is_active ? 'text-orange-500 hover:text-orange-700' : 'text-gray-400 opacity-40'} mr-3 transition-colors`}
                      onClick={() => handleEdit(customer)}
                      disabled={!customer.is_active}
                    >
                      <LuClipboardEdit size={20} />
                    </button>
                    <button
                      className={`${customer.is_active ? 'text-red-500 hover:text-red-700' : 'text-gray-400 opacity-40'} transition-colors`}
                      onClick={() => handleDelete(customer.id)}
                      disabled={!customer.is_active}
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
          title={currentCustomer ? 'Editar Cliente' : 'Agregar Cliente'}
          layout={[['nit', 'company_name'], ['contact', 'contact_email'], ['contact_phone_number', 'location']]}
          inputs={inputs}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          submitLabel={currentCustomer ? 'Actualizar' : 'Crear'}
        />
      )}

      {isViewModalOpen && currentCustomer && (
        <ViewModal
          title="Detalles del Cliente"
          layout={[['nit', 'company_name'], ['contact', 'contact_email'], ['contact_phone_number', 'location'], ['is_active']]}
          content={viewContent}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
}