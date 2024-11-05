'use client'
import { useState, useEffect } from 'react'
import { Card, Button, Badge, List, message, Modal, Form, Input } from 'antd'
import { BellOutlined, CheckCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

interface PODetail {
  id: number
  wo_number: string
  product: string
  quantity: number
  status: string
  // Agrega más campos según tu API
}

interface WorkOrder {
  id: number
  wo_number: string
  status: string
  // Agrega más campos según tu API
}

export default function ProductionPage() {
  const [poDetails, setPoDetails] = useState<PODetail[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<PODetail | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchPODetails()
    fetchWorkOrders()
  }, [])

  const fetchPODetails = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/beiplas/business/poDetails/')
      setPoDetails(response.data)
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
              className="shadow-md hover:shadow-lg transition-shadow"
              extra={<BellOutlined className="text-blue-500" />}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{detail.product}</h3>
                  <p>WO: {detail.wo_number}</p>
                  <p>Cantidad: {detail.quantity}</p>
                  <Badge status="processing" text={detail.status} />
                </div>
                <Button 
                  type="primary"
                  onClick={() => {
                    setSelectedDetail(detail)
                    setIsModalVisible(true)
                  }}
                >
                  Crear OT
                </Button>
              </div>
            </Card>
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
          renderItem={wo => (
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
