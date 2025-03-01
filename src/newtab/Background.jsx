import ColorThief from 'colorthief'
import { createRef, memo, useEffect } from 'react'
import { rgbToHex } from './utils'

const colorThief = new ColorThief()

const Background = ({ media, blur = 0, width, height, onColorThief = null, ...props }) => {
  const imgRef = createRef()
  let style = {
    filter: `blur(${(blur * 20) / 100}px)`, // max 20px
    width,
    height,
  }

  // reset color thief on video change
  useEffect(() => {
    if (media.blob && media.blob.type.startsWith('video')) {
      onColorThief?.(null)
    }
  }, [media])

  if (media.blob) {
    const objectUrl = URL.createObjectURL(media.blob)

    if (media.blob.type.startsWith('image')) {
      return (
        <img
          ref={imgRef}
          onLoad={() => {
            const img = imgRef.current
            const result = colorThief.getColor(img, 25)
            onColorThief?.(rgbToHex(result))
          }}
          className="pointer-events-none object-cover w-full h-full blur-[10px]"
          src={objectUrl}
          style={style}
        />
      )
    } else if (media.blob.type.startsWith('video')) {
      return (
        <video
          style={style}
          className="object-cover w-full h-full"
          src={objectUrl}
          autoPlay={props.autoPlay ?? true}
          controls={props.controls ?? false}
          loop
          muted
        />
      )
    }
  }
}

export default memo(Background)
