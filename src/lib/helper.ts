import axios from 'axios';
import { useDialogStore } from '@/stores/commonDialogStore'; // 請依你的實際路徑調整

export function handleErrorMessageDialog(error: unknown) {

    const showCommonDialog = useDialogStore.getState().showCommonDialog;

    if (axios.isAxiosError(error) && error.response?.data) {
        const { message } = error.response.data;
        showCommonDialog({
            type: "failed",
            message,
        });
    } else {
        showCommonDialog({
            type: "failed",
            message: '發生未知錯誤，請稍後再試。',
        });
    }
}
