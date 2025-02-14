import { createRef, forwardRef, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'

const toastRef = createRef()

const Toast = forwardRef((props, ref) => {
  const [toast, setToast] = useState(null)

  useImperativeHandle(ref, () => ({
    show: (message, duration = 3000) => {
      setToast({ message })
      setTimeout(() => setToast(null), duration)
    },
  }))

  return createPortal(
    toast && (
      <div className="fixed px-4 py-2 text-white transform -translate-x-1/2 bg-black rounded shadow-lg bottom-5 left-1/2">
        {toast.message}
      </div>
    ),
    document.body,
  )
})

const showToast = (message, duration) => {
  if (toastRef.current) {
    toastRef.current.show(message, duration)
  } else {
    console.error('Toast component is not mounted yet!')
  }
}

Toast.displayName = 'Toast'

export { showToast, Toast, toastRef }
