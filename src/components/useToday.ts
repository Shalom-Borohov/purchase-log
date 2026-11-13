import { useEffect, useState } from 'react'
import { todayDate } from '../domain/dayDate'

const VISIBILITY_EVENT = 'visibilitychange'

const readToday = () => todayDate(new Date())

export function useToday() {
  const [today, setToday] = useState(readToday)

  useEffect(() => {
    const refresh = () => setToday(readToday())

    document.addEventListener(VISIBILITY_EVENT, refresh)

    return () => document.removeEventListener(VISIBILITY_EVENT, refresh)
  }, [])

  return today
}
