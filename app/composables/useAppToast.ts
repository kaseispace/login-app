export const useAppToast = () => {
  const toast = useToast()

  const showSuccess = (message: string, options?: { progress?: boolean }) => {
    toast.add({
      title: 'Success',
      description: message,
      color: 'success',
      progress: options?.progress ?? true,
      ui: {
        title: 'text-green-400',
        description: 'text-gray-900 dark:text-white',
      },
      duration: 5000,
    })
  }

  const showWarning = (message: string, options?: { progress?: boolean }) => {
    toast.add({
      title: 'Warning',
      description: message,
      color: 'warning',
      progress: options?.progress ?? true,
      ui: {
        title: 'text-yellow-400',
        description: 'text-gray-900 dark:text-white',
      },
      duration: 5000,
    })
  }

  const showError = (message: string, options?: { progress?: boolean }) => {
    toast.add({
      title: 'Error',
      description: message,
      color: 'error',
      progress: options?.progress ?? true,
      ui: {
        title: 'text-red-400',
        description: 'text-gray-900 dark:text-white',
      },
      duration: 5000,
    })
  }

  return {
    showSuccess,
    showWarning,
    showError,
  }
}
