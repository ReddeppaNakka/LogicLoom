import { useState } from 'react'
import type { CodeBlock, Lang } from '@/content/types'
import { useApp } from '@/store/useApp'
import { cx } from './ui'
import { Copy, Check } from 'lucide-react'

export const LANG_LABEL: Record<Lang, string> = { python: 'Python', javascript: 'JavaScript', java: 'Java', cpp: 'C++' }
const ORDER: Lang[] = ['python', 'javascript', 'java', 'cpp']

export default function CodeTabs({ code, title, className }: { code: CodeBlock; title?: string; className?: string }) {
  const preferred = useApp((s) => s.profile.preferredLang)
  const available = ORDER.filter((l) => code[l])
  const [lang, setLang] = useState<Lang>(available.includes(preferred) ? preferred : available[0])
  const [copied, setCopied] = useState(false)
  const src = code[lang] ?? code.python

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(src)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className={cx('code-block', className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--line)] bg-[rgba(223,231,224,0.02)]">
        <div className="flex items-center gap-1">
          {title && <span className="eyebrow mr-3">{title}</span>}
          {available.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cx(
                'px-2.5 py-1 rounded-md text-[11.5px] tracking-wide transition-colors',
                l === lang ? 'bg-[rgba(77,163,255,0.14)] text-[#cfe6ff]' : 'text-muted hover:text-bone',
              )}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>
        <button onClick={copy} className="text-muted hover:text-bone transition-colors p-1" title="Copy">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre>
        <code>{src}</code>
      </pre>
    </div>
  )
}
