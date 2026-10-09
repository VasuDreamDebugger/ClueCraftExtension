export const EXTENSION_HOST_ID = '__leetcode_ai_whisper_container'

export const getExtensionPortalContainer = (): HTMLElement | undefined =>
  document
    .getElementById(EXTENSION_HOST_ID)
    ?.shadowRoot?.getElementById('__leetcode_ai_whisper_portals') ?? undefined
