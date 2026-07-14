import html2canvas from 'html2canvas'

function comTimeout(promise, ms, mensagem) {
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(mensagem)), ms))
  return Promise.race([promise, timeout])
}

export async function exportElementAsImage(element, filename) {
  element.classList.add('exporting-image')

  try {
    const canvas = await comTimeout(
      html2canvas(element, {
        backgroundColor: '#10111a',
        scale: 2,
        useCORS: true,
      }),
      15000,
      'A exportação demorou demais e foi cancelada. Tente novamente.',
    )

    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    element.classList.remove('exporting-image')
  }
}
