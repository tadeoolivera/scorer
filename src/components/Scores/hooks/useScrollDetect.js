import { useRef, useState, useEffect } from "react"

const useScrollDetect = (dep) => {
  const ref = useRef(null)
  const [hasScroll, setHasScroll] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setHasScroll(el.scrollHeight > el.clientHeight)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [dep])

  return [ref, hasScroll]
}

export default useScrollDetect