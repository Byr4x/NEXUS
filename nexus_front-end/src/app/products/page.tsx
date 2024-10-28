'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ProductsDesigner from '@/components/landing/ProductsDesigner'
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"
import { Leaf, Recycle } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  product_type: number
  material: number
  image_url: string
  is_active: boolean
}

interface ProductType {
  id: number
  name: string
}

interface Material {
  id: number
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [materials, setMaterials] = useState<Material[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, typesRes, materialsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/beiplas/business/products/'),
          axios.get('http://127.0.0.1:8000/beiplas/business/productTypes/'),
          axios.get('http://127.0.0.1:8000/beiplas/business/materials/')
        ])
        setProducts(productsRes.data)
        setProductTypes(typesRes.data)
        setMaterials(materialsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const activeProducts = products.filter(p => p.is_active)
  const cornProducts = activeProducts.filter(p => materials.find(m => m.id === p.material)?.name.toLowerCase() === 'maiz' || materials.find(m => m.id === p.material)?.name.toLowerCase() === 'maíz')
  const plasticProducts = activeProducts.filter(p => materials.find(m => m.id === p.material)?.name.toLowerCase() !== 'maiz' && materials.find(m => m.id === p.material)?.name.toLowerCase() !== 'maíz')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 space-y-16">
        {/* Plastic Products Carousel */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-blue-800 dark:text-blue-400">
            Productos Plásticos
          </h2>
          <div className="bg-gradient-to-t from-blue-400 to-blue-600 dark:from-blue-400/75 dark:to-blue-600/75 px-4 py-8 rounded-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-25 dark:opacity-20">
              <div className="grid grid-cols-12 gap-8">
                {[...Array(84)].map((_, i) => (
                  <Recycle key={i} className="w-8 h-8 text-white" />
                ))}
              </div>
            </div>
            <div className="max-w-full w-full mx-auto relative z-10">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation={{
                  prevEl: '.swiper-button-prev-plastic',
                  nextEl: '.swiper-button-next-plastic',
                }}
                loop={true}
                slidesPerGroup={1}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: true
                }}
                className="relative group !px-12"
              >
                {plasticProducts.map((product) => (
                  <SwiperSlide key={product.id} className="flex flex-col items-center justify-center">
                    <div className="relative w-72 h-72">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-105 rounded-md"
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-prev-plastic absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IoChevronBackOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="swiper-button-next-plastic absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IoChevronForwardOutline className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </Swiper>
            </div>
          </div>
        </motion.div>

        {/* Corn Products Carousel */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-amber-800 dark:text-amber-400">
            Productos de MAHÍZ
          </h2>
          <div className="bg-gradient-to-t from-amber-50 to-amber-100 dark:from-white/85 dark:to-amber-100/75 px-4 pt-8 pb-4 rounded-xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
              <div className="grid grid-cols-12 gap-8">
                {[...Array(84)].map((_, i) => (
                  <Leaf key={i} className="w-8 h-8 text-amber-400 dark:text-amber-800" />
                ))}
              </div>
            </div>
            <div className="max-full w-full mx-auto relative z-10">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation={{
                  prevEl: '.swiper-button-prev-corn',
                  nextEl: '.swiper-button-next-corn',
                }}
                loop={true}
                slidesPerGroup={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: true
                }}
                className="relative group !px-12"
              >
                {cornProducts.map((product) => (
                  <SwiperSlide key={product.id} className="flex flex-col items-center justify-center">
                    <div className="relative w-72 h-72">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-300 hover:scale-105 rounded-md"
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {/* Custom Navigation Buttons */}
                <div className="swiper-button-prev-corn absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IoChevronBackOutline className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="swiper-button-next-corn absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-3 rounded-full shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <IoChevronForwardOutline className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </Swiper>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-10">
                Productos compostables y biodegradables
              </p>
          </div>
        </motion.div>

        {/* Products Designer Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <ProductsDesigner />
        </motion.div>
      </div>
    </div>
  )
}
