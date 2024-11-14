'use client'
import { useState, useEffect, Reference } from 'react'
import { Button, Badge, List, message, Modal, Form, Input } from 'antd'
import { Card } from '@/components/ui/Card'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Customer, PODetail, WorkOrder, Extrusion, R_RawMaterial_Extrusion, Printing, Sealing, Handicraft } from '@/components/interfaces';
import { LuCalendarClock } from 'react-icons/lu'
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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<PODetail | null>(null)
  const [form] = Form.useForm()

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
      }
    }

    return validations[name] ? validations[name]() : '';
  }



  const createWorkOrder = async (values: any) => {
    try {
      await axios.post('http://127.0.0.1:8000/beiplas/production/workOrders/', {
        wo_number: selectedDetail?.wo_number,
        ...values
      })
      message.success('Orden de trabajo creada exitosamente')
      setIsModalVisible(false)
      fetchWorkOrders()
    } catch (error) {
      message.error('Error al crear la orden de trabajo')
    }
  }

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
    </div>
  )
}