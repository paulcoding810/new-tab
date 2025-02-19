import { settingsStorage } from '../helper'
import '../index.css'
import ConfigSection from './ConfigSection'
import MediaSection from './MediaSection'

export const Options = () => {
  return (
    <main className="flex flex-col flex-1 w-screen h-screen py-4 px-[10%]">
      <ConfigSection />
      <hr className="my-2" />
      <MediaSection />
    </main>
  )
}

export default Options
