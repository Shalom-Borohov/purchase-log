import type { ReactNode } from 'react'

type SolidIconProps = {
  size: number
  viewBox?: string
  children: ReactNode
}

const VIEW_BOX = '0 0 24 24'

const CHEVRON_VIEW_BOX = '0 0 12 20'

function SolidIcon({ size, viewBox = VIEW_BOX, children }: SolidIconProps) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill="currentColor" aria-hidden="true">
      {children}
    </svg>
  )
}

const CAMERA_PATH =
  'M9 4h6l1.6 2.2H20a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.2a2 2 0 0 1 2-2h3.4zm3 4.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm0 2a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z'

export const CameraIcon = ({ size = 30 }: { size?: number }) => (
  <SolidIcon size={size}>
    <path fillRule="evenodd" d={CAMERA_PATH} />
  </SolidIcon>
)

export const PurchasesIcon = () => (
  <SolidIcon size={26}>
    <path d="M7 7a5 5 0 0 1 10 0h2.2a1 1 0 0 1 1 .9l1 12a1.5 1.5 0 0 1-1.5 1.6H4.3a1.5 1.5 0 0 1-1.5-1.6l1-12a1 1 0 0 1 1-.9zm2 0h6a3 3 0 0 0-6 0z" />
  </SolidIcon>
)

export const ShopsIcon = () => (
  <SolidIcon size={26}>
    <path d="M4 3h16l2 6a3 3 0 0 1-5 2.2 3 3 0 0 1-5 0 3 3 0 0 1-5 0A3 3 0 0 1 2 9zM4 13.2a4.6 4.6 0 0 0 3-.4 4.6 4.6 0 0 0 5 0 4.6 4.6 0 0 0 5 0 4.6 4.6 0 0 0 3 .4V20a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
  </SolidIcon>
)

export const SummaryIcon = () => (
  <SolidIcon size={26}>
    <rect x="3" y="12" width="5" height="9" rx="1.5" />
    <rect x="9.5" y="4" width="5" height="17" rx="1.5" />
    <rect x="16" y="8" width="5" height="13" rx="1.5" />
  </SolidIcon>
)

export const SettingsIcon = () => (
  <SolidIcon size={26}>
    <path
      fillRule="evenodd"
      d="M10.3 2h3.4l.5 2.6a7.6 7.6 0 0 1 1.9 1.1l2.5-.9 1.7 2.9-2 1.8a7.7 7.7 0 0 1 0 2.2l2 1.8-1.7 2.9-2.5-.9a7.6 7.6 0 0 1-1.9 1.1l-.5 2.6h-3.4l-.5-2.6a7.6 7.6 0 0 1-1.9-1.1l-2.5.9-1.7-2.9 2-1.8a7.7 7.7 0 0 1 0-2.2l-2-1.8 1.7-2.9 2.5.9a7.6 7.6 0 0 1 1.9-1.1zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z"
    />
  </SolidIcon>
)

export const SearchIcon = () => (
  <SolidIcon size={18}>
    <path d="M10.5 3a7.5 7.5 0 0 1 6 12l4.3 4.3-1.5 1.5-4.3-4.3A7.5 7.5 0 1 1 10.5 3zm0 2.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z" />
  </SolidIcon>
)

export const CalendarIcon = () => (
  <SolidIcon size={18}>
    <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zM4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9zm9 3h4v4h-4z" />
  </SolidIcon>
)

export const ReturnIcon = () => (
  <SolidIcon size={18}>
    <path d="M9.7 3.3a1 1 0 0 1 0 1.4L7.4 7H14a7 7 0 0 1 0 14H8a1 1 0 1 1 0-2h6a5 5 0 0 0 0-10H7.4l2.3 2.3a1 1 0 1 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 0z" />
  </SolidIcon>
)

