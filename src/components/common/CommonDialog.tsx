import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";

export function CommonDialog() {
  const { isShowDialog, dialogContent, setIsShowDialog, closeDialog } =
    useDialogStore();

  const handleClose = () => {
    closeDialog(); // 使用新的 closeDialog 方法，會自動執行回調
  };

  const handleConfirm = () => {
    if (dialogContent.onConfirm) {
      dialogContent.onConfirm();
    }
    closeDialog();
  };

  return (
    <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>關閉</Button>
          {dialogContent.onConfirm && (
            <Button onClick={handleConfirm}>確認</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
