/**
 * The Japanese labels used as decoration throughout the interface, with their
 * reading and their English meaning.
 *
 * They come from the visual language this app borrows from: the Kage reference
 * site and Solo Leveling's "System" windows. Nothing depends on reading them,
 * but a reader should never meet a word they cannot look up, so every one is
 * hoverable and can be swapped for English in Appearance.
 */
export interface KanjiGloss {
  /** Romanised reading. */
  reading: string
  /** Short English equivalent, used when English labels are turned on. */
  en: string
}

export const KANJI: Record<string, KanjiGloss> = {
  // Brand mark
  影: { reading: 'kage', en: 'Shadow' },

  // Navigation
  状態: { reading: 'joutai', en: 'Status' },
  門: { reading: 'mon', en: 'Gate' },
  型: { reading: 'kata', en: 'Form' },
  暦: { reading: 'koyomi', en: 'Calendar' },
  鍛: { reading: 'kitae', en: 'Forge' },
  題: { reading: 'dai', en: 'Problems' },
  記: { reading: 'ki', en: 'Record' },
  書: { reading: 'sho', en: 'Write' },
  彩: { reading: 'sai', en: 'Colour' },
  設: { reading: 'setsu', en: 'Setup' },

  // Section labels
  学: { reading: 'gaku', en: 'Study' },
  日課: { reading: 'nikka', en: 'Daily routine' },
  現在: { reading: 'genzai', en: 'Now' },
  能力: { reading: 'nouryoku', en: 'Ability' },
  背景: { reading: 'haikei', en: 'Background' },
  色: { reading: 'iro', en: 'Colour' },
  診断: { reading: 'shindan', en: 'Diagnosis' },
  試練: { reading: 'shiren', en: 'Trial' },
  難度: { reading: 'nando', en: 'Difficulty' },
  速: { reading: 'soku', en: 'Speed' },

  // Moments
  覚醒: { reading: 'kakusei', en: 'Awakening' },
  登録: { reading: 'touroku', en: 'Registration' },
  通知: { reading: 'tsuuchi', en: 'Notification' },
  完了: { reading: 'kanryou', en: 'Complete' },
  休息: { reading: 'kyuusoku', en: 'Rest' },
  静寂: { reading: 'seijaku', en: 'Stillness' },
  空白: { reading: 'kuuhaku', en: 'Blank' },
}

/** Tooltip text for a label, e.g. "Gate · mon (門)". Falls back to the raw text. */
export const glossOf = (text: string): string => {
  const g = KANJI[text]
  return g ? `${g.en} · ${g.reading} (${text})` : text
}

export const englishOf = (text: string): string => KANJI[text]?.en ?? text
