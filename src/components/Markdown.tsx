import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cx } from './ui'

export default function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cx('prose-sys', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
