import ReactDOM from 'react-dom/client'
import { Toast, toastRef } from '../components/Toast'
import './index.css'
import { Options } from './Options'

ReactDOM.createRoot(document.getElementById('app')).render(
  <>
    <Options />
    <Toast ref={toastRef} />
  </>,
)
