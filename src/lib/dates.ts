import { addDays, format, parseISO, startOfDay, differenceInCalendarDays, getDay } from 'date-fns'

/** YYYY-MM-DD in local time. */
export const toKey = (d: Date): string => format(d, 'yyyy-MM-dd')
export const fromKey = (key: string): Date => startOfDay(parseISO(key))
export const todayKey = (): string => toKey(new Date())
export const addDaysKey = (key: string, n: number): string => toKey(addDays(fromKey(key), n))
export const daysBetween = (a: string, b: string): number => differenceInCalendarDays(fromKey(b), fromKey(a))
export const weekday = (key: string): number => getDay(fromKey(key)) // 0 = Sunday
export const isStudyDay = (key: string, studyDays: number[]): boolean => studyDays.includes(weekday(key))

/** Next study day on or after `key`. */
export const nextStudyDay = (key: string, studyDays: number[], includeSelf = true): string => {
  let k = includeSelf ? key : addDaysKey(key, 1)
  for (let i = 0; i < 14; i++) {
    if (isStudyDay(k, studyDays)) return k
    k = addDaysKey(k, 1)
  }
  return k
}

export const prettyDate = (key: string): string => format(fromKey(key), 'EEE, d MMM')
export const prettyLong = (key: string): string => format(fromKey(key), 'EEEE, d MMMM yyyy')
export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
