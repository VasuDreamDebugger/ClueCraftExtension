export type SupportedPlatform = 'leetcode' | 'learnflow' | 'unknown'

export interface PlatformContext {
  platform: SupportedPlatform
  problemStatement: string
  courseId?: string
  lectureId?: string
  courseTitle?: string
  lectureTitle?: string
  chapterTitle?: string
  courseDescription?: string
  lectureNotes?: string
  route?: string
  completedLectureIds?: string[]
  source?: string
}

const APP_CONTEXT_KEYS = [
  '__LEARNFLOW_CONTEXT__',
  '__LEARNFLOW_APP__',
  '__LEARNFLOW_STATE__',
  '__APP_STATE__',
] as const

const toText = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value.trim() || undefined
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  return undefined
}

const readAppState = () => {
  const state: Record<string, unknown> = {}

  for (const key of APP_CONTEXT_KEYS) {
    const value = (window as Record<string, unknown>)[key]
    if (value && typeof value === 'object') {
      Object.assign(state, value as Record<string, unknown>)
    }
  }

  return state
}

const findFirstText = (...selectors: string[]) => {
  for (const selector of selectors) {
    const node = document.querySelector(selector)
    if (!node) continue
    const text = node.textContent?.trim()
    if (text) return text
  }

  return undefined
}

const normalizeArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const items = value
      .map((entry) => toText(entry))
      .filter((entry): entry is string => Boolean(entry))
    return items.length ? items : undefined
  }

  if (typeof value === 'string') {
    const items = value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    return items.length ? items : undefined
  }

  return undefined
}

export const readLearnFlowContext = (): PlatformContext => {
  const runtimeState = readAppState()
  const root =
    document.querySelector('[data-learnflow-root]') ||
    document.querySelector('[data-course-id]') ||
    document.querySelector('[data-lecture-id]') ||
    document.querySelector('[data-course-title]') ||
    document.querySelector('#root')

  const courseId =
    toText(root?.getAttribute('data-course-id')) ||
    toText(runtimeState.courseId) ||
    toText(runtimeState.course_id) ||
    (() => {
      const match = /\/player\/(.+?)(?:\/|$)/.exec(window.location.pathname)
      return match ? match[1] : undefined
    })()

  const lectureId =
    toText(root?.getAttribute('data-lecture-id')) ||
    toText(runtimeState.lectureId) ||
    toText(runtimeState.lecture_id) ||
    toText(runtimeState.selectedLectureId)

  const courseTitle =
    toText(root?.getAttribute('data-course-title')) ||
    toText(runtimeState.courseTitle) ||
    toText(runtimeState.course_title) ||
    findFirstText(
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'h1',
      '[data-course-title]'
    )

  const lectureTitle =
    toText(root?.getAttribute('data-lecture-title')) ||
    toText(runtimeState.lectureTitle) ||
    toText(runtimeState.lecture_title) ||
    findFirstText('[data-lecture-title]', 'h2', 'h3')

  const chapterTitle =
    toText(root?.getAttribute('data-chapter-title')) ||
    toText(runtimeState.chapterTitle) ||
    toText(runtimeState.chapter_title) ||
    findFirstText('[data-chapter-title]', '.chapter-title')

  const courseDescription =
    toText(runtimeState.courseDescription) ||
    toText(runtimeState.course_description) ||
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content') ||
    findFirstText('[data-course-description]', '.course-description')

  const lectureNotes =
    toText(runtimeState.lectureNotes) ||
    toText(runtimeState.lecture_notes) ||
    document
      .querySelector('[data-lecture-notes]')
      ?.getAttribute('data-lecture-notes') ||
    findFirstText('[data-lecture-notes]', '.lecture-notes')

  const route = window.location.pathname
  const completedLectureIds =
    normalizeArray(runtimeState.lectureCompleted) ||
    normalizeArray(runtimeState.completedLectureIds) ||
    normalizeArray(runtimeState.completedLectures)

  return {
    platform: 'learnflow',
    problemStatement: [
      courseTitle ? `Course: ${courseTitle}` : 'Course overview',
      courseDescription ? `Description: ${courseDescription}` : undefined,
      lectureTitle ? `Selected lecture: ${lectureTitle}` : undefined,
      chapterTitle ? `Chapter: ${chapterTitle}` : undefined,
      courseId ? `Course ID: ${courseId}` : undefined,
      lectureId ? `Lecture ID: ${lectureId}` : undefined,
      completedLectureIds?.length
        ? `Completed lecture IDs: ${completedLectureIds.join(', ')}`
        : undefined,
      lectureNotes ? `Lecture notes: ${lectureNotes}` : undefined,
    ]
      .filter(Boolean)
      .join('\n'),
    courseId,
    lectureId,
    courseTitle,
    lectureTitle,
    chapterTitle,
    courseDescription,
    lectureNotes,
    route,
    completedLectureIds,
    source: root ? 'learnflow-bridge' : 'learnflow-fallback',
  }
}

export const readPageContext = (): PlatformContext => {
  const hostname = window.location.hostname.toLowerCase()
  const pathname = window.location.pathname

  const isLearnFlowPage =
    hostname.includes('learnflow') ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    pathname.startsWith('/player/') ||
    pathname.startsWith('/course/') ||
    pathname.startsWith('/my-enrollments') ||
    pathname.startsWith('/enrollments') ||
    document.body?.hasAttribute('data-learnflow-app') ||
    document.querySelector('[data-learnflow-root]') !== null

  if (isLearnFlowPage) {
    return readLearnFlowContext()
  }

  const metaDescriptionEl = document.querySelector('meta[name="description"]')
  const problemStatement =
    metaDescriptionEl?.getAttribute('content') || document.title

  return {
    platform: 'leetcode',
    problemStatement,
    source: 'leetcode-meta',
  }
}
