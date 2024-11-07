import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuSearch, LuFilter, LuArrowDownWideNarrow, LuArrowUpWideNarrow, LuArrowLeft, LuArchive } from 'react-icons/lu';

interface FilterOption {
  key: string;
  label: string;
}

interface TopTableElementsProps {
  onAdd: () => void;
  onSearch: (searchTerm: string) => void;
  onFilter: (field: string | null, order: 'asc' | 'desc') => void;
  filterOptions: FilterOption[];
  showBackButton?: boolean;
  onBack?: () => void;
  showAnnulledButton?: boolean;
  showAnnulled?: boolean;
  onToggleAnnulled?: () => void;
}

const TopTableElements: React.FC<TopTableElementsProps> = ({ onAdd, onSearch, onFilter, filterOptions, showBackButton, onBack, showAnnulledButton, showAnnulled, onToggleAnnulled }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleOrder = () => {
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    setCurrentOrder(newOrder);
    onFilter(currentField, newOrder);
  };

  const handleFilterChange = (field: string | null) => {
    setCurrentField(field);
    onFilter(field, currentOrder);
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-1 gap-2">
      <div className="flex items-center gap-1">
        {showBackButton && (
          <button
            className="rounded-lg text-black dark:text-white bg-white dark:bg-gray-700 px-4 py-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800 border dark:border-gray-600"
            onClick={onBack}
          >
            <LuArrowLeft className="mr-2" /> Volver
          </button>
        )}
        {showAnnulledButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg px-4 py-2 flex items-center bg-white text-black dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 border dark:border-gray-600`}
            onClick={onToggleAnnulled}
          >
            <LuArchive className="mr-2" />
            Archivo de anuladas
          </motion.button>
        )}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 dark:hover:bg-green-700 transition-colors border dark:border-green-800"
          onClick={onAdd}
        >
          <LuPlus className="mr-2" /> Agregar
        </motion.button>
      </div>

      <div className="flex items-center gap-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
            <LuSearch />
          </span>
        </div>

        <div className="relative">
          <div className="flex rounded-lg overflow-hidden">
            <button
              className="text-black dark:text-white bg-white dark:bg-gray-700 px-4 py-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800 border dark:border-gray-600"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <LuFilter className="mr-2" /> {currentField ? filterOptions.find(o => o.key === currentField)?.label : 'Sin filtro'}
            </button>
            <button
              className="text-black dark:text-white bg-white dark:bg-gray-700 px-3 py-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800 border dark:border-gray-600"
              onClick={toggleOrder}
            >
              {currentOrder === 'desc' ? (
                <LuArrowDownWideNarrow />
              ) : (
                <LuArrowUpWideNarrow />
              )}
            </button>
          </div>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-10">
              <button
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                onClick={() => handleFilterChange(null)}
              >
                Sin filtro
              </button>
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-colors"
                  onClick={() => handleFilterChange(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopTableElements;
