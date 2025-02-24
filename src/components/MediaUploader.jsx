import { useEffect, useRef, useState } from 'react'
import { showToast } from './Toast'

export default function MediaUploader({ onFiles }) {
  const [isDragging, setIsDragging] = useState(false)

  const ref = useRef()

  const clearInput = () => {
    ref.current.value = ''
  }

  const filterMediaFiles = (files) => {
    const filteredFiles = Array.from(files).filter(
      (file) => file instanceof File && file.type.match(/^video\/.*|image\/.*/),
    )
    return filteredFiles
  }

  const handleUploadedFiles = (event) => {
    const files = filterMediaFiles(event.target.files) // spread FileList and filter media files
    if (files.length === 0) {
      showToast('No valid files were uploaded')
    } else {
      onFiles(files)
    }
    clearInput()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    handleUploadedFiles({ target: { files: event.dataTransfer.files ?? [] } })
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handlePaste = (event) => {
      if (!event.clipboardData) {
        showToast('Paste not supported. Please upload the file manually.')
        return
      }
      const files = filterMediaFiles(
        Array.from(event.clipboardData.items).map((item) => item.getAsFile()),
      ) // spread ClipboardItems and filter media files
      if (files.length !== 0) {
        onFiles(files)
      } else {
        showToast('No valid files were pasted')
      }
      clearInput()
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  return (
    <div
      className={`w-full p-4 mx-auto text-center border rounded-lg ${isDragging ? 'bg-blue-100 border-blue-500' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragging(false)}
    >
      <h2 className="mb-3 text-lg font-semibold">Upload or Paste an Image/Video</h2>

      <input
        type="file"
        multiple
        ref={ref}
        accept="image/*, video/*"
        onChange={handleUploadedFiles}
        className="block w-full p-2 mb-3 bg-white border rounded"
      />

      <p className="mt-2 text-sm text-gray-500">Or paste an image/video (Ctrl + V)</p>
    </div>
  )
}
