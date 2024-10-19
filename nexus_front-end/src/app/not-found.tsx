import React from 'react';
import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center p-8 max-w-lg">
        <div className="mb-8">
          <img
            src="https://res.cloudinary.com/db5lqptwu/image/upload/v1729351890/logos/404plabot.png"
            alt="404 Robot"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Página no encontrada
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link 
          href="/" 
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-block"
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
