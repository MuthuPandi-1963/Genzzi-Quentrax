import { createContext, useContext, useState,type ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmContextType {
  confirm: (message: string) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = (msg: string): Promise<boolean> => {
    setMessage(msg);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setIsOpen(false);
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}

      {/* 🧠 Centralized Confirmation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{message}</p>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmDialogProvider');
  return ctx;
};
