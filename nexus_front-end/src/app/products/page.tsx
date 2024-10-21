'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Tooltip } from "@nextui-org/tooltip";
import { Tab } from '@headlessui/react'
import jsPDF from 'jspdf'

type ProductType = 'Tubular' | 'Semi-tubular' | 'Lamina' | 'Bolsa'
type MaterialType = 'Alta Densidad' | 'Baja Densidad' | 'Polipropileno' | 'Maíz'
type GussetType = 'Lateral' | 'Fondo' | 'Ninguno'
type FlapType = 'Sin Solapa' | 'Interna' | 'Interna Doble' | 'Volada'
type TroquelType = 'Sin Troquel' | 'Riñón' | 'Camiseta'

const productTypes: { type: ProductType; imageUrl: string }[] = [
  { type: 'Tubular', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/tubular.png' },
  { type: 'Semi-tubular', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/semi-tubular.png' },
  { type: 'Lamina', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/lamina.png' },
  { type: 'Bolsa', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/bolsa.png' },
]

const gussetTypes: { type: GussetType; imageUrl: string }[] = [
  { type: 'Ninguno', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/bolsa.png' },
  { type: 'Lateral', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729509193/logos/fuelle-lat.png' },
  { type: 'Fondo', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729509193/logos/fuelle-fon.png' },
]

const flapTypes: { type: FlapType; imageUrl: string }[] = [
  { type: 'Sin Solapa', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/bolsa.png' },
  { type: 'Interna', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729515988/logos/solapa-int.png' },
  { type: 'Interna Doble', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729515988/logos/solapa-int-dob.png' },
  { type: 'Volada', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729515988/logos/solapa-vol.png' },
]

const troquelTypes: { type: TroquelType; imageUrl: string }[] = [
  { type: 'Sin Troquel', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/bolsa.png' },
  { type: 'Riñón', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729523865/logos/troquel-rin.png' },
  { type: 'Camiseta', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729523865/logos/troquel-cam.png' },
]

export default function Products() {
  const [productType, setProductType] = useState<ProductType>('Tubular')
  const [materialType, setMaterialType] = useState<MaterialType>('Alta Densidad')
  const [width, setWidth] = useState(30)
  const [length, setLength] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 900 })
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(true)
  const [bagColor, setBagColor] = useState('#FFFFFF')
  const [gussetType, setGussetType] = useState<GussetType>('Ninguno')
  const [gusset, setGusset] = useState(0)
  const [isGussetSelectorOpen, setIsGussetSelectorOpen] = useState(false)
  const [flapType, setFlapType] = useState<FlapType>('Sin Solapa')
  const [flapSize, setFlapSize] = useState(0)
  const [isFlapSelectorOpen, setIsFlapSelectorOpen] = useState(false)
  const [troquelType, setTroquelType] = useState<TroquelType>('Sin Troquel')
  const [isTroquelSelectorOpen, setIsTroquelSelectorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const plasticColors = [
    'rgba(255, 0, 0, 0.7)',    // red
    'rgba(255, 165, 0, 0.7)',  // orange
    'rgba(255, 255, 0, 0.7)',  // yellow
    'rgba(0, 128, 0, 0.7)',    // green
    'rgba(0, 0, 255, 0.7)',    // blue
    'rgba(75, 0, 130, 0.7)',   // indigo
    'rgba(238, 231, 211, 0.7)', // beige
    'rgba(0, 0, 0, 0.8)',      // black (slightly transparent)
    'rgba(255, 255, 255, 0.9)', // white (slightly transparent)
    'rgba(0, 0, 0, 0.1)',        // transparent
  ]

  const maizeColor = 'rgba(255, 254, 238, 0.7)'

  useEffect(() => {
    drawCanvas()
  }, [width, length, canvasSize, productType, bagColor, gussetType, gusset, flapType, flapSize, troquelType])

  useEffect(() => {
    if (materialType === 'Maíz') {
      setBagColor(maizeColor)
    }
  }, [materialType])

  useEffect(() => {
    if (gussetType === 'Lateral') {
      setTroquelType('Camiseta')
    }
    drawCanvas()
  }, [gussetType, gusset])

  useEffect(() => {
    // Reset dependent values when product type changes
    if (productType !== 'Bolsa') {
      setGussetType('Ninguno')
      setGusset(0)
      setFlapType('Sin Solapa')
      setFlapSize(0)
      setTroquelType('Sin Troquel')
    }
  }, [productType])

  useEffect(() => {
    // Reset dependent values when gusset type changes
    if (gussetType === 'Ninguno') {
      setGusset(0)
    }
    if (gussetType === 'Lateral') {
      setFlapType('Sin Solapa')
      setFlapSize(0)
      setTroquelType('Camiseta')
    } else {
      setTroquelType('Sin Troquel')
    }
  }, [gussetType])

  useEffect(() => {
    // Reset dependent values when flap type changes
    if (flapType === 'Sin Solapa') {
      setFlapSize(0)
    }
    if (flapType === 'Volada') {
      setTroquelType('Sin Troquel')
    }
  }, [flapType])

  const handleProductTypeChange = (type: ProductType) => {
    setProductType(type)
  }

  const handleGussetTypeChange = (type: GussetType) => {
    setGussetType(type)
    if (type === 'Lateral') {
      setTroquelType('Camiseta')
    }
  }

  const handleGussetSizeChange = (size: number) => {
    setGusset(size)
    if (gussetType === 'Lateral') {
      setTroquelType('Camiseta')
    }
  }

  const handleFlapTypeChange = (type: FlapType) => {
    setFlapType(type)
  }

  const handleTroquelTypeChange = (type: TroquelType) => {
    setTroquelType(type)
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate aspect ratio
    const aspectRatio = ['Tubular', 'Semi-tubular'].includes(productType) ? 1 : width / length
    let bagWidth, bagHeight

    // Further reduce the left margin
    const leftMargin = 30;

    // Adjust bagWidth to account for the left margin
    if (aspectRatio > (canvasSize.width - leftMargin) / canvasSize.height) {
      bagWidth = (canvasSize.width - leftMargin) * 0.95
      bagHeight = ['Tubular', 'Semi-tubular'].includes(productType) ? bagWidth : bagWidth / aspectRatio
    } else {
      bagHeight = canvasSize.height * 0.95
      bagWidth = ['Tubular', 'Semi-tubular'].includes(productType) ? bagHeight : bagHeight * aspectRatio
    }

    // Adjust bagX to be even closer to the left margin
    const bagX = leftMargin + (canvasSize.width - leftMargin - bagWidth) / 2
    const bagY = (canvasSize.height - bagHeight) / 2

    // Calculate the scale factor
    const scaleX = bagWidth / width
    const scaleY = bagHeight / length

    // Draw bag
    ctx.fillStyle = bagColor
    ctx.fillRect(bagX, bagY, bagWidth, bagHeight)

    // Draw border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2

    if (productType === 'Bolsa' && gussetType === 'Lateral') {
      // For camiseta bags, draw the top border in two parts
      const leftGussetX = bagX + (gusset * scaleX)
      const rightGussetX = bagX + bagWidth - (gusset * scaleX)

      ctx.beginPath()
      ctx.moveTo(bagX, bagY)
      ctx.lineTo(leftGussetX, bagY)
      ctx.moveTo(rightGussetX, bagY)
      ctx.lineTo(bagX + bagWidth, bagY)
      ctx.lineTo(bagX + bagWidth, bagY + bagHeight)
      ctx.lineTo(bagX, bagY + bagHeight)
      ctx.lineTo(bagX, bagY)
      ctx.stroke()
    } else {
      // For all other bags, draw the full border
      ctx.strokeRect(bagX, bagY, bagWidth, bagHeight)
    }

    // Draw measurement lines
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.beginPath()

    // Width line (adjusted)
    ctx.moveTo(bagX, bagY + bagHeight + 15)
    ctx.lineTo(bagX + bagWidth, bagY + bagHeight + 15)
    ctx.moveTo(bagX, bagY + bagHeight + 10)
    ctx.lineTo(bagX, bagY + bagHeight + 20)
    ctx.moveTo(bagX + bagWidth, bagY + bagHeight + 10)
    ctx.lineTo(bagX + bagWidth, bagY + bagHeight + 20)

    // Height line (only for Lamina and Bolsa)
    if (!['Tubular', 'Semi-tubular'].includes(productType)) {
      ctx.moveTo(leftMargin - 5, bagY)
      ctx.lineTo(leftMargin - 5, bagY + bagHeight)
      ctx.moveTo(leftMargin, bagY)
      ctx.lineTo(leftMargin - 10, bagY)
      ctx.moveTo(leftMargin, bagY + bagHeight)
      ctx.lineTo(leftMargin - 10, bagY + bagHeight)
    }

    ctx.stroke()

    // Draw measurements text
    ctx.fillStyle = '#000000'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${width} cm`, bagX + bagWidth / 2, bagY + bagHeight + 35)
    if (['Lamina', 'Bolsa'].includes(productType)) {
      ctx.save()
      ctx.translate(leftMargin - 15, bagY + bagHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(`${length} cm`, 0, 0)
      ctx.restore()
    }

    // Helper function to draw arrow
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number) => {
      const headlen = 10 // length of head in pixels
      const dx = toX - fromX
      const dy = toY - fromY
      const angle = Math.atan2(dy, dx)
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6))
      ctx.moveTo(toX, toY)
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6))
    }

    // Draw gusset lines
    if (productType === 'Bolsa' && gussetType !== 'Ninguno') {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.beginPath()

      if (gussetType === 'Lateral') {
        const leftGussetX = bagX + (gusset * scaleX)
        const rightGussetX = bagX + bagWidth - (gusset * scaleX)
        
        // Calculate the depth of the camiseta cut (24% of bag length)
        const camisetaCutDepth = bagHeight * 0.24

        // Clear the area between gussets
        ctx.clearRect(leftGussetX, bagY, rightGussetX - leftGussetX, camisetaCutDepth)

        // Draw left gusset line
        ctx.moveTo(leftGussetX, bagY)
        ctx.lineTo(leftGussetX, bagY + bagHeight)
        
        // Draw right gusset line
        ctx.moveTo(rightGussetX, bagY)
        ctx.lineTo(rightGussetX, bagY + bagHeight)

        // Draw camiseta cut lines
        ctx.moveTo(leftGussetX, bagY)
        ctx.lineTo(leftGussetX, bagY + camisetaCutDepth)
        ctx.lineTo(rightGussetX, bagY + camisetaCutDepth)
        ctx.lineTo(rightGussetX, bagY)

        // Measurement line for gusset (inside the gusset)
        drawArrow(bagX + 10, bagY + 10, leftGussetX - 5, bagY + 10)
        drawArrow(leftGussetX - 5, bagY + 10, bagX + 10, bagY + 10)

        // Measurement text for gusset
        ctx.font = '14px Arial'
        ctx.fillStyle = '#000000'
        ctx.textAlign = 'center'
        ctx.fillText(`${gusset} cm`, (bagX + leftGussetX) / 2, bagY + 25)

      } else if (gussetType === 'Fondo') {
        // Bottom gusset
        const bottomGussetY = bagY + bagHeight - (gusset * scaleY)
        ctx.moveTo(bagX, bottomGussetY)
        ctx.lineTo(bagX + bagWidth, bottomGussetY)

        // Measurement line for bottom gusset (inside the gusset)
        drawArrow(bagX + 10, bottomGussetY + 5, bagX + 10, bagY + bagHeight - 5)
        drawArrow(bagX + 10, bagY + bagHeight - 5, bagX + 10, bottomGussetY + 5)

        // Measurement text for bottom gusset
        ctx.save()
        ctx.translate(bagX + 25, (bottomGussetY + bagY + bagHeight) / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(`${gusset} cm`, 0, 0)
        ctx.restore()
      }

      ctx.stroke()
    }

    // Draw flap
    if (productType === 'Bolsa' && gussetType !== 'Lateral' && flapType !== 'Sin Solapa') {
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2
      ctx.beginPath()

      const flapY = flapType === 'Volada' ? bagY - (flapSize * scaleY) : bagY + (flapSize * scaleY)

      if (flapType === 'Volada') {
        // Fill the flap area with the bag color
        ctx.fillStyle = bagColor
        ctx.fillRect(bagX, flapY, bagWidth, bagY - flapY)

        // Draw the flap outline
        ctx.beginPath()
        ctx.moveTo(bagX, flapY)
        ctx.lineTo(bagX + bagWidth, flapY)
        ctx.lineTo(bagX + bagWidth, bagY)
        ctx.lineTo(bagX, bagY)
        ctx.closePath()
        ctx.stroke()

        // Draw tape line for 'Volada' flap
        const tapeY = flapY + (bagY - flapY) / 2
        ctx.lineWidth = 6  // Increase line width for the tape
        ctx.beginPath()
        ctx.moveTo(bagX, tapeY)
        ctx.lineTo(bagX + bagWidth, tapeY)
        ctx.stroke()
        ctx.lineWidth = 2  // Reset line width

        // Measurement line for flap
        const measurementX = leftMargin - 5
        drawArrow(measurementX, bagY - 6  , measurementX, flapY + 5)
        drawArrow(measurementX, flapY + 6, measurementX, bagY - 5)

        // Measurement text for flap
        ctx.save()
        ctx.translate(measurementX - 15, (flapY + bagY) / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillStyle = '#000000'
        ctx.fillText(`${flapSize} cm`, 0, 0)
        ctx.restore()
      } else {
        // For internal flaps
        ctx.moveTo(bagX, flapY)
        ctx.lineTo(bagX + bagWidth, flapY)

        // Measurement line for internal flap
        drawArrow(bagX + 20, bagY + 5, bagX + 20, flapY - 5)
        drawArrow(bagX + 20, flapY - 5, bagX + 20, bagY + 5)

        // Measurement text for internal flap
        ctx.save()
        ctx.translate(bagX + 35, (flapY + bagY) / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillStyle = '#000000'
        ctx.fillText(`${flapSize} cm`, 0, 0)
        ctx.restore()
      }

      ctx.stroke()
    }
  }

  const exportToPDF = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height

    // Ajustar la imagen para que quepa en la página, manteniendo un margen
    const margin = 10
    const maxWidth = pdfWidth - 2 * margin
    const maxHeight = pdfHeight - 2 * margin

    let finalWidth = imgWidth
    let finalHeight = imgHeight

    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
      finalWidth = imgWidth * scale
      finalHeight = imgHeight * scale
    }

    const imgX = (pdfWidth - finalWidth) / 2
    const imgY = (pdfHeight - finalHeight) / 2

    pdf.text('Diseño del Producto', 14, 15)
    pdf.addImage(imgData, 'PNG', imgX, imgY, finalWidth, finalHeight)
    pdf.save('diseno-producto.pdf')
  }

  const renderStyle = (): JSX.Element => {
    return (
      <div className="w-full flex flex-col gap-6">
        {/* Product Selector */}
        <div>
          <label htmlFor="productSelector" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seleccionar Producto
          </label>
          <div
            id="productSelector"
            className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded text-lg"
            onClick={() => setIsProductSelectorOpen(!isProductSelectorOpen)}
          >
            <span className="text-gray-800 dark:text-gray-200">{productType}</span>
            {isProductSelectorOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
          </div>
        </div>

        {/* Product Type Grid */}
        {isProductSelectorOpen && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {productTypes.map((product) => (
              <div
                key={product.type}
                className={`cursor-pointer border p-4 rounded ${
                  productType === product.type ? 'border-sky-500' : 'border-gray-300 dark:border-gray-600'
                } flex flex-col items-center justify-center h-60`}
                onClick={() => handleProductTypeChange(product.type)}
              >
                <img
                  src={product.imageUrl}
                  alt={product.type}
                  className={`w-36 h-36 object-contain ${
                    productType === product.type ? 'opacity-100 scale-110' : 'opacity-65'
                  } transition-all duration-200`}
                />
                <p className="text-center mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">{product.type}</p>
              </div>
            ))}
          </div>
        )}

        {/* Material Type Selector */}
        <div>
          <label htmlFor="materialType" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Material
          </label>
          <select
            id="materialType"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value as MaterialType)}
            className="w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg"
          >
            <option value="Alta Densidad">Alta Densidad</option>
            <option value="Baja Densidad">Baja Densidad</option>
            <option value="Polipropileno">Polipropileno</option>
            <option value="Maíz">Maíz</option>
          </select>
        </div>

        {/* Color Selector */}
        {materialType !== 'Maíz' && (
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color de la bolsa
            </label>
            <Tooltip content="Activa y desactiva el modo oscuro para que puedas detallar los colores" className='bg-gray-800 text-white dark:bg-gray-200 dark:text-black'>
              <div className="flex flex-wrap gap-3">
                {plasticColors.map((color) => (
                  <div
                    key={color}
                    className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                      bagColor === color ? 'border-sky-500' : 'border-gray-300'
                    } relative`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBagColor(color)}
                  >
                    {color === 'rgba(0, 0, 0, 0.1)' && (
                      <>
                        <div className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-500 dark:text-gray-300">TRANS</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Tooltip>
          </div>
        )}

        {/* Dimensions Inputs */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <label htmlFor="width" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ancho (cm)
            </label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg"
            />
          </div>
          {['Lamina', 'Bolsa'].includes(productType) && (
            <div className="w-1/2">
              <label htmlFor="length" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Largo (cm)
              </label>
              <input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg"
              />
            </div>
          )}
        </div>

        {/* Gusset Selector (for 'Bolsa' type) */}
        {productType === 'Bolsa' && (
          <>
            <div>
              <label htmlFor="gussetSelector" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Tipo de Fuelle
              </label>
              <div
                id="gussetSelector"
                className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded text-lg"
                onClick={() => setIsGussetSelectorOpen(!isGussetSelectorOpen)}
              >
                <span className="text-gray-800 dark:text-gray-200">{gussetType}</span>
                {isGussetSelectorOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
              </div>
            </div>

            {isGussetSelectorOpen && (
              <div className="grid grid-cols-3 gap-6 mb-6">
                {gussetTypes.map((gusset) => (
                  <div
                    key={gusset.type}
                    className={`cursor-pointer border p-4 rounded ${
                      gussetType === gusset.type ? 'border-sky-500' : 'border-gray-300 dark:border-gray-600'
                    } flex flex-col items-center justify-center h-48`}
                    onClick={() => handleGussetTypeChange(gusset.type)}
                  >
                    <img
                      src={gusset.imageUrl}
                      alt={gusset.type}
                      className={`w-28 h-28 object-contain ${
                        gussetType === gusset.type ? 'opacity-100 scale-110' : 'opacity-65'
                      } transition-all duration-200`}
                    />
                    <p className="text-center mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">{gusset.type === 'Lateral' ? gusset.type + ' \n(bolsa de cargadera)' : gusset.type}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Gusset Input */}
            {gussetType !== 'Ninguno' && (
              <div>
                <label htmlFor="gusset" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuelle {gussetType === 'Lateral' ? 'Lateral' : 'de Fondo'} (cm)
                </label>
                <input
                  id="gusset"
                  type="number"
                  value={gusset}
                  onChange={(e) => handleGussetSizeChange(Number(e.target.value))}
                  className="w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg"
                />
              </div>
            )}
          </>
        )}

        {/* Flap Selector (for 'Bolsa' type and when gusset is not 'Lateral') */}
        {productType === 'Bolsa' && gussetType !== 'Lateral' && (
          <>
            <div>
              <label htmlFor="flapSelector" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Tipo de Solapa
              </label>
              <div
                id="flapSelector"
                className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded text-lg"
                onClick={() => setIsFlapSelectorOpen(!isFlapSelectorOpen)}
              >
                <span className="text-gray-800 dark:text-gray-200">{flapType}</span>
                {isFlapSelectorOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
              </div>
            </div>

            {isFlapSelectorOpen && (
              <div className="grid grid-cols-2 gap-6 mb-6">
                {flapTypes.map((flap) => (
                  <div
                    key={flap.type}
                    className={`cursor-pointer border p-4 rounded ${
                      flapType === flap.type ? 'border-sky-500' : 'border-gray-300 dark:border-gray-600'
                    } flex flex-col items-center justify-center h-48`}
                    onClick={() => handleFlapTypeChange(flap.type)}
                  >
                    <img
                      src={flap.imageUrl}
                      alt={flap.type}
                      className={`w-28 h-28 object-contain ${
                        flapType === flap.type ? 'opacity-100 scale-110' : 'opacity-65'
                      } transition-all duration-200`}
                    />
                    <p className="text-center mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">{flap.type === 'Volada' ? flap.type + ' (lleva cinta)' : flap.type}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Flap Size Input */}
            {flapType !== 'Sin Solapa' && (
              <div>
                <label htmlFor="flapSize" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño de Solapa (cm)
                </label>
                <input
                  id="flapSize"
                  type="number"
                  value={flapSize}
                  onChange={(e) => setFlapSize(Number(e.target.value))}
                  className="w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg"
                />
              </div>
            )}
          </>
        )}

        {/* Troquel Selector */}
        {productType === 'Bolsa' && flapType !== 'Volada' && (
          <>
            <div>
              <label htmlFor="troquelSelector" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Tipo de Troquel
              </label>
              <div
                id="troquelSelector"
                className="flex justify-between items-center cursor-pointer bg-gray-100 dark:bg-gray-700 p-3 rounded text-lg"
                onClick={() => setIsTroquelSelectorOpen(!isTroquelSelectorOpen)}
              >
                <span className="text-gray-800 dark:text-gray-200">{troquelType}</span>
                {isTroquelSelectorOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
              </div>
            </div>

            {isTroquelSelectorOpen && (
              <div className="grid grid-cols-3 gap-6 mb-6">
                {troquelTypes.map((troquel) => {
                  // Determine if this troquel option should be shown
                  let shouldShow = true;
                  if (gussetType === 'Lateral' && troquel.type !== 'Camiseta') {
                    shouldShow = false;
                  } else if (gussetType === 'Fondo' && troquel.type === 'Camiseta') {
                    shouldShow = false;
                  }

                  // Only render the option if it should be shown
                  return shouldShow ? (
                    <div
                      key={troquel.type}
                      className={`cursor-pointer border p-4 rounded ${
                        troquelType === troquel.type 
                          ? 'border-sky-500' 
                          : gussetType === 'Lateral' && troquel.type === 'Camiseta'
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-gray-600'
                      } flex flex-col items-center justify-center h-48`}
                      onClick={() => handleTroquelTypeChange(troquel.type)}
                    >
                      <img
                        src={troquel.imageUrl}
                        alt={troquel.type}
                        className={`w-28 h-28 object-contain ${
                          troquelType === troquel.type ? 'opacity-100 scale-110' : 'opacity-65'
                        } transition-all duration-200`}
                      />
                      <p className="text-center mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">
                        {troquel.type}
                      </p>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  const renderBagPreview = (): JSX.Element => {
    return (
      <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
        <div className="w-full max-w-md h-[600px] lg:h-[800px]">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className={`w-full h-full object-contain outline outline-offset-4 outline-dashed outline-gray-300 dark:outline-gray-600 rounded-xl`}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gray-800 dark:text-gray-100">
          Diseña tu Producto Personalizado
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg p-6 md:p-8">
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 dark:text-blue-200
                  ${selected
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                Parámetros del Producto
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 dark:text-blue-200
                  ${selected
                    ? 'bg-white dark:bg-gray-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  }`
                }
              >
                Diseño del Producto
              </Tab>
            </Tab.List>
            <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
              <div className="w-full lg:w-1/2">
                <Tab.Panels>
                  <Tab.Panel>
                    {renderStyle()}
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="text-center text-gray-600 dark:text-gray-300">
                      Contenido para el diseño del producto (por implementar)
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </div>
              {renderBagPreview()}
            </div>
          </Tab.Group>
          <div className="mt-8 flex justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300"
              onClick={() => console.log('Guardar diseño')}
            >
              Guardar Diseño
            </button>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300"
              onClick={exportToPDF}
            >
              Exportar a PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
