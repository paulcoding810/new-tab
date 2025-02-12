import { useEffect, useState } from 'react'

const getTime = () => {
  const date = new Date()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${hour}:${minute}`
}

const Time = () => {
  useEffect(() => {
    let intervalId = setInterval(() => {
      setTime(getTime())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const [time, setTime] = useState(getTime())

  return (
    <div className="flex items-center self-center justify-center p-3 rounded-lg shadow-md bg-white/50">
      <h1 className="text-5xl font-bold text-center text-blue-700">{time}</h1>
    </div>
  )
}

export default Time
