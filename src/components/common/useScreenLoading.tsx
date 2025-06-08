import { useState, useCallback } from "react"
import { ScreenLoading as BaseScreenLoading, type ScreenLoadingProps } from "./ScreenLoading"

type ScreenLoadingComponentProps = Omit<ScreenLoadingProps, 'isLoading'>

type ScreenLoadingComponentFunction = (props?: ScreenLoadingComponentProps) => JSX.Element

export const useScreenLoading = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(undefined)

  const showLoading = useCallback((message?: string) => {
    if (message) {
      setCurrentMessage(message)
    }
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
    setCurrentMessage(undefined)
  }, [])

  // 修正：最簡潔的寫法
  const withLoading = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      showLoading(message)
      return await asyncFn()
    } finally {
      hideLoading()
    }
  }, [showLoading, hideLoading])

  const ScreenLoading: ScreenLoadingComponentFunction = useCallback(
    (props: ScreenLoadingComponentProps = {}) => {
      return (
        <BaseScreenLoading 
          isLoading={isLoading}
          message={currentMessage || props.message}
          className={props.className}
          portal={props.portal}
          delay={props.delay}
        />
      )
    }, 
    [isLoading, currentMessage]
  )

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
    ScreenLoading
  }
}