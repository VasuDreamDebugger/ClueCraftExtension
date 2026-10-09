import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import ContentPage from '@/content/content'
import contentStyles from './index.css?inline'
import { EXTENSION_HOST_ID } from '@/content/shadowDom'

const root = document.createElement('div')
root.id = EXTENSION_HOST_ID
root.style.setProperty('all', 'initial', 'important')
root.style.setProperty('display', 'block', 'important')
root.style.setProperty('position', 'fixed', 'important')
root.style.setProperty('inset', '0', 'important')
root.style.setProperty('z-index', '2147483647', 'important')
root.style.setProperty('pointer-events', 'none', 'important')

const shadowRoot = root.attachShadow({ mode: 'open' })
const style = document.createElement('style')
style.textContent = contentStyles
shadowRoot.append(style)

const appRoot = document.createElement('div')
const portalRoot = document.createElement('div')
portalRoot.id = '__leetcode_ai_whisper_portals'
shadowRoot.append(appRoot, portalRoot)
document.documentElement.append(root)

createRoot(appRoot).render(
  <StrictMode>
    <ContentPage />
  </StrictMode>
)
