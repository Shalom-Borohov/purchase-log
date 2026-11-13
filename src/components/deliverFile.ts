const SHARE_CANCELLED_ERROR = 'AbortError'

const SHARE_TAP_EXPIRED_ERROR = 'NotAllowedError'

const DOWNLOAD_URL_LIFETIME_MS = 60_000

export type DeliveryOutcome = 'delivered' | 'needsAnotherTap'

const isDomError = (error: unknown, name: string) => error instanceof DOMException && error.name === name

export async function shareFile(file: File): Promise<DeliveryOutcome> {
  try {
    await navigator.share({ files: [file] })
  } catch (error) {
    if (isDomError(error, SHARE_TAP_EXPIRED_ERROR)) {
      return 'needsAnotherTap'
    }

    if (!isDomError(error, SHARE_CANCELLED_ERROR)) {
      throw error
    }
  }

  return 'delivered'
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = file.name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), DOWNLOAD_URL_LIFETIME_MS)
}

export async function deliverFile(file: File): Promise<DeliveryOutcome> {
  if (navigator.canShare?.({ files: [file] })) {
    return shareFile(file)
  }

  downloadFile(file)

  return 'delivered'
}
