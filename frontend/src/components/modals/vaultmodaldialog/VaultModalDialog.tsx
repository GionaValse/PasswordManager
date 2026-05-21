import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VaultIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import type { ResponseError, VaultCreateDto, VaultResponseDto } from 'shared-password-manager/api';
import { ErrorBoxView, InputView, ModalDialog } from 'shared-password-manager/ui';
import { vaultsApi } from '../../../apiconfig';

interface VaultDataType {
  name: string;
  description?: string;
}

interface VaultModalDialogProps {
  type: 'add' | 'edit';
  isOpen: boolean;
  defaultValue?: VaultCreateDto | null;
  onClose: () => void;
  onSave: (vault: VaultResponseDto) => void;
}

export default function VaultModalDialog({
  type,
  isOpen,
  defaultValue = null,
  onClose,
  onSave,
}: VaultModalDialogProps) {
  const { vaultId } = useParams();

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [vaultData, setVaultData] = useState<VaultDataType>(
    defaultValue ? { ...defaultValue } : { name: '', description: '' },
  );
  const [vaultDataError, setVaultDataError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: VaultCreateDto) => {
      if (type === 'add')
        return await vaultsApi.vaultsControllerCreateOne({ vaultCreateDto: data });
      return await vaultsApi.vaultsControllerUpdateOne({ id: vaultId!, vaultUpdateDto: data });
    },
    onSuccess: (savedVault: VaultResponseDto) => {
      queryClient.invalidateQueries({ queryKey: ['vaults'] });
      queryClient.setQueryData(['vault', savedVault.id], savedVault);

      setVaultDataError(null);
      onSave(savedVault);
      handleClose();
    },
    onError: async (error: Error) => {
      setVaultDataError((await (error as ResponseError).response.json()).message);
      console.error('Vault upload error:', error);
    },
  });

  const validateForm = (formElement: HTMLFormElement | null) => {
    if (formElement) setIsFormValid(formElement.checkValidity());
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target;
    setVaultData((prev) => ({ ...prev, [name]: value }));
    validateForm(form);
  };

  const handleClose = () => {
    onClose();
    setVaultData(
      defaultValue
        ? { name: defaultValue.name, description: defaultValue.description }
        : { name: '', description: '' },
    );
  };

  const handleSave = () => {
    if (!vaultData.name) return;
    mutation.mutate({ ...vaultData });
  };

  return (
    <ModalDialog
      title={type === 'add' ? 'Add Vault' : 'Edit Vault'}
      subtitle={type === 'add' ? 'Create a new secure container' : 'Update vault details'}
      icon={<VaultIcon />}
      isOpen={isOpen}
      onClose={handleClose}
      buttons={[
        { label: 'Cancel', variant: 'outline', onClick: handleClose },
        {
          label: type === 'add' ? 'Create' : 'Save Changes',
          variant: 'primary',
          onClick: handleSave,
          disabled: !isFormValid || mutation.isPending,
        },
      ]}
    >
      <ErrorBoxView errorMessage={vaultDataError} />
      <form
        onSubmit={(e: React.SubmitEvent<HTMLFormElement>) => e.preventDefault()}
        onInput={(e: React.InputEvent<HTMLFormElement>) => validateForm(e.currentTarget)}
      >
        <InputView
          id="name"
          type="text"
          value={vaultData.name}
          onChange={handleOnChange}
          label="Name"
          required={true}
        />
        <InputView
          id="description"
          type="text"
          value={vaultData.description}
          onChange={handleOnChange}
          label="Description"
          required={false}
        />
      </form>
    </ModalDialog>
  );
}
