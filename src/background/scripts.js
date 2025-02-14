function showLoading() {
  let div = document.querySelector('.newtab-progress')
  if (!div) {
    div = document.createElement('div')
    div.style = ` position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #1f2937; color: white; padding: 16px; font-size: 24px; border: 1px solid black; z-index: 9999`
    div.className = 'newtab-progress'
  }

  div.style.display = 'block'
  div.textContent = 'Loading...'

  document.body.appendChild(div)
}

function showSuccess() {
  const div = document.querySelector('.newtab-progress')
  if (div) {
    div.textContent = 'Success'
  }
}

function showError() {
  const div = document.querySelector('.newtab-progress')
  if (div) {
    div.textContent = 'Error'
  }
}

function hideLoading() {
  const div = document.querySelector('.newtab-progress')
  if (div) {
    setTimeout(() => {
      div.style.display = 'none'
    }, 1500);
  }
}

export { hideLoading, showError, showLoading, showSuccess }
