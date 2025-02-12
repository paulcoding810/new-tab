const Background = ({ media, blur, width, height, ...props }) => {
  let style = {
    filter: `blur(${blur ?? 0}px)`,
    width,
    height,
  }

  if (media.blob) {
    const objectUrl = URL.createObjectURL(media.blob)

    if (media.blob.type.startsWith('image')) {
      return (
        <img
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

export default Background
