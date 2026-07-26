import { useState, useEffect } from 'react'
import Bubbles from './Bubbles'

const i18n = {
  es: {
    subtitle: 'Acorta tus URLs de forma rápida y sencilla',
    placeholder: 'Pega tu URL aquí...',
    shorten: 'Acortar',
    result: 'Tu enlace acortado:',
    copy: 'Copiar',
    copied: '¡Copiado!',
    history: 'Últimos enlaces acortados',
    sleepNotice: '⚠️ El backend y la base de datos se alojan en planes gratuitos que se apagan por inactividad. La disponibilidad del servicio puede variar.',
    footer: 'Hecho con ♥ por Eddy Conejo',
  },
  en: {
    subtitle: 'Shorten your URLs quickly and easily',
    placeholder: 'Paste your URL here...',
    shorten: 'Shorten',
    result: 'Your shortened link:',
    copy: 'Copy',
    copied: 'Copied!',
    history: 'Recent shortened links',
    sleepNotice: '⚠️ The backend and database are hosted on free plans that spin down when inactive. Service availability may vary.',
    footer: 'Made with ♥ by Eddy Conejo',
  },
}

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [lang, setLang] = useState(
    navigator.language.startsWith('es') ? 'es' : 'en'
  )
  const [showNotice, setShowNotice] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(decodeURIComponent(document.cookie.match(/linktrim_history=([^;]+)/)?.[1] ?? '[]'))
    } catch { return [] }
  })

  useEffect(() => {
    document.cookie = `linktrim_history=${encodeURIComponent(JSON.stringify(history))};max-age=${60 * 60 * 24 * 30};path=/`
  }, [history])

  const t = i18n[lang]
  const toggleLang = () => setLang(lang === 'es' ? 'en' : 'es')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Error')
      setShortUrl(data.short_url)
      setHistory(prev => [data.short_url, ...prev.filter(u => u !== data.short_url)].slice(0, 5))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="dark">
      <div className="relative min-h-screen bg-gray-950 text-white flex flex-col">
        <Bubbles />

        <div className="relative z-10 flex justify-end gap-2 p-4">
          <button
            onClick={toggleLang}
            className="text-sm px-3 py-1 rounded-full h-8 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-200 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20A14.5 14.5 0 0 0 12 2"/><path d="M2 12h20"/></svg>
            {lang === 'es' ? 'ES' : 'EN'}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotice(!showNotice)}
              className="text-sm px-3 py-1 rounded-full h-8 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </button>
            {showNotice && (
              <div className="animate-slide-down absolute right-0 mt-2 w-72 bg-gray-900 border border-orange-500 text-gray-300 text-xs rounded-lg p-3 z-50 shadow-lg">
                {t.sleepNotice}
              </div>
            )}
          </div>

        </div>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-[20vh] sm:pt-[30vh] px-4 pb-12">

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-3 text-white neon-text">
            LinkTrim
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mb-10 text-center">
            {t.subtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl flex flex-row gap-3"
          >
            <input
              type="url"
              placeholder={t.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 bg-gray-900 border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-lg px-4 py-3 text-white placeholder-gray-500 transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-lg neon-btn transition-all duration-200 whitespace-nowrap"
            >
              {loading ? '...' : t.shorten}
            </button>
          </form>

          {error && (
            <p className="animate-fade-in mt-4 text-red-400 text-sm">{error}</p>
          )}

          {shortUrl && (
            <div className="animate-fade-in mt-8 w-full max-w-xl bg-gray-900 border border-orange-500 rounded-lg p-5 neon-box flex flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">{t.result}</p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-mono text-sm break-all underline underline-offset-2"
                >
                  {shortUrl}
                </a>
              </div>
              <button
                onClick={handleCopy}
                className="shrink-0 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-200"
              >
                {copied ? t.copied : t.copy}
              </button>
            </div>
          )}
          
          {history.length > 0 && (
            <div className="mt-10 w-full max-w-xl">
              <p className="text-xs text-gray-400 mb-2">{t.history}</p>
              <ul className="flex flex-col gap-1">
                {history.map(link => (
                  <li key={link}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-400 hover:text-orange-300 font-mono text-sm break-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        <footer className="relative z-10 py-4 text-center text-xs text-gray-600">
          {t.footer}
        </footer>
      </div>
    </div>
  )
}

export default App
