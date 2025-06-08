import { create } from 'zustand'
import { Video, VideoStatus } from '../services/type'
import { fetchVideoStatus } from '../services/section-management.service'

interface VideoManagementState {
    videos: Record<string, Video>
    intervals: Record<string, NodeJS.Timeout>
}

interface VideoManagementAction {
    // 添加影片並開始輪詢
    addVideo: (video: Video) => void
    // 更新影片狀態
    updateStatus: (sectionId: string, status: VideoStatus['uploadStatus']) => void
    // 獲取單個影片
    getVideo: (sectionId: string) => Video | undefined
    // 開始輪詢特定影片
    startPolling: (sectionId: string) => void
    // 停止輪詢特定影片
    stopPolling: (sectionId: string) => void
    // 檢查影片狀態 (API 調用)
    checkVideoStatus: (sectionId: string) => Promise<void>
}


export const useVideoManagementStore = create<VideoManagementState & VideoManagementAction>((set, get) => ({
    videos: {},
    intervals: {},

    addVideo: (video) => {
        set((state) => ({
            videos: { ...state.videos, [video.id]: video }
        }))

        // 如果是 processing 狀態，開始輪詢
        if (video.uploadStatus === 'processing') {
            get().startPolling(video.id)
        }
    },

    updateStatus: (sectionId, status) => {
        set((state) => ({
            videos: {
                ...state.videos,
                [sectionId]: { ...state.videos[sectionId], uploadStatus: status }
            }
        }))

        // 如果完成或失敗，停止輪詢
        if (status === 'completed' || status === 'failed') {
            get().stopPolling(sectionId)
        }
    },

    getVideo: (sectionId) => {
        return get().videos[sectionId]
    },

    startPolling: (sectionId) => {
        // 先停止現有的輪詢
        get().stopPolling(sectionId)

        // 開始新的輪詢，每 3 秒檢查一次
        const interval = setInterval(() => {
            get().checkVideoStatus(sectionId)
        }, 3000)

        set((state) => ({
            intervals: { ...state.intervals, [sectionId]: interval }
        }))
    },

    stopPolling: (sectionId) => {
        const { intervals } = get()
        if (intervals[sectionId]) {
            clearInterval(intervals[sectionId])
            set((state) => {
                const newIntervals = { ...state.intervals }
                delete newIntervals[sectionId]
                return { intervals: newIntervals }
            })
        }
    },

    checkVideoStatus: async (sectionId: string) => {
        try {
            // 調用你的查詢 API
            const response = await fetchVideoStatus(sectionId)
            const { uploadStatus } = response
            // 更新狀態
            get().updateStatus(sectionId, uploadStatus)

        } catch (error) {
            console.error('檢查狀態失敗(checkVideoStatus in videoStore failed):', error)
        }
    }
}))