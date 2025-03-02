import { useEffect, useState } from 'react'
import { showToast } from '../components/Toast'
import { settingsStorage } from '../helper'

function Weather() {
  const [weather, setWeather] = useState(null)
  const [coords, setCoords] = useState(null)
  const [unit, setUnit] = useState('C')

  useEffect(() => {
    async function getCoords() {
      const savedCoords = await settingsStorage.get('coords')
      setCoords(savedCoords)

      if (!savedCoords) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newCoords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
            settingsStorage.set('coords', newCoords)
            setCoords(newCoords)
          },
          (error) => {
            showToast(error.message)
            console.error(error)
          },
        )
      }
    }
    getCoords()
  }, [])

  useEffect(() => {
    async function getWeather() {
      const appid = await settingsStorage.get('weatherApiKey')
      const unit = await settingsStorage.get('weatherUnit') ?? 'C'
      setUnit(unit)

      if (!appid) {
        return console.warn('Please provide weather API key in settings')
      }
      if (coords) {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams({
            lat: coords.latitude,
            lon: coords.longitude,
            appid,
            units: unit === 'C' ? 'metric' : 'imperial',
          })}`,
        )
          .then(async (res) => {
            const json = await res.json()
            if (res.ok) {
              setWeather(json)
            } else
              throw new Error(json.message ?? 'Unknown error occurred while fetching weather data.')
          })
          .catch((error) => {
            console.error(error)
            showToast(error.message)
          })
      }
    }

    getWeather()
  }, [coords])

  if (!weather) {
    return null
  }

  return (
    <div className="flex flex-col justify-center p-3 transition-all duration-500 ease-in-out transform rounded-lg shadow-md bg-white/50">
      <p>{weather.name}</p>
      <p>
        {weather.main.temp}&deg;{unit}
      </p>
      {/* <p>Humidity: {weather.main.humidity}%</p>
      <p>Pressure: {weather.main.pressure}hPa</p> */}
      <p className="flex flex-col items-center">
        <img src={`/img/weathers/${weather.weather[0].icon}.png`} />
        {weather.weather[0].description}
      </p>
    </div>
  )
}

export default Weather
