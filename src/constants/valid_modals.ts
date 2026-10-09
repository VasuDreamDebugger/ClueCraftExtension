export interface ModelConfig {
  model: string
  name: string
  display: string
}

/**
 * List of valid models that can be used in the application.
 */
export const VALID_MODELS = [
  {
    model: 'gpt-4o-mini',
    name: 'openai_4o_mini',
    display: 'GPT-4o Mini (Fast)',
  },
  {
    model: 'gpt-4o',
    name: 'openai_4o',
    display: 'GPT-4o (Flagship)',
  },
  {
    model: 'gemini-3.5-flash-lite',
    name: 'gemini_3_5_flash',
    display: 'Gemini 2.5 Flash',
  },

  {
    model: 'gemini-3.6-flash',
    name: 'gemini_3_6_flash',
    display: 'Gemini 2.5 Pro',
  },
] satisfies ModelConfig[]

export type ValidModel = (typeof VALID_MODELS)[number]['name']

export const isGeminiModel = (modelName: string | undefined): boolean =>
  VALID_MODELS.some(
    (model) => model.name === modelName && model.model.startsWith('gemini-')
  )
