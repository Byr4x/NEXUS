'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Recycle, Package, ShoppingBag, Type, Palette } from 'lucide-react'
import  Dropzone, { FileWithPath } from 'react-dropzone'

type ProductType = 'tubular' | 'semi-tubular' | 'lamina' | 'bolsa'
type MaterialType = 'AD' | 'BD' | 'PP' | 'Maiz'
type FuelleType = 'LATERAL' | 'FONDO' | null
type SolapaType = 'DOBLE' | 'EXTERNA' | 'INTERNA' | 'VOLADA' | null
type TroquelType = 'RINON' | 'CAMISETA' | 'PERFORACION' | null

const products = [
  { 
    name: 'Bolsas de Maíz', 
    description: 'Bolsas biodegradables hechas de almidón de maíz, perfectas para un futuro sostenible.',
    icon: Leaf,
    color: 'from-green-400 to-green-600'
  },
  { 
    name: 'Bolsas de Plástico Reciclado', 
    description: 'Bolsas duraderas hechas de plástico reciclado, ideales para múltiples usos.',
    icon: Recycle,
    color: 'from-blue-400 to-blue-600'
  },
  { 
    name: 'Empaques Flexibles', 
    description: 'Empaques versátiles y ligeros, perfectos para una variedad de productos.',
    icon: Package,
    color: 'from-purple-400 to-purple-600'
  },
  { 
    name: 'Bolsas Personalizadas', 
    description: 'Bolsas diseñadas según sus especificaciones, ideales para branding y eventos especiales.',
    icon: ShoppingBag,
    color: 'from-red-400 to-red-600'
  }
]

interface DraggableItem {
  id: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  font?: string;
  fontSize?: number;
  color?: string;
}

