import { deliverFile } from '../../components/deliverFile'

const CALENDAR_EXTENSION = '.ics'

const CALENDAR_MIME_TYPE = 'text/calendar'

export const handOverCalendarEvent = (name: string, eventText: string) =>
  deliverFile(new File([eventText], `${name}${CALENDAR_EXTENSION}`, { type: CALENDAR_MIME_TYPE }))
