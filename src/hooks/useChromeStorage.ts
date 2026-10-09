import {
  isGeminiModel,
  VALID_MODELS,
  ValidModel,
} from '@/constants/valid_modals'

const DEFAULT_MODEL: ValidModel = 'openai_4o_mini'

export const getProviderKey = (
  model: ValidModel
): 'gemini_key' | 'openai_key' => {
  return isGeminiModel(model) ? 'gemini_key' : 'openai_key'
}

export const useChromeStorage = () => {
  const isChromeStorageAvailable =
    typeof chrome !== 'undefined' && chrome?.storage?.local

  return {
    setKeyModel: async (apiKey: string, model: ValidModel) => {
      const pKey = getProviderKey(model)
      if (isChromeStorageAvailable) {
        await chrome.storage.local.set({ [pKey]: apiKey, [model]: apiKey })
      } else {
        localStorage.setItem(pKey, apiKey)
        localStorage.setItem(model, apiKey)
      }
    },

    getKeyModel: async (model: ValidModel) => {
      const targetModel = model || DEFAULT_MODEL
      const pKey = getProviderKey(targetModel)
      if (isChromeStorageAvailable) {
        const result = await chrome.storage.local.get([pKey, targetModel])
        const apiKey = result[pKey] || result[targetModel] || ''
        return { model: targetModel, apiKey }
      } else {
        const apiKey =
          localStorage.getItem(pKey) || localStorage.getItem(targetModel) || ''
        return { model: targetModel, apiKey }
      }
    },

    setSelectModel: async (model: ValidModel) => {
      if (isChromeStorageAvailable) {
        await chrome.storage.local.set({ ['selectedModel']: model })
      } else {
        localStorage.setItem('selectedModel', model)
      }
    },

    clearKeyModel: async (model: ValidModel) => {
      const pKey = getProviderKey(model)
      if (isChromeStorageAvailable) {
        await chrome.storage.local.remove([pKey, model])
      } else {
        localStorage.removeItem(pKey)
        localStorage.removeItem(model)
      }
    },

    selectModel: async (): Promise<ValidModel> => {
      let rawModel: string | undefined
      if (isChromeStorageAvailable) {
        const result = await chrome.storage.local.get('selectedModel')
        rawModel = result['selectedModel']
      } else {
        rawModel = localStorage.getItem('selectedModel') || undefined
      }

      const isValid = VALID_MODELS.some((item) => item.name === rawModel)
      return isValid ? (rawModel as ValidModel) : DEFAULT_MODEL
    },
  }
}