export default function Products() {
  const [bagColor, setBagColor] = useState('#ffffff')
  const [bagText, setBagText] = useState('')
  const [productType, setProductType] = useState<ProductType>('bolsa')
  const [materialType, setMaterialType] = useState<MaterialType>('AD')
  const [width, setWidth] = useState(30) // Default width in cm
  const [length, setLength] = useState(50) // Default length in cm
  const [fuelleType, setFuelleType] = useState<FuelleType>(null)
  const [solapaType, setSolapaType] = useState<SolapaType>(null)
  const [hasCintaSeguridad, setHasCintaSeguridad] = useState(false)
  const [troquelType, setTroquelType] = useState<TroquelType>(null)
  const [uploadedImages, setUploadedImages] = useState<FileWithPath[]>([])
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [font, setFont] = useState('Arial')
  const [fontSize, setFontSize] = useState(16)
  const [textColor, setTextColor] = useState('#000000')

  useEffect(() => {
    drawCanvas()
  }, [width, length, bagColor, draggableItems])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas and draw bag
    ctx.fillStyle = bagColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw t-shirt bag handles
    const handleWidth = canvas.width * 0.2
    const handleHeight = canvas.height * 0.2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(handleWidth, handleHeight)
    ctx.lineTo(canvas.width - handleWidth, handleHeight)
    ctx.lineTo(canvas.width, 0)
    ctx.stroke()

    // Draw draggable items
    draggableItems.forEach(item => {
      if (item.type === 'text') {
        ctx.fillStyle = item.color || textColor
        ctx.font = `${item.fontSize || fontSize}px ${item.font || font}`
        ctx.fillText(item.content, item.x, item.y)
      } else if (item.type === 'image') {
        const img = new Image()
        img.src = item.content
        img.onload = () => ctx.drawImage(img, item.x, item.y, item.width || 50, item.height || 50)
      }
      
      if (item.id === selectedItem) {
        ctx.strokeStyle = 'blue'
        ctx.strokeRect(item.x - 2, item.y - 2, (item.width || ctx.measureText(item.content).width) + 4, (item.height || fontSize) + 4)
      }
    })
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const clickedItem = draggableItems.find(item => 
      x >= item.x && x <= item.x + (item.width || 50) && 
      y >= item.y && y <= item.y + (item.height || 50)
    )

    if (clickedItem) {
      setSelectedItem(clickedItem.id)
    } else {
      setSelectedItem(null)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedItem) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setDraggableItems(items => items.map(item => 
      item.id === selectedItem ? { ...item, x, y } : item
    ))
  }

  const handleCanvasMouseUp = () => {
    setSelectedItem(null)
  }

  const addTextItem = () => {
    const newItem: DraggableItem = { 
      id: Date.now().toString(),
      type: 'text', 
      content: 'New Text', 
      x: 50, 
      y: 50,
      font,
      fontSize,
      color: textColor
    }
    setDraggableItems([...draggableItems, newItem])
  }

  const handleImageUpload = (acceptedFiles: FileWithPath[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const newItem: DraggableItem = {
            id: Date.now().toString(),
            type: 'image',
            content: e.target.result as string,
            x: 50,
            y: 50,
            width: 100,
            height: 100
          }
          setDraggableItems([...draggableItems, newItem])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const updateSelectedItem = (updates: Partial<DraggableItem>) => {
    if (!selectedItem) return
    setDraggableItems(items => items.map(item => 
      item.id === selectedItem ? { ...item, ...updates } : item
    ))
  }

  const renderDesigner = (): JSX.Element => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            placeholder="Ancho (cm)"
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            placeholder="Largo (cm)"
            className="border p-2 rounded"
          />
        </div>
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value as ProductType)}
          className="border p-2 rounded"
        >
          <option value="tubular">Tubular</option>
          <option value="semi-tubular">Semi-tubular</option>
          <option value="lamina">Lámina</option>
          <option value="bolsa">Bolsa</option>
        </select>
        <select
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value as MaterialType)}
          className="border p-2 rounded"
        >
          <option value="AD">AD</option>
          <option value="BD">BD</option>
          <option value="PP">PP</option>
          <option value="Maiz">Maíz</option>
        </select>
        <input
          type="color"
          value={bagColor}
          onChange={(e) => setBagColor(e.target.value)}
          className="w-full h-10"
        />
        <input
          type="text"
          value={bagText}
          onChange={(e) => setBagText(e.target.value)}
          placeholder="Add text"
          className="border p-2 rounded"
        />
        <button onClick={addTextItem} className="bg-blue-500 text-white p-2 rounded">Add Text</button>
        <input
          type="text"
          value={selectedItem ? draggableItems.find(item => item.id === selectedItem)?.content || '' : ''}
          onChange={(e) => updateSelectedItem({ content: e.target.value })}
          placeholder="Edit text"
          className="border p-2 rounded"
        />
        <select
          value={font}
          onChange={(e) => {
            setFont(e.target.value)
            updateSelectedItem({ font: e.target.value })
          }}
          className="border p-2 rounded"
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => {
            setFontSize(Number(e.target.value))
            updateSelectedItem({ fontSize: Number(e.target.value) })
          }}
          placeholder="Font size"
          className="border p-2 rounded"
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => {
            setTextColor(e.target.value)
            updateSelectedItem({ color: e.target.value })
          }}
          className="w-full h-10"
        />
        <Dropzone onDrop={handleImageUpload}>
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className="border-2 border-dashed p-4">
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
            </div>
          )}
        </Dropzone>
      </div>
    );
  }

  const renderBagPreview = (): JSX.Element => {
    return (
      <canvas
        ref={canvasRef}
        width={width * 10}
        height={length * 10}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ border: '1px solid black' }}
      />
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100"
        >
          Nuestros Productos
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`bg-gradient-to-br ${product.color} p-6 flex items-center justify-center`}>
                <product.icon className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              </div>
              <div className="px-6 pb-6">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                  Más Información
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Diseña tu Producto Personalizado</h2>
          <div className="flex flex-col md:flex-row items-start justify-center gap-8">
            {renderDesigner()}
            {renderBagPreview()}
          </div>
          <Dropzone onDrop={handleImageUpload}>
            {({getRootProps, getInputProps}) => (
              <div {...getRootProps()} className="mt-4 border-2 border-dashed p-4">
                <input {...getInputProps()} />
                <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar archivos</p>
              </div>
            )}
          </Dropzone>
          <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Guardar Diseño
          </button>
        </motion.div>
      </div>
    </div>
  )
}
