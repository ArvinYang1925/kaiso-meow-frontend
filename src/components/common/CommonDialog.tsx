import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/commonDialogStore";

export function CommonDialog() {
  const { isShowDialog, dialogContent, setIsShowDialog, closeDialog } =
    useDialogStore();

  const Icon = dialogContent.type === "success" ? CheckCircle : XCircle;
  const iconColor =
    dialogContent.type === "success" ? "text-green-500" : "text-red-500";
  const titleText = dialogContent.type === "success" ? "請求成功" : "請求失敗";

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
      <DialogTitle></DialogTitle>
      <DialogContent className="text-center py-10 px-4 sm:px-8 max-w-[95vw] sm:max-w-lg rounded-lg">
        <div className="flex flex-col items-center gap-4">
          <Icon size={56} className={`${iconColor}`} />
          <h2 className="text-3xl font-semibold">{titleText}</h2>
          {(dialogContent.message !== "" || dialogContent.message !== null) && (
            <p className="text-muted-foreground text-base">
              {dialogContent.message}
            </p>
          )}
        </div>
        <DialogFooter className="mt-4 flex justify-center">
          <Button
            onClick={handleClose}
            className="bg-orange-500 hover:bg-orange-600 w-full md:w-[200px]"
          >
            關閉
          </Button>
          {dialogContent.onConfirm && (
            <Button
              onClick={handleConfirm}
              className="bg-orange-500 hover:bg-orange-600"
            >
              確認
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