export const ReceiptIcon = () => (
  <SolidIcon size={20}>
    <path d="M5 2h14a1 1 0 0 1 1 1v18.2a.6.6 0 0 1-1 .5l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-1 .7V3a1 1 0 0 1 1-1zm3 5a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm0 4a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2z" />
  </SolidIcon>
)

export const RetakeIcon = () => (
  <SolidIcon size={18}>
    <path d="M12 3a9 9 0 0 1 8.5 6H22a.6.6 0 0 1 .4 1l-3 3.4a.6.6 0 0 1-.8 0l-3-3.4a.6.6 0 0 1 .4-1h1.4A6.5 6.5 0 1 0 18 15.4a1.2 1.2 0 0 1 2.1 1.2A9 9 0 1 1 12 3z" />
  </SolidIcon>
)

export const RemoveIcon = () => (
  <SolidIcon size={16}>
    <path d="M5.6 3.5 12 9.9l6.4-6.4a1.5 1.5 0 0 1 2.1 2.1L14.1 12l6.4 6.4a1.5 1.5 0 0 1-2.1 2.1L12 14.1l-6.4 6.4a1.5 1.5 0 0 1-2.1-2.1L9.9 12 3.5 5.6a1.5 1.5 0 0 1 2.1-2.1z" />
  </SolidIcon>
)

export const PlusIcon = () => (
  <SolidIcon size={12} viewBox="0 0 12 12">
    <rect x="5" y="0" width="2" height="12" rx="1" />
    <rect x="0" y="5" width="12" height="2" rx="1" />
  </SolidIcon>
)

export const ChevronIcon = () => (
  <SolidIcon size={14} viewBox={CHEVRON_VIEW_BOX}>
    <path d="M10.4 1.2a1.6 1.6 0 0 0-2.3 0L.7 8.7a1.8 1.8 0 0 0 0 2.6l7.4 7.5a1.6 1.6 0 0 0 2.3-2.3L4 10l6.4-6.5a1.6 1.6 0 0 0 0-2.3z" />
  </SolidIcon>
)

export const LibraryIcon = () => (
  <SolidIcon size={20}>
    <path
      fillRule="evenodd"
      d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v9.6l3.6-3.4a1.4 1.4 0 0 1 1.9 0l2.3 2.1 2.4-2.2a1.4 1.4 0 0 1 1.9 0l1.9 1.8V6a1 1 0 0 0-1-1zm3.5 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
    />
  </SolidIcon>
)

export const ShareIcon = () => (
  <SolidIcon size={20}>
    <path d="M12 2.6a1 1 0 0 1 .7.3l3.5 3.5a1 1 0 0 1-1.4 1.4L13 6v8a1 1 0 1 1-2 0V6L9.2 7.8a1 1 0 0 1-1.4-1.4l3.5-3.5a1 1 0 0 1 .7-.3zM6 10h2a1 1 0 1 1 0 2H7v7h10v-7h-1a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
  </SolidIcon>
)

export const ImportIcon = () => (
  <SolidIcon size={20}>
    <path d="M12 3a1 1 0 0 1 1 1v8l1.8-1.8a1 1 0 0 1 1.4 1.4l-3.5 3.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 0 1 1.4-1.4L11 12V4a1 1 0 0 1 1-1zM6 10h1a1 1 0 1 1 0 2v7h10v-7a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
  </SolidIcon>
)

export const ChatIcon = () => (
  <SolidIcon size={20}>
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7.6l-4.2 3.4A.8.8 0 0 1 6 19.8V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  </SolidIcon>
)

export const BagGlyph = () => (
  <SolidIcon size={40}>
    <path d="M7 7a5 5 0 0 1 10 0h2.2a1 1 0 0 1 1 .9l1 12a1.5 1.5 0 0 1-1.5 1.6H4.3a1.5 1.5 0 0 1-1.5-1.6l1-12a1 1 0 0 1 1-.9zm2 0h6a3 3 0 0 0-6 0z" />
  </SolidIcon>
)
