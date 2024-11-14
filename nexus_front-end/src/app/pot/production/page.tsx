'use client'
import { useState, useEffect, Reference } from 'react'
import { Button, Badge, List, message, Modal, Form, Input } from 'antd'
import { Card } from '@/components/ui/Card'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Customer, PODetail, WorkOrder } from '@/components/interfaces';
import { LuCalendarClock } from 'react-icons/lu'
import axios from 'axios'

export default function ProductionPage() {
  const [poDetails, setPoDetails] = useState<PODetail[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<PODetail | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchPODetails()
    fetchWorkOrders()
    fetchCustomers()
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
              actionButton={<button className='text-white transition-colors w-full bg-sky-500 rounded-md p-2 flex items-center justify-center gap-2 hover:bg-sky-600 font-mono text-lg' onClick={() => setSelectedDetail(detail)}> <LuCalendarClock size={22} />Programar</button>}
            />
          ))}
        </div>
      </div>

      {/* Lista de Órdenes de Trabajo */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Órdenes de Trabajo</h2>
        <List
          className="shadow-md"
          itemLayout="horizontal"
          dataSource={workOrders}
          renderItem={(wo: WorkOrder) => (
            <List.Item
              actions={[
                <Button key="edit" type="link">Editar</Button>,
                <Button key="delete" type="link" danger>Eliminar</Button>
              ]}
            >
              <List.Item.Meta
                avatar={<CheckCircleOutlined className="text-green-500" />}
                title={`OT: ${wo.wo_number}`}
                description={`Estado: ${wo.status}`}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Modal para crear OT */}
      <Modal
        title="Crear Orden de Trabajo"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={createWorkOrder}
          layout="vertical"
        >
          <Form.Item
            name="notes"
            label="Notas"
            rules={[{ required: true, message: 'Por favor ingrese las notas' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Crear Orden de Trabajo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
