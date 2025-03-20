import { useEffect } from 'react'

declare global {
  interface Window {
    hj: {
      (...args: unknown[]): void
      q?: unknown[]
    }
    _hjSettings: { hjid: number; hjsv: number }
  }
}

const useHotjar = (hjid: number, hjsv: number) => {
  useEffect(() => {
    ;(function (
      h: Window,
      o: Document,
      t: string,
      j: string,
      a?: HTMLHeadElement,
      r?: HTMLScriptElement
    ) {
      h.hj =
        h.hj ||
        function (...args: unknown[]) {
          ;(h.hj.q = h.hj.q || []).push(args)
        }
      h._hjSettings = { hjid, hjsv }
      a = o.getElementsByTagName('head')[0] as HTMLHeadElement
      r = o.createElement('script')
      r.async = true
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
  }, [hjid, hjsv])
}

export default useHotjar
