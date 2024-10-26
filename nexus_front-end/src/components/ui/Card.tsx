import React from 'react'
import { motion } from 'framer-motion'
import { LuView, LuClipboardEdit, LuTrash2 } from 'react-icons/lu'
import { Switch } from './Switch'

interface CardProps {
  title: string
  description: string
  imageUrl?: string
  onEdit?: () => void
  onDelete?: () => void
  showSwitch?: boolean
  switchState?: boolean
  onSwitchChange?: (checked: boolean) => void
  onView?: () => void
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  onEdit,
  onDelete,
  showSwitch = false,
  switchState = false,
  onSwitchChange,
  onView
}) => {
  const cardClasses = `rounded-lg shadow overflow-hidden ${showSwitch && !switchState ? 'opacity-50 bg-white/30 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-800'}`
  const textClasses = `${showSwitch && !switchState ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`
  const descriptionClasses = `${showSwitch && !switchState ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${cardClasses} flex flex-col h-full`}
    >
      {imageUrl && (
        <div className="relative w-full h-48 bg-white dark:bg-gray-800">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105 rounded-md"
          />
        </div>
      )}
      <div className={`p-4 flex-grow ${!imageUrl && !description ? 'flex items-center justify-center' : ''}`}>
        <h2 className={`font-semibold ${textClasses} ${!imageUrl && !description ? 'text-center text-3xl' : 'text-xl'}`}>{title}</h2>
        {description && <p className={`${descriptionClasses} mt-2`}>{description}</p>}
      </div>
      <div className="flex justify-between space-x-2 p-4 bg-gray-50 dark:bg-gray-700">
        {showSwitch && (
          <Switch
            checked={switchState}
            onCheckedChange={onSwitchChange || (() => {})}
            size='sm'
          />
        )}
        <div className="flex justify-end space-x-2">
          {onView && (
            <button
              className={`${switchState ? 'text-sky-500 hover:text-sky-700 dark:hover:text-cyan-600' : 'text-gray-400'} transition-colors`}
              onClick={onView}
            >
              <LuView size={22} />
            </button>
          )}
          {onEdit && (
            <button
              className={`${switchState ? 'text-orange-500 hover:text-orange-700' : 'text-gray-400'} transition-colors`}
              onClick={onEdit}
              disabled={!switchState}
            >
              <LuClipboardEdit size={22} />
            </button>
          )}
          {onDelete && (
            <button
              className={`${switchState ? 'text-red-500 hover:text-red-700' : 'text-gray-400'} transition-colors`}
              onClick={onDelete}
              disabled={!switchState}
            >
              <LuTrash2 size={22} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
