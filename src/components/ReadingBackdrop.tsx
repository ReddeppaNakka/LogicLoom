/**
 * Static backdrop for reading and practice pages.
 *
 * Deliberately has NO animation and no canvas: moving particles behind a
 * paragraph pull the eye away from the line you are on. This is a fixed,
 * slightly warmer ground with a single soft glow at the top and a vignette,
 * so the text column reads as a lit page in a dark room.
 */
export default function ReadingBackdrop() {
  return (
    <div className="reading-backdrop" aria-hidden>
      <div className="reading-backdrop__glow" />
      <div className="reading-backdrop__vignette" />
    </div>
  )
}
