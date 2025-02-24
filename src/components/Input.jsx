import { useState } from 'react'

const Input = ({ value, setValue, selectOnFocus = false, ...props }) => {
  const [focused, setFocused] = useState(false)

  const borderStyle = focused ? 'border-blue-500' : ''

  const onFocus = (event) => {
    selectOnFocus && event.target.select()
    setFocused(true)
  }

  return (
    <input
      onFocus={onFocus}
      onBlur={() => setFocused(false)}
      className={`block w-full p-2 h-10 border rounded outline-none ${borderStyle}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  )
}

export default Input
