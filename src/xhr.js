export function fetchMedia(url, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded * 100) / event.total))
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject('Failed to load media')
      }
    }

    xhr.onerror = (e) => {
      console.error('Failed to fetch media: ', url, e)
      reject('Request failed')
    }

    xhr.send()
  })
}
