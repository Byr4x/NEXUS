'use client'
import { useState, useEffect, Reference } from 'react'
import { Button, Badge, List, message, Modal, Form, Input } from 'antd'
import { Card } from '@/components/ui/Card'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Customer, Employee, PurchaseOrderForm, PODetailForm, WorkOrder, WOErrors, Extrusion, EXTRErrors, R_RawMaterial_Extrusion, MEQUANTITYErrors, Printing, PRTErrors, Sealing, SELErrors, Handicraft, HNDErrors } from '@/components/interfaces';
import { LuCalendarClock } from 'react-icons/lu'
import FormModal from '@/components/modals/FormModal'
import { TextInput, NumberInput, SelectInput, TextArea } from '@/components/ui/StyledInputs'
import axios from 'axios'

export default function ProductionPage() {
  const defaultPODetail: PODetailForm = {
    id: 0,
    purchase_order: 0,
    reference: 0,
    product_type: 0,
    material: 0,
    reference_internal: '',
    film_color: '',
    measure_unit: 0,
    width: 0,
    length: 0,
    gussets_type: 0,
    first_gusset: null,
    second_gusset: null,
    flap_type: 0,
    flap_size: null,
    tape: 0,
    die_cut_type: 0,
    sealing_type: 0,
    caliber: 0,
    roller_size: 0,
    additive: [],
    has_print: false,
    dynas_treaty_faces: 0,
    is_new_sketch: false,
    sketch_url: '',
    pantones_quantity: 0,
    pantones_codes: [],
    kilograms: 0,
    units: 0,
    kilogram_price: 0,
    unit_price: 0,
    production_observations: '',
    delivery_location: '',
    is_updated: false,
    wo_number: 0,
  };

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

  const [POs, setPOs] = useState<PurchaseOrderForm[]>([]);
  const [poDetails, setPoDetails] = useState<PODetailForm[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]); 
  const [extrusions, setExtrusions] = useState<Extrusion[]>([]);
  const [meQuantity, setMEQuantity] = useState<R_RawMaterial_Extrusion[]>([]);
  const [printings, setPrintings] = useState<Printing[]>([]);
  const [sealings, setSealings] = useState<Sealing[]>([]);
  const [handicrafts, setHandicrafts] = useState<Handicraft[]>([]);
  const [formDataPOD, setFormDataPOD] = useState<PODetailForm>(defaultPODetail);
  const [formDataWO, setFormDataWO] = useState<WorkOrder>(defaultWorkOrder);
  const [formDataEXTR, setFormDataEXTR] = useState<Extrusion>(defaultExtrusion);
  const [formDataMEQUANTITY, setFormDataMEQUANTITY] = useState<R_RawMaterial_Extrusion>(defaultR_RawMaterial_Extrusion);
  const [formDataPRT, setFormDataPRT] = useState<Printing>(defaultPrinting);
  const [formDataSEL, setFormDataSEL] = useState<Sealing>(defaultSealing);
  const [formDataHND, setFormDataHND] = useState<Handicraft>(defaultHandicraft);
  const [woErrors, setWOErrors] = useState<WOErrors>({});
  const [extrErrors, setEXTRErrors] = useState<EXTRErrors>({});
  const [meQuantityErrors, setMeQuantityErrors] = useState<MEQUANTITYErrors>({});
  const [prtErrors, setPRTErrors] = useState<PRTErrors>({});
  const [selErrors, setSELErrors] = useState<SELErrors>({});
  const [hndErrors, setHNDErrors] = useState<HNDErrors>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PODetailForm | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(0);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    fetchPOs()
    fetchPODetails()
    fetchWorkOrders()
    fetchEmployees()
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

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/employees/')
      setEmployees(response.data)
    } catch (error) {
      message.error('Error al cargar los empleados')
    }
  }

  const fetchPOs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/purchaseOrders/')
      setPOs(response.data)
    } catch (error) {
      message.error('Error al cargar las OC')
    }
  }

  const fetchPODetails = async () => {
    try {
      const response = await axios.get<PODetailForm[]>('http://127.0.0.1:8000/beiplas/business/poDetails/')
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
  const openModal = (detail: PODetailForm) => {
    setFormDataPOD(detail); // Set initial data
    setSelectedDetail(detail);
    setTotalSteps(2); // Total steps based on your next choices
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

  const PODInfo: React.FC<{ data: PODetailForm }> = ({data}) => (
    <div className="bg-gray-200 dark:bg-gray-700 shadow-md rounded-lg p-4">
      <h5 className="text-2xl text-gray-900 dark:text-white"><strong>{customers.find(c => c.id === (POs.find(po => po.id === data.purchase_order)?.customer))?.company_name}</strong></h5>
      <h5 className="text-xl text-gray-900 dark:text-white"><strong>Orden de compra:</strong> {POs.find(po => po.id === data.purchase_order)?.order_number || 'Unknown'}</h5>
      <h5 className="text-md border-b border-black dark:border-white pb-2 mb-1 text-gray-900 dark:text-white"><strong>Asesor:</strong> {employees.find(e => e.id === (POs.find(po => po.id === data.purchase_order)?.employee))?.first_name} {employees.find(e => e.id === (POs.find(po => po.id === data.purchase_order)?.employee))?.last_name}</h5>
      <h5 className="text-md mb-4 text-gray-900 dark:text-white"><strong>Información del pedido</strong></h5>
      <p className="text-gray-700 dark:text-white"><strong>O.T. {data.wo_number}</strong></p>
      <p className="text-gray-700 dark:text-white"><strong>Referencia:</strong> {data.reference_internal}</p>
      <p className="text-gray-700 dark:text-white"><strong>Color de película:</strong> {data.film_color}</p>
      <p className="text-gray-700 dark:text-white"><strong>Color de película:</strong> {data.film_color}</p>
    </div>
  );

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
              actionButton={<button className='text-white transition-colors w-full bg-green-500 rounded-md p-2 flex items-center justify-center gap-2 hover:bg-green-600 font-mono text-lg' onClick={() => openModal(detail)}> <LuCalendarClock size={22} />Programar</button>}
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
                <NumberInput
                  label="Número de OT"
                  name="id"
                  value={formDataPOD.wo_number || 0}
                  onChange={handleInputChange}
                  required
                />
                <NumberInput
                  label="Número de OT"
                  name="id"
                  value={formDataWO.id}
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
                  value={formDataEXTR.rolls_quantity}
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
                  value={formDataPRT.observations}
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
                  value={formDataSEL.hits}
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
                  value={formDataHND.observations}
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
          additionalInfo={<PODInfo data={formDataPOD} />}
          width='max-w-[75%]'
        />
      )}
    </div>
  )
}