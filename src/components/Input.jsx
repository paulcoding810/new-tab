import { useState } from 'react'

const Input = ({ value, setValue, ...props }) => {
  const [focused, setFocused] = useState(false)

  const borderStyle = focused ? 'border-blue-500' : 'border-gray-400'

  return (
    <input
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`flex flex-1 px-2 py-1 border-2 rounded outline-none ${borderStyle}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  )
}

export default Input
