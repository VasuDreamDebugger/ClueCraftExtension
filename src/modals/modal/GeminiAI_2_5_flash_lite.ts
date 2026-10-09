import {
  GenerateResponseParamsType,
  GenerateResponseReturnType,
  ModalInterface,
} from '../../interface/ModalInterface'
import { GoogleGenAI } from '@google/genai'
import { VALID_MODELS } from '@/constants/valid_modals'
import { outputSchema } from '@/schema/modeOutput'

export class GeminiAI_2_5_flash_lite implements ModalInterface {
  name = 'gemini_2_5_flash_lite'
  private apiKey: string = ''

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(
    props: GenerateResponseParamsType
  ): GenerateResponseReturnType {
    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey })
      const modelConfig = VALID_MODELS.find((model) => model.name === this.name)
      const targetModel = modelConfig?.model || 'gemini-2.5-flash-lite'

      const promptText = `${props.systemPrompt}\n\nExtracted User Code:\n${props.extractedCode || ''}\n\nUser Request: ${props.prompt}`

      const response = await ai.models.generateContent({
        model: targetModel,
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      })

      const rawText = response.text || ''
      const parsedObject = JSON.parse(rawText)
      const validatedData = outputSchema.parse(parsedObject)

      return {
        error: null,
        success: validatedData,
      }
    } catch (error: any) {
      return { error, success: null }
    }
  }
}
