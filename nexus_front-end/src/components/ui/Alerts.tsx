import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface AlertOptions {
  title: string;
  icon: 'success' | 'error' | 'warning' | 'info' | 'question';
  text?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const showAlert = (
  options: AlertOptions,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  MySwal.fire({
    title: options.title,
    icon: options.icon,
    text: options.text,
    showCancelButton: options.showCancelButton,
    confirmButtonText: options.confirmButtonText,
    cancelButtonText: options.cancelButtonText,
    customClass: {
      popup: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl',
      title: 'text-2xl font-bold text-gray-900 dark:text-gray-100',
      htmlContainer: 'text-lg text-gray-700',
      confirmButton: 'bg-green-500 hover:bg-green-600 text-white text-lg rounded-xl m-1 px-6 py-3',
      cancelButton: 'bg-red-500 hover:bg-red-600 text-white text-lg rounded-xl m-1 px-6 py-3',
    },
    buttonsStyling: false,
    width: '32rem',
    padding: '2rem',
  }).then((result) => {
    if (result.isConfirmed) {
      if (onConfirm) onConfirm();
    } else {
      if (onCancel) onCancel();
    }
  });
};

export const showToast = (
  message: string,
  icon: 'success' | 'error' | 'warning' | 'info',
  focus: string = ''
) => {
  if (!message) return;
  onFocus(focus);
  
  const toast = MySwal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: getIconColor(icon),
    width: 'auto',
    padding: '0.5rem',
    customClass: {
      icon: 'swal2-icon-small' // Clase personalizada para el icono
    }
  });

  toast.fire({
    icon,
    title: message,
    iconColor: 'white',
    color: 'white',
  });
};

const getIconColor = (icon: string): string => {
  switch (icon) {
    case 'success':
      return '#10B981'; // green-500
    case 'error':
      return '#EF4444'; // red-500
    case 'warning':
      return '#F59E0B'; // amber-500
    case 'info':
      return '#3B82F6'; // blue-500
    default:
      return '#6B7280'; // gray-500
  }
};

const onFocus = (focus: string) => {
  if (focus !== '') {
    document.getElementById(focus)?.focus();
  }
};