'use client'

import React, { useState, useRef, useEffect } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Tooltip } from "@nextui-org/tooltip";

type ProductType = 'Tubular' | 'Semi-tubular' | 'Lamina' | 'Bolsa'
type MaterialType = 'Alta Densidad' | 'Baja Densidad' | 'Polipropileno' | 'Maíz'
type GussetType = 'Lateral' | 'Fondo' | 'Ninguno'

const productTypes: { type: ProductType; imageUrl: string }[] = [
  { type: 'Tubular', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/tubular.png' },
  { type: 'Semi-tubular', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/semi-tubular.png' },
  { type: 'Lamina', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/lamina.png' },
  { type: 'Bolsa', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/bolsa.png' },
]

const gussetTypes: { type: GussetType; imageUrl: string }[] = [
  { type: 'Ninguno', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729257739/logos/bolsa.png' },
  { type: 'Lateral', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729274913/logos/fuelle-lat.png' },
  { type: 'Fondo', imageUrl: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729274913/logos/fuelle-fon.png' },
]

export default function Products() {
  const [productType, setProductType] = useState<ProductType>('Tubular')
  const [materialType, setMaterialType] = useState<MaterialType>('Alta Densidad')
  const [width, setWidth] = useState(30)
  const [length, setLength] = useState(50)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 800 })
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(true)
  const [bagColor, setBagColor] = useState('#FFFFFF')
  const [gussetType, setGussetType] = useState<GussetType>('Ninguno')
  const [gusset, setGusset] = useState(0)
  const [isGussetSelectorOpen, setIsGussetSelectorOpen] = useState(false)

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
    'rgba(0, 0, 0, 0.3)',        // transparent
  ]

  const maizeColor = 'rgba(255, 254, 238, 0.7)'

  useEffect(() => {
    drawCanvas()
  }, [width, length, canvasSize, productType, bagColor, gussetType, gusset])

  useEffect(() => {
    if (materialType === 'Maíz') {
      setBagColor(maizeColor)
    }
  }, [materialType])

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

    ctx.fillStyle = bagColor
    ctx.fillRect(bagX, bagY, bagWidth, bagHeight)

    // Calculate the scale factor
    const scaleX = bagWidth / width
    const scaleY = bagHeight / length

    // Draw border
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.strokeRect(bagX, bagY, bagWidth, bagHeight)

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
        // Left gusset
        const leftGussetX = bagX + (gusset * scaleX)
        ctx.moveTo(leftGussetX, bagY)
        ctx.lineTo(leftGussetX, bagY + bagHeight)
        
        // Right gusset
        const rightGussetX = bagX + bagWidth - (gusset * scaleX)
        ctx.moveTo(rightGussetX, bagY)
        ctx.lineTo(rightGussetX, bagY + bagHeight)

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
  }

  const renderDesigner = (): JSX.Element => {
    return (
      <div className="w-full lg:w-1/2 flex flex-col gap-6">
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
                onClick={() => setProductType(product.type)}
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
                    {color === 'rgba(0, 0, 0, 0.3)' && (
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
                    onClick={() => setGussetType(gusset.type)}
                  >
                    <img
                      src={gusset.imageUrl}
                      alt={gusset.type}
                      className={`w-28 h-28 object-contain ${
                        gussetType === gusset.type ? 'opacity-100 scale-110' : 'opacity-65'
                      } transition-all duration-200`}
                    />
                    <p className="text-center mt-4 text-lg font-medium text-gray-800 dark:text-gray-200">{gusset.type}</p>
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
                  onChange={(e) => setGusset(Number(e.target.value))}
                  className="w-full border p-3 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg"
                />
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
        <div className="w-full max-w-md h-[600px] lg:h-[800px]"> {/* Adjust the height here */}
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className={`w-full h-full object-contain outline outline-offset-4 outline-dashed outline-gray-300 dark:outline-gray-600 rounded-xl bg-light-image dark:bg-dark-image bg-cover bg-center`}
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
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
            {renderDesigner()}
            {renderBagPreview()}
          </div>
          <button className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300">
            Guardar Diseño
          </button>
        </div>
      </div>
    </div>
  )
}
