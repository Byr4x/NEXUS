'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center p-4 max-w-lg">
        <div className="mb-4">
          <img
            src="https://res.cloudinary.com/db5lqptwu/image/upload/v1729351890/logos/404plabot.png"
            alt="404 Robot"
            className="mx-auto w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
          />
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Página no encontrada
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4">
          Lo sentimos, la página que buscas no existe.
        </p>
        <button 
          onClick={() => router.back()}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 inline-block"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default NotFound;
