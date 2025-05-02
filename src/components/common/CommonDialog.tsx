import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/stores/CommonDialogStore";

export function CommonDialog() {
  const { isShowDialog, setIsShowDialog, dialogContent } = useDialogStore();

  return (
    <Dialog open={isShowDialog} onOpenChange={setIsShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent.title}</DialogTitle>
          <DialogDescription>{dialogContent.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>確定</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
