import { ModalInterface } from '@/interface/ModalInterface'
import { VALID_MODELS, type ValidModel } from '@/constants/valid_modals'

import { OpenAI_4o_mini } from '@/modals/modal/OpenAI_4o_mini'
import { OpenAi_4o } from '@/modals/modal/OpenAI_40'
import { GeminiAI } from '@/modals/modal/GeminiAI'

const geminiModals = VALID_MODELS.reduce<
  Partial<Record<ValidModel, ModalInterface>>
>((registered, modelConfig) => {
  if (modelConfig.model.startsWith('gemini-')) {
    registered[modelConfig.name] = new GeminiAI(modelConfig)
  }
  return registered
}, {})

/**
 * This object contains all the modals that are available in the extension.
 * @type {Record<ValidModel, ModalInterface>}
 */
export const modals: Record<ValidModel, ModalInterface> = {
  openai_4o_mini: new OpenAI_4o_mini(),
  openai_4o: new OpenAi_4o(),
  ...geminiModals,
}
