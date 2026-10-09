import {
  GenerateResponseParamsType,
  GenerateResponseReturnType,
  ModalInterface,
} from '../../interface/ModalInterface'
import { GoogleGenAI } from '@google/genai'
import { VALID_MODELS } from '@/constants/valid_modals'
import { outputSchema } from '@/schema/modeOutput'

export class GeminiAI_1_5_pro implements ModalInterface {
  name = 'gemini_1.5_pro'
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
      const targetModel = modelConfig?.model || 'gemini-1.5-pro-latest'

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
