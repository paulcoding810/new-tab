import { useEffect, useRef } from 'react'
import { showToast } from './Toast'

export default function MediaUploader({ onFile }) {
  const ref = useRef();

  const clearInput = () => {
    ref.current.value = ""
  }

  const processFile = (file) => {
    if (file && file.type.match(/^(image|video)/)) {
      onFile(file)
    } else {
      console.error('Invalid file type, please upload an image or video.', file)
      showToast('Invalid file type, please upload an image or video.')
    }
    clearInput()
  }

  const handleFileChange = (event) => {
    const newFile = event.target.files[0]
    processFile(newFile)
  }

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items
      if (items) {
        for (let item of items) {
          if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
            const file = item.getAsFile()
            processFile(file)
          }
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  return (
    <div className="w-full p-4 mx-auto text-center border rounded-lg">
      <h2 className="mb-3 text-lg font-semibold">Upload or Paste an Image/Video</h2>

      <input
        type="file"
        ref={ref}
        accept="image/*, video/*"
        onChange={handleFileChange}
        className="block w-full p-2 mb-3 bg-white border rounded"
      />

      <p className="mt-2 text-sm text-gray-500">Or paste an image/video (Ctrl + V)</p>
    </div>
  )
}
