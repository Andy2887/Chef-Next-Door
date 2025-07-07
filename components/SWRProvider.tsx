"use client"

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

interface SWRProviderProps {
  children: ReactNode
}

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateOnMount: true,
        revalidateIfStale: true,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        dedupingInterval: 2000,
        focusThrottleInterval: 5000,
        onError: (error) => {
          console.error('SWR Error:', error)
          // You can add global error handling here
          // For example, show toast notifications or redirect to login
          if (error.message === 'User not authenticated') {
            // Handle authentication errors globally
            window.location.href = '/login'
          }
        },
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Never retry on 404
          if (error.status === 404) return
          
          // Never retry on authentication errors
          if (error.message === 'User not authenticated') return

          // Only retry up to 3 times
          if (retryCount >= 3) return

          // Retry after 1 second
          setTimeout(() => revalidate({ retryCount }), 1000)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
