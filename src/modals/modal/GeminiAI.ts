import { GoogleGenAI } from '@google/genai'
import { VALID_MODELS, type ValidModel } from '@/constants/valid_modals'
import {
  GenerateResponseParamsType,
  GenerateResponseReturnType,
  ModalInterface,
} from '@/interface/ModalInterface'
import { outputSchema } from '@/schema/modeOutput'

export class GeminiAI implements ModalInterface {
  name: ValidModel
  private apiKey = ''

  constructor(private readonly modelConfig: (typeof VALID_MODELS)[number]) {
    this.name = modelConfig.name
  }

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(
    props: GenerateResponseParamsType
  ): GenerateResponseReturnType {
    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey })
      const promptText = `${props.systemPrompt}\n\nExtracted User Code:\n${props.extractedCode || ''}\n\nUser Request: ${props.prompt}`

      const response = await ai.models.generateContent({
        model: this.modelConfig.model,
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
