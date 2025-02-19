import { useState } from 'react'

const Input = ({ value, setValue, ...props }) => {
  const [focused, setFocused] = useState(false)

  const borderStyle = focused ? 'border-blue-500' : ''

  return (
    <input
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
       className={`block w-full p-2 border rounded outline-none ${borderStyle}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  )
}

export default Input
