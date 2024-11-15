'use client'
import { useState, useEffect, Reference } from 'react'
import { Button, Badge, List, message, Modal, Form, Input } from 'antd'
import { Card } from '@/components/ui/Card'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Customer, PODetail, WorkOrder, WOErrors, Extrusion, EXTRErrors, R_RawMaterial_Extrusion, MEQUANTITYErrors, Printing, PRTErrors, Sealing, SELErrors, Handicraft, HNDErrors } from '@/components/interfaces';
import { LuCalendarClock } from 'react-icons/lu'
import FormModal from '@/components/modals/FormModal'
import { TextInput, NumberInput, SelectInput, TextArea } from '@/components/ui/StyledInputs'
import axios from 'axios'

export default function ProductionPage() {
  const defaultWorkOrder: WorkOrder = {
    id: 0,
    surplus_percentage: 0,
    unit_weight: 0,
    surplus_weight: 0,
    wo_weight: 0,
    status: 0,
    termination_reason: '',
    extrusion: undefined,
    printing: undefined,
    sealing: undefined,
    handicraft: undefined
  }

  const defaultExtrusion: Extrusion = {
    id: 0,
    work_order: 0,
    machine: 0,
    roll_type: 0,
    rolls_quantity: 0,
    width: 0,
    caliber: 0,
    observations: '',
    next: 0
  }

  const defaultR_RawMaterial_Extrusion: R_RawMaterial_Extrusion = {
    id: 0,
    raw_material: 0,
    extrusion: 0,
    quantity: 0
  }

  const defaultPrinting: Printing = {
    id: 0,
    work_order: 0,
    machine: 0,
    is_new: false,
    observations: '',
    next: 0
  }

  const defaultSealing: Sealing = {
    id: 0,
    work_order: 0,
    machine: 0,
    caliber: 0,
    hits: 0,
    package_units: 0,
    bundle_units: 0,
    observations: '',
    next: 0
  }

  const defaultHandicraft: Handicraft = {
    id: 0,
    work_order: 0,
    machine: 0,
    observations: '',
    next: 0
  }

  const [poDetails, setPoDetails] = useState<PODetail[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [extrusions, setExtrusions] = useState<Extrusion[]>([])
  const [meQuantity, setMEQuantity] = useState<R_RawMaterial_Extrusion[]>([])
  const [printings, setPrintings] = useState<Printing[]>([])
  const [sealings, setSealings] = useState<Sealing[]>([])
  const [handicrafts, setHandicrafts] = useState<Handicraft[]>([])
  const [formDataWO, setFormDataWO] = useState<WorkOrder>(defaultWorkOrder)
  const [formDataEXTR, setFormDataEXTR] = useState<Extrusion>(defaultExtrusion)
  const [formDataMEQUANTITY, setFormDataMEQUANTITY] = useState<R_RawMaterial_Extrusion>(defaultR_RawMaterial_Extrusion)
  const [formDataPRT, setFormDataPRT] = useState<Printing>(defaultPrinting)
  const [formDataSEL, setFormDataSEL] = useState<Sealing>(defaultSealing)
  const [formDataHND, setFormDataHND] = useState<Handicraft>(defaultHandicraft)
  const [woErrors, setWOErrors] = useState<WOErrors>({})
  const [extrErrors, setEXTRErrors] = useState<EXTRErrors>({})
  const [meQuantityErrors, setMeQuantityErrors] = useState<MEQUANTITYErrors>({})
  const [prtErrors, setPRTErrors] = useState<PRTErrors>({})
  const [selErrors, setSELErrors] = useState<SELErrors>({})
  const [hndErrors, setHNDErrors] = useState<HNDErrors>({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<PODetail | null>(null)
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(0);
  const [formData, setFormData] = useState<any>({}); // Adjust type as necessary
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    fetchPODetails()
    fetchWorkOrders()
    fetchCustomers()
    fetchExtrusions()
    fetchR_RawMaterialExtrusions()
    fetchPrintings()
    fetchSealings()
    fetchHandicrafts()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/customers/')
      setCustomers(response.data)
    } catch (error) {
      message.error('Error al cargar los clientes')
    }
  }

  const fetchPODetails = async () => {
    try {
      const response = await axios.get<PODetail[]>('http://127.0.0.1:8000/beiplas/business/poDetails/')
      setPoDetails(response.data.filter(detail => detail.was_annulled === false))
    } catch (error) {
      message.error('Error al cargar los detalles de OC')
    }
  }

  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/production/workOrders/')
      setWorkOrders(response.data)
    } catch (error) {
      message.error('Error al cargar las órdenes de trabajo')
    }
  }

  const fetchExtrusions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/production/extrusions/')
      setExtrusions(response.data)
    } catch (error) {
      message.error('Error al cargar las extrusiones')
    }
  }

  const fetchR_RawMaterialExtrusions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/production/meQuantity/')
      setMEQuantity(response.data)
    } catch (error) {
      message.error('Error al cargar las relaciones de materia prima con extrusión')
    }
  }

  const fetchSealings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/production/sealings/')
      setSealings(response.data)
    } catch (error) {
      message.error('Error al cargar los sellados')
    }
  }

  const fetchPrintings = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/production/printings/')
      setPrintings(response.data)
    } catch (error) {
      message.error('Error al cargar las impresiones')
    }
  }

  const fetchHandicrafts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/production/handicrafts/')
      setHandicrafts(response.data)
    } catch (error) {
      message.error('Error al cargar las obras a mano')
    }
  }

  const validateField = (name: string, value: any): string => {
    const validations: { [key: string]: () => string } = {
      'wo_surplus_percentage': () => {
        if (!value) return 'El porcentaje de excedente es requerido'
        if (value < 0 || value > 100) return 'El porcentaje de excedente debe estar entre 0 y 100';
        return '';
      },

      'extr_machine': () => {
        if (!value) return 'La maquina de extrusión es requerida'
        return '';
      },
      'extr_roll_type': () => {
        if (!value) return 'El tipo de rollo es requerido'
        return '';
      },
      'extr_rolls_quantity': () => {
        if (!value) return 'La cantidad de rollos es requerida'
        if (value <= 0) return 'La cantidad de rollos debe ser mayor a 0'
        return '';
      },
      'extr_caliber': () => {
        if (!value) return 'El calibre es requerido'
        if (value <= 0) return 'El calibre debe ser mayor a 0'
        return '';
      },
      'extr_next': () => {
        if (!value) return 'El destino es requerido'
        return '';
      },

      'meQuantity_raw_material': () => {
        if (!value) return 'La materia prima es requerida'
        return '';
      },
      'meQuantity_quantity': () => {
        if (!value) return 'La cantidad es requerida'
        if (value <= 0) return 'La cantidad debe ser mayor a 0'
        return '';
      },

      'prt_machine': () => {
        if (!value) return 'La máquina de impresión es requerida'
        return '';
      },
      'prt_next': () => {
        if (!value) return 'El destino es requerido'
        return '';
      },

      'sel_machine': () => {
        if (!value) return 'La maquina de sellado es requerida'
        return '';
      },
      'sel_caliber': () => {
        if (!value) return 'El calibre es requerido'
        if (value <= 0) return 'El calibre debe ser mayor a 0'
        return '';
      },
      'sel_hits': () => {
        if (!value) return 'El número de golpes es requerido'
        if (value <= 0) return 'El número de golpes debe ser mayor a 0'
        return '';
      },
      'sel_package_units': () => {
        if (!value) return 'El número de unidades por paquete es requerido'
        if (value <= 0) return 'El número de unidades por paquete debe ser mayor a 0'
        return '';
      },
      'sel_bundle_units': () => {
        if (!value) return 'El número de unidades por bulto es requerido'
        if (value <= 0) return 'El número de unidades por bulto debe ser mayor a 0'
        return '';
      },
      'sel_next': () => {
        if (!value) return 'El destino es requerido'
        return '';
      },


      'hnd_observations': () => {
        if (!value) return 'Las observaciones de la manualidad es requerida'
        return '';
      },
      'hnd_next': () => {
        if (!value) return 'El destino es requerido'
        return '';
      }
    }

    return validations[name] ? validations[name]() : '';
  }

  const handleInputChange = (
    e: { target: { name: string; value: string | Date | null } }
  ) => {
    const { name, value } = e.target;
    const underscoreIndex = name.indexOf('_');
    const formType = name.slice(0, underscoreIndex);
    const fieldName = name.slice(underscoreIndex + 1);

    // Validar el campo
    const error = validateField(name, value);

    switch (formType) {
      case 'wo':
        setFormDataWO(prev => {
          const newState = { ...prev, [fieldName]: value };
          return newState;
        })
        setWOErrors(prev => ({ ...prev, [fieldName]: error }));
        break;

      case 'extr':
        setFormDataEXTR(prev => {
          const newState = { ...prev, [fieldName]: value };
          return newState;
        })
        setEXTRErrors(prev => ({ ...prev, [fieldName]: error }));
        break;

      case 'meQuantity':
        setFormDataMEQUANTITY(prev => {
          const newState = { ...prev, [fieldName]: value };
          return newState;
        })
        setMeQuantityErrors(prev => ({ ...prev, [fieldName]: error }));
        break;

      case 'prt':
        setFormDataPRT(prev => {
          const newState = { ...prev, [fieldName]: value };
          return newState;
        })
        setPRTErrors(prev => ({ ...prev, [fieldName]: error }));
        break;

      case 'sel':
        setFormDataSEL(prev => {
          const newState = { ...prev, [fieldName]: value };
          return newState;
        })
        setSELErrors(prev => ({ ...prev, [fieldName]: error }));
        break;

      case 'hnd':
        setFormDataHND(prev => {
          const newState = { ...prev, [fieldName]: value };
          return newState;
        })
        setHNDErrors(prev => ({ ...prev, [fieldName]: error }));
        break;
    }
  };


  // Function to handle opening the modal
  const openModal = (workOrder: WorkOrder) => {
    setFormData(workOrder); // Set initial data
    setTotalSteps(5); // Total steps based on your next choices
    setCurrentStep(1);
    setFormModalOpen(true);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic based on current step
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Producción</h1>

      {/* Detalles de OC pendientes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Detalles de OC Pendientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {poDetails.map(detail => (
            <Card
              key={detail.id}
              title={'OT: ' + detail?.wo_number?.toString() || 'Cargando...'}
              description={`~ ${customers.find(customer => customer.purchase_orders?.find(po => po.id === detail.purchase_order))?.company_name} ~\n ${detail.reference_internal}`}
              floorDescription={`\nCantidad: ${detail.kilograms > 0 ? `${detail.kilograms} kg` : `${detail.units} uds`}`}
              actionButton={<button className='text-white transition-colors w-full bg-green-500 rounded-md p-2 flex items-center justify-center gap-2 hover:bg-green-600 font-mono text-lg' onClick={() => setSelectedDetail(detail)}> <LuCalendarClock size={22} />Programar</button>}
            />
          ))}
        </div>
      </div>

      {/* Lista de Órdenes de Trabajo */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Órdenes de Trabajo</h2>

      </div>

      {/* Modal for creating/updating production details */}
      {isFormModalOpen && (
        <FormModal
          title="Crear/Actualizar Producción"
          layout={[
            ['work_order_info'], // Step 1: Work Order Info
            ['extrusion_info'],   // Step 2: Extrusion Info
            ['printing_info'],    // Step 3: Printing Info
            ['sealing_info'],     // Step 4: Sealing Info
            ['handicraft_info'],  // Step 5: Handicraft Info
          ]}
          inputs={{
            work_order_info: (
              <div>
                <TextInput
                  label="Número de Orden"
                  name="wo_number"
                  value={formData.wo_number}
                  onChange={handleInputChange}
                  required
                />
                {/* Add other work order fields as necessary */}
              </div>
            ),
            extrusion_info: (
              <div>
                <NumberInput
                  label="Cantidad de Rollos"
                  name="rolls_quantity"
                  value={formData.rolls_quantity}
                  onChange={handleInputChange}
                  required
                />
                {/* Add other extrusion fields as necessary */}
              </div>
            ),
            printing_info: (
              <div>
                <TextInput
                  label="Observaciones de Impresión"
                  name="printing_observations"
                  value={formData.printing_observations}
                  onChange={handleInputChange}
                />
                {/* Add other printing fields as necessary */}
              </div>
            ),
            sealing_info: (
              <div>
                <NumberInput
                  label="Hits"
                  name="hits"
                  value={formData.hits}
                  onChange={handleInputChange}
                  required
                />
                {/* Add other sealing fields as necessary */}
              </div>
            ),
            handicraft_info: (
              <div>
                <TextArea
                  label="Observaciones de Manualidad"
                  name="handicraft_observations"
                  value={formData.handicraft_observations}
                  onChange={handleInputChange}
                />
                {/* Add other handicraft fields as necessary */}
              </div>
            ),
          }}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          submitLabel="Guardar"
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  )
}