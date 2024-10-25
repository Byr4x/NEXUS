import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LuPlus, LuSearch, LuFilter, LuArrowDownWideNarrow, LuArrowUpWideNarrow } from 'react-icons/lu';

interface FilterOption {
  key: string;
  label: string;
}

interface TopTableElementsProps {
  onAdd: () => void;
  onSearch: (searchTerm: string) => void;
  onFilter: (field: string | null, order: 'asc' | 'desc') => void;
  filterOptions: FilterOption[];
}

const TopTableElements: React.FC<TopTableElementsProps> = ({ onAdd, onSearch, onFilter, filterOptions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
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
    <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
        onClick={onAdd}
      >
        <LuPlus className="mr-2" /> Agregar
      </motion.button>

      <div className="flex items-center gap-2">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
            <LuSearch />
          </button>
        </form>

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
