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

const measureUnitChoices = {
  0: 'CM',
  1: 'PULG'
};

const sealingTypeChoices = {
  0: 'Sin sellado',
  1: 'Lateral',
  2: 'Fondo',
  3: 'Manual',
  4: 'Precorte',
  5: 'En "V"'
};

const flapTypeChoices = {
  0: 'Sin solapa',
  1: 'Interna',
  2: 'Interna doble',
  3: 'Externa',
  4: 'Volada'
};

const gussetsTypeChoices = {
  0: 'Sin fuelles',
  1: 'Lateral',
  2: 'Fondo'
};

const tapeChoices = {
  0: 'Sin cinta',
  1: 'Resellable',
  2: 'De seguridad'
};

const dieCutTypeChoices = {
  0: 'Sin troquel',
  1: 'Riñon',
  2: 'Camiseta',
  3: 'Perforaciones',
  4: 'Banderin',
  5: 'Cordon',
  6: 'Cubrevestido',
  7: 'Media luna',
  8: 'Selle de refuerzo'
};

const dynasTreatyFacesChoices = {
  0: 'Ninguna',
  1: '1 cara',
  2: '2 caras'
};

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
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
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
  const [currentStepL, setCurrentStepL] = useState(1);
  const [totalSteps, setTotalSteps] = useState(0);
  const [cSteps, setCSteps] = useState<number[]>([]);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  useEffect(() => {
    fetchPOs()
    fetchPODetails()
    fetchProductTypes()
    fetchMaterials()
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

  const fetchProductTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/productTypes/');
      setProductTypes(response.data);
    } catch (error) {
      message.error('Error al cargar los productos');
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/materials/');
      setMaterials(response.data);
    } catch (error) {
      message.error('Error al cargar los materiales');
    }
  };

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

  const openModal = (detail: PODetailForm) => {
    const newSteps = [1];
    detail.pantones_quantity > 0 && newSteps.push(2);
    ['BOLSA'].includes(productTypes.find(pt => pt.id === detail.product_type)?.name.toUpperCase()) && newSteps.push(3);
    if (detail.die_cut_type !== 0 || detail.sealing_type === 3) {
      newSteps.push(4);
    }

    setCSteps(newSteps);
    setFormDataPOD(detail);
    setSelectedDetail(detail);
    setTotalSteps(newSteps.length);
    setCurrentStep(1);
    setFormModalOpen(true);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStepIndex = cSteps.indexOf(currentStep) + 1;
        setCurrentStepL(cSteps[nextStepIndex]); // Establecer el siguiente paso válido
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStepIndex = cSteps.indexOf(currentStep) - 1; // Obtener el índice del paso actual y retroceder uno
      if (prevStepIndex >= 0) {
        setCurrentStepL(cSteps[prevStepIndex]); // Establecer el paso anterior válido
      }
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic based on current step
  };

  const renderPODInfo = (data: PODetailForm) => {
    const customer = customers.find(c => c.id === (POs.find(po => po.id === data.purchase_order)?.customer))
    const po = POs.find(po => po.id === data.purchase_order)
    const employee = employees.find(e => e.id === po?.employee)
    const productType = productTypes.find(pt => pt.id === data.product_type)
    const material = materials.find(m => m.id === data.material)

    const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
      <div className='mb-6'>
        <h3 className='text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-2'>{title}</h3>
        <div className='grid gap-1'>{children}</div>
      </div>
    )

    const InfoItem = ({ label, secondaryLabel, thirdLabel, value, secondaryValue, thirdValue }: {
      label: string;
      secondaryLabel?: string;
      thirdLabel?: string;
      value: string | number | undefined;
      secondaryValue?: string | number | undefined
      thirdValue?: string | number | undefined;
    }) => (
      <div className={`bg-gray-200 dark:bg-gray-700 p-3 rounded-lg text-center ${secondaryLabel && secondaryValue && thirdLabel && thirdValue ? 'grid grid-cols-3' : secondaryLabel && secondaryValue ? 'grid grid-cols-2 ' : ''}`}>
        <span className='block text-sm font-medium text-gray-600 dark:text-gray-400'>{label}</span>
        {secondaryLabel && <span className='block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>{secondaryLabel}</span>}
        {secondaryLabel && thirdLabel && <span className='block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>{thirdLabel}</span>}
        <span className='text-base text-gray-900 dark:text-gray-100'>{value || 'N/A'}</span>
        {secondaryLabel && secondaryValue && <span className='text-base text-gray-900 dark:text-gray-100'>{secondaryValue}</span>}
        {secondaryLabel && secondaryValue && thirdLabel && thirdValue && <span className='text-base text-gray-900 dark:text-gray-100'>{thirdValue}</span>}
      </div>
    )

    return (
      <div className='bg-white dark:bg-gray-800 shadow-xl shadow-gray-400 dark:shadow-gray-950 rounded-lg'>
        <div className='bg-blue-600 text-white p-6 rounded-t-lg text-center'>
          <h2 className='text-2xl font-bold mb-2'>{customer?.company_name}</h2>
          <p className='text-lg'>
            Orden de compra: <span className='font-semibold'>{po?.order_number || 'Unknown'}</span>
          </p>
          <p className='text-md'>
            Asesor: <span className='font-semibold'>{employee?.first_name} {employee?.last_name}</span>
          </p>
          <p className='text-md'>
            O.T.: <span className='font-semibold'>{data.wo_number}</span>
          </p>
        </div>
        <div className='p-6 max-h-auto overflow-y-auto'>
          <InfoSection title='Información del Pedido'>
            <InfoItem label='Referencia' value={data.reference_internal} />
            <InfoItem label='Producto' value={productType?.name} secondaryLabel='Material' secondaryValue={material?.name} />
          </InfoSection>

          <InfoSection title='Especificaciones'>
            <InfoItem label='Color de película' value={data.film_color} />
            <InfoItem label='Ancho' value={`${data.width} ${measureUnitChoices[data.measure_unit as keyof typeof measureUnitChoices]}`} secondaryLabel={data.length > 0 ? 'Largo' : ''} secondaryValue={`${data.length} ${measureUnitChoices[data.measure_unit as keyof typeof measureUnitChoices]}`} />
            <InfoItem label='Fuelle' value={gussetsTypeChoices[data.gussets_type as keyof typeof gussetsTypeChoices]} secondaryLabel={data.gussets_type !== 0 ? 'Tamaño' : ''} secondaryValue={`${data.first_gusset} ${measureUnitChoices[data.measure_unit as keyof typeof measureUnitChoices]}`} />
            <InfoItem label='Solapa' value={flapTypeChoices[data.flap_type as keyof typeof flapTypeChoices]} secondaryLabel={data.flap_type !== 0 ? 'Tamaño' : ''} secondaryValue={`${data.flap_size} ${measureUnitChoices[data.measure_unit as keyof typeof measureUnitChoices]}`} />
            {data.flap_type === 4 && (
              <InfoItem label='Cinta' value={tapeChoices[data.tape as keyof typeof tapeChoices]} />
            )}
            <InfoItem label='Troquel' value={dieCutTypeChoices[data.die_cut_type as keyof typeof dieCutTypeChoices]} secondaryLabel='Tipo de sellado' secondaryValue={sealingTypeChoices[data.sealing_type as keyof typeof sealingTypeChoices]} />
            <InfoItem label='Calibre' value={Number(data.caliber).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')} secondaryLabel='Rodillo' secondaryValue={Number(data.roller_size).toFixed(2).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')} />
          </InfoSection>

          {data.additive.length > 0 && (
            <InfoSection title='Aditivos'>
              <div className='col-span-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
                <ul className='list-disc pl-5 space-y-1'>
                  {data.additive.map((item, index) => (
                    <li key={index} className='text-sm text-gray-700 dark:text-gray-300'>{item}</li>
                  ))}
                </ul>
              </div>
            </InfoSection>
          )}

          {data.pantones_quantity > 0 && (
            <InfoSection title='Impresión'>
              <InfoItem label='Caras' value={dynasTreatyFacesChoices[data.dynas_treaty_faces as keyof typeof dynasTreatyFacesChoices]} secondaryLabel='Pantones' secondaryValue={data.pantones_quantity} thirdLabel='¿Nuevo?' thirdValue={data.has_print ? 'SÍ' : 'NO'} />
              <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
                <span className='block text-sm font-medium text-gray-600 dark:text-gray-400'>Códigos de pantones:</span>
                <ul className='list-disc pl-5 space-y-1'>
                  {data.pantones_codes.map((item, index) => (
                    <li key={index} className='text-sm text-gray-700 dark:text-gray-300'>{item}</li>
                  ))}
                </ul>
              </div>
            </InfoSection>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Gestión de Producción</h1>

      {/* Detalles de OC pendientes */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Detalles de OC Pendientes</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
        <h2 className='text-xl font-semibold mb-4'>Órdenes de Trabajo</h2>

      </div>


      {/* Modal for creating/updating production details */}
      {isFormModalOpen && (
        <FormModal
          title={`Programar producción - ${currentStepL === 1 ? 'Extrusión' : currentStepL === 2 ? 'Impresión' : currentStepL === 3 ? 'Sellado' : currentStepL === 4 ? 'Manualidad' : ''}`}
          layout={[
            currentStepL === 1 ? ['extrusion_info'] :
              currentStepL === 2 ? ['printing_info'] :
                currentStepL === 3 ? ['sealing_info'] :
                  currentStepL === 4 ? ['handicraft_info'] :
                  []
          ]}
          inputs={{
            extrusion_info: (
              <div>
                <NumberInput
                  label='Cantidad de Rollos'
                  name='rolls_quantity'
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
                  label='Observaciones de Impresión'
                  name='printing_observations'
                  value={formDataPRT.observations}
                  onChange={handleInputChange}
                />
                {/* Add other printing fields as necessary */}
              </div>
            ),
            sealing_info: (
              <div>
                <NumberInput
                  label='Hits'
                  name='hits'
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
                  label='Observaciones de Manualidad'
                  name='handicraft_observations'
                  value={formDataHND.observations}
                  onChange={handleInputChange}
                />
                {/* Add other handicraft fields as necessary */}
              </div>
            ),
          }}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormModalOpen(false)}
          submitLabel='Guardar'
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          additionalInfo={renderPODInfo(formDataPOD)}
          width='max-w-[80%]'
        />
      )}
    </div>
  )
}