/**
 * Accessible inline info bubble. Uses <details>/<summary> so it works
 * without JavaScript, is keyboard-navigable, and gets indexed by search
 * engines (the content is real HTML, not a hover-only tooltip).
 *
 * Renders as a small "ⓘ" icon inline; click/tap/keyboard-activate
 * expands the explanation.
 *
 * Positioning: on mobile the popup is fixed to viewport-center so it can
 * never overhang the screen (icons in table headers or narrow inline text
 * would push a 288px popup off-screen with the old `absolute left-0`).
 * On sm+ it reverts to the compact inline dropdown anchored to the icon.
 */
export default function InfoTip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <details className="inline-block align-middle relative group mx-2">
      <summary
        className="cursor-help select-none list-none inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Learn more about ${label}`}
      >
        i
      </summary>
      <div
        className="
          fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50
          w-auto max-w-none max-h-[70vh] overflow-y-auto
          sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2
          sm:translate-y-0 sm:w-72 sm:max-w-[calc(100vw-2rem)]
          sm:max-h-none sm:overflow-visible
          bg-white border border-gray-300 rounded shadow-lg p-4
          text-xs text-gray-700 font-normal normal-case tracking-normal leading-relaxed
        "
      >
        {children}
      </div>
    </details>
  );
}
