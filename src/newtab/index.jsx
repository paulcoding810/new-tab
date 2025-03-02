import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toast, toastRef } from '../components/Toast'
import { NewTab } from './NewTab'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <NewTab />
    <Toast ref={toastRef} />
  </React.StrictMode>,
)
