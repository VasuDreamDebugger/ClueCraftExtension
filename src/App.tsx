import React, { useState } from 'react'

import leetCode from '@/assets/leetcode.png'

import { Button } from '@/components/ui/button'
import Show from '@/components/Show'
import {
  isGeminiModel,
  VALID_MODELS,
  type ValidModel,
} from './constants/valid_modals'
import { HideApiKey } from '@/components/ui/input'
import { useChromeStorage } from './hooks/useChromeStorage'

const Popup: React.FC = () => {
  const [apikey, setApikey] = React.useState<string | null>(null)
  const [model, setModel] = React.useState<ValidModel | null>(null)
  const [selectedModel, setSelectedModel] = React.useState<ValidModel>()
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
  const [isEditingKey, setIsEditingKey] = React.useState<boolean>(false)

  const [isloading, setIsloading] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<{
    state: 'error' | 'success'
    message: string
  } | null>(null)

  const loadStorageData = async () => {
    try {
      const { selectModel, getKeyModel } = useChromeStorage()
      const currentModel = await selectModel()
      setModel(currentModel)
      setSelectedModel(currentModel)

      const keyData = await getKeyModel(currentModel)
      setApikey(keyData.apiKey)
    } catch (err) {
      console.error('Failed to load storage data:', err)
    } finally {
      setIsLoaded(true)
    }
  }

  React.useEffect(() => {
    loadStorageData()
  }, [])

  const handleModelChange = async (v: ValidModel) => {
    if (v) {
      setSubmitMessage(null)
      setIsEditingKey(false)
      const { setSelectModel, getKeyModel } = useChromeStorage()
      await setSelectModel(v)
      setModel(v)
      setSelectedModel(v)

      const keyData = await getKeyModel(v)
      setApikey(keyData.apiKey)
    }
  }

  const handleSaveKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsloading(true)

      const { setKeyModel, setSelectModel } = useChromeStorage()
      if (model && apikey) {
        await setKeyModel(apikey, model)
        await setSelectModel(model)
      }

      setSubmitMessage({
        state: 'success',
        message: `API Key saved for ${selectedModelObj?.display || model}`,
      })
      setIsEditingKey(false)
    } catch (error: any) {
      setSubmitMessage({
        state: 'error',
        message: error.message || 'Failed to save API key',
      })
    } finally {
      setIsloading(false)
    }
  }

  const handleClearKey = async () => {
    if (!model) return
    try {
      setIsloading(true)
      const { clearKeyModel } = useChromeStorage()
      await clearKeyModel(model)
      setApikey('')
      setIsEditingKey(true)
      setSubmitMessage({
        state: 'success',
        message: `API Key cleared for ${selectedModelObj?.display || model}`,
      })
    } catch (error: any) {
      setSubmitMessage({
        state: 'error',
        message: error.message || 'Failed to clear API key',
      })
    } finally {
      setIsloading(false)
    }
  }

  const selectedModelObj = VALID_MODELS.find((m) => m.name === selectedModel)
  const isKeyConfigured = Boolean(apikey && apikey.trim().length > 0)

  return (
    <div className="relative p-4 w-[350px] min-h-[470px] bg-blue-100 text-slate-800 flex flex-col justify-between font-sans border border-sky-100 shadow-2xl shadow-sky-900/10 ">
      <Show show={isLoaded}>
        <div>
          {/* Header */}
          <div className="w-full h-14 flex items-center justify-center gap-2">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-100 to-emerald-100 border border-sky-200/80 shadow-md shadow-sky-100/60 transition-all duration-300 hover:scale-105">
              <img
                className="h-8 w-auto"
                src={leetCode}
                width={32}
                height={32}
                alt="LeetCode Logo"
              />
            </div>
          </div>
          <div className="text-center mt-1">
            <h1 className="font-black text-2xl tracking-tight text-slate-900">
              Clue
              <span className="bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                {' '}
                Craft
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              You Intelligent AI Companion for LeetCode Mastery
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3.5 w-full">
            {/* Always Visible Model Selector Tabs */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">
                  Select AI Model
                </span>
                {isKeyConfigured ? (
                  <span className="text-[10px] bg-emerald-100/90 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300/80 font-bold shadow-sm animate-pulse">
                    ✓ Key Saved
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-100/90 text-amber-700 px-2 py-0.5 rounded-full border border-amber-300/80 font-bold shadow-sm">
                    ⚠ Key Required
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto pr-0.5">
                {VALID_MODELS.map((modelOption) => {
                  const isSelected = selectedModel === modelOption.name
                  const isGemini = modelOption.model.startsWith('gemini-')
                  return (
                    <button
                      key={modelOption.name}
                      type="button"
                      onClick={() => handleModelChange(modelOption.name)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all duration-200 text-xs font-medium cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-50/90 via-teal-50/90 to-emerald-50/90 border-sky-400 text-slate-900 shadow-md shadow-sky-100/60 font-semibold ring-1 ring-sky-400/40'
                          : 'bg-white/80 border-slate-200/80 text-slate-600 hover:bg-sky-50/60 hover:border-sky-300 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full transition-all ${
                            isSelected
                              ? 'bg-emerald-500 scale-110 shadow-sm shadow-emerald-400'
                              : 'bg-slate-300'
                          }`}
                        />
                        <span>{modelOption.display}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                          isGemini
                            ? 'bg-sky-100 text-sky-700 border border-sky-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isGemini ? 'Gemini' : 'OpenAI'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Key Status & Input Form */}
            {isKeyConfigured && !isEditingKey ? (
              <div className="p-3.5 rounded-xl border border-sky-200/80 bg-white/90 backdrop-blur-md flex flex-col gap-3 shadow-md shadow-sky-100/60 transition-all duration-300 hover:border-sky-300">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                    Provider Key Status
                  </span>
                  <span className="text-xs text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    ••••{apikey?.slice(-4)}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Ready to provide AI hints for{' '}
                  <strong className="text-slate-900 font-bold">
                    {selectedModelObj?.display}
                  </strong>
                  .
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={() => setIsEditingKey(true)}
                    variant="outline"
                    className="flex-1 text-xs h-8 border-sky-300 bg-sky-50/80 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-all duration-200 font-semibold rounded-lg"
                  >
                    Edit Key
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearKey}
                    disabled={isloading}
                    className="flex-1 text-xs h-8 border-rose-200 bg-rose-50/80 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 font-semibold rounded-lg"
                  >
                    Clear Key
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSaveKey}
                className="flex flex-col gap-3 w-full p-3.5 rounded-xl border border-sky-200/80 bg-white/90 backdrop-blur-md shadow-md shadow-sky-100/60"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="api-key-input"
                    className="text-xs font-bold text-slate-700"
                  >
                    API Key for {selectedModelObj?.display}
                  </label>
                  <HideApiKey
                    id="api-key-input"
                    value={apikey || ''}
                    onChange={(e) => setApikey(e.target.value)}
                    placeholder={
                      isGeminiModel(selectedModel)
                        ? 'Enter Gemini API Key (AIzaSy...)'
                        : 'Enter OpenAI API Key (sk-...)'
                    }
                    disabled={!model}
                    required
                    iclassName="bg-slate-50 border-sky-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 rounded-xl"
                  />
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {isGeminiModel(selectedModel) ? (
                      <span>
                        Need a key? Get a free Gemini API Key at{' '}
                        <a
                          href="https://aistudio.google.com/app/apikey"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 hover:text-emerald-600 font-bold hover:underline"
                        >
                          Google AI Studio
                        </a>
                      </span>
                    ) : (
                      <span>
                        Need a key? Get an OpenAI API Key at{' '}
                        <a
                          href="https://platform.openai.com/api-keys"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-600 hover:text-emerald-600 font-bold hover:underline"
                        >
                          OpenAI Platform
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <Button
                    disabled={isloading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all duration-200 rounded-xl"
                  >
                    {isKeyConfigured
                      ? 'Save & Use Model'
                      : 'Save & Activate Key'}
                  </Button>
                  {isEditingKey && isKeyConfigured && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsEditingKey(false)}
                      className="w-full text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 h-7 rounded-lg"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>

          {submitMessage && (
            <div
              className="mt-3 text-center text-xs p-2.5 rounded-xl border backdrop-blur-md transition-all animate-in fade-in font-medium"
              style={{
                color: submitMessage.state === 'error' ? '#e11d48' : '#059669',
                borderColor:
                  submitMessage.state === 'error'
                    ? 'rgba(225, 29, 72, 0.3)'
                    : 'rgba(5, 150, 105, 0.3)',
                backgroundColor:
                  submitMessage.state === 'error'
                    ? 'rgba(244, 63, 94, 0.08)'
                    : 'rgba(16, 185, 129, 0.08)',
              }}
            >
              {submitMessage.message}
            </div>
          )}
        </div>
      </Show>

      <div className="mt-4 text-center border-t border-sky-100 pt-3">
        <p className="text-xs text-slate-500">
          Want more features?{' '}
          <a
            href="https://github.com/piyushgarg-dev/leetcode-whisper-chrome-extension/issues/new"
            className="text-sky-600 hover:text-emerald-600 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Request a feature!
          </a>
        </p>
      </div>
    </div>
  )
}

export default Popup
