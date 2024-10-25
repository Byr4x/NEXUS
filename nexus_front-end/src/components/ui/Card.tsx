import React from 'react'
import { motion } from 'framer-motion'
import { LuView, LuClipboardEdit, LuTrash2 } from 'react-icons/lu'
import { Switch } from './Switch'

interface CardProps {
  title: string
  description: string
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
  onEdit,
  onDelete,
  showSwitch = false,
  switchState = false,
  onSwitchChange,
  onView
}) => {
  const cardClasses = `p-4 rounded-lg shadow ${showSwitch && !switchState ? 'opacity-50 bg-white/30 dark:bg-gray-800/30' : 'bg-white dark:bg-gray-800'}`
  const textClasses = `${showSwitch && !switchState ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`
  const descriptionClasses = `${showSwitch && !switchState ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'} mb-4`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${cardClasses} flex flex-col h-full`}
    >
      <div className={`flex-grow ${!description ? 'flex items-center justify-center' : ''}`}>
        <h2 className={`font-semibold ${textClasses} ${!description ? 'text-center text-3xl' : 'text-xl'}`}>{title}</h2>
        {description && <p className={descriptionClasses}>{description}</p>}
      </div>
      <div className="flex justify-between space-x-2 mt-4">
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
