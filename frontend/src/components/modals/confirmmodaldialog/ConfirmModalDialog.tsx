import { type ModalButton, ModalDialog } from 'shared-password-manager/ui';

interface ConfirmModalDialogProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModalDialog({
  isOpen,
  title,
  subtitle,
  icon,
  onClose,
  onConfirm,
}: ConfirmModalDialogProps) {
  const buttons: ModalButton[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: onClose,
    },
    {
      label: 'Confirm',
      variant: 'error',
      onClick: onConfirm,
    },
  ];

  return (
    <ModalDialog
      isOpen={isOpen}
      title={title}
      subtitle={subtitle}
      icon={icon}
      onClose={onClose}
      buttons={buttons}
    />
  );
}
