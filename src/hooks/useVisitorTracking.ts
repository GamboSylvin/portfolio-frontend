import { useEffect } from 'react'
import api from '@/services/api'

const VISITOR_KEY = 'portfolio-visitor-tracked'

export function useVisitorTracking() {
  useEffect(() => {
    if (sessionStorage.getItem(VISITOR_KEY)) return

    api.post('/visitors').finally(() => {
      sessionStorage.setItem(VISITOR_KEY, 'true')
    })
  }, [])
}
