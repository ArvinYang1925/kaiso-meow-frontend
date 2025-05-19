import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores/modalStore";

export function Modal() {
  const { isOpen, title, body, footer, closeModal } = useModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        {/* Modal Header */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Modal Body */}
        {body && <div className="py-4">{body}</div>}

        {/* Modal Footer */}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
