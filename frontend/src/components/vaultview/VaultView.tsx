import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound, PlusIcon, StarIcon, Trash2Icon, VaultIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import type { PasswordResponseDto, VaultResponseDto } from 'shared-password-manager/api';
import { useModal } from 'shared-password-manager/hooks';
import { allPasswordsVault, favoritesVault } from 'shared-password-manager/models';
import {
  EmptyView,
  ExtraAction,
  ExtraActionMenu,
  HeaderView,
  ListItemView,
  ListView,
  LoadingView,
  SearchView,
} from 'shared-password-manager/ui';
import { passwordsApi, vaultsApi } from '../../apiconfig';
import ConfirmModalDialog from '../modals/confirmmodaldialog/ConfirmModalDialog';
import VaultModalDialog from '../modals/vaultmodaldialog/VaultModalDialog';
import styles from './VaultView.module.css';

type ModalType = 'UPDATE_VAULT' | 'DELETE_CONFIRM';

const handleQueryVault = async ({
  queryKey,
}: {
  queryKey: [string, string | undefined];
}): Promise<VaultResponseDto | null> => {
  const [_key, id] = queryKey;

  if (!id) return null;

  console.log(id, _key);
  try {
    if (id === 'all-passwords') return allPasswordsVault;
    if (id === 'favorites') return favoritesVault;
    return await vaultsApi.vaultsControllerFindOne({ id });
  } catch (e: unknown) {
    console.error('Error fetching data:', e);
    return null;
  }
};

const handleQueryPasswords = async ({
  queryKey,
}: {
  queryKey: [string, string | undefined];
}): Promise<PasswordResponseDto[]> => {
  const [_key, id] = queryKey;

  if (!id) return [];

  console.log(id, _key, id === 'all-passwords');
  try {
    if (id === 'all-passwords') return await passwordsApi.passwordsControllerFindAll();
    if (id === 'favorites') return await passwordsApi.passwordsControllerFindFavorites();
    return await vaultsApi.vaultsControllerFindVaultPasswords({ vaultId: id });
  } catch (e: unknown) {
    console.error('Error fetching data:', (e as Error).message);
    return [];
  }
};

export default function VaultView() {
  const { vaultId, passwordId } = useParams();
  const { activeModal, open, close } = useModal<ModalType>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: vault, isLoading: isVaultLoading } = useQuery({
    queryKey: ['vault', vaultId],
    queryFn: handleQueryVault,
    enabled: !!vaultId,
    staleTime: 60_000, // 1min
  });

  const { data: passwords, isLoading: isPasswordLoading } = useQuery({
    queryKey: ['passwords', vaultId],
    queryFn: handleQueryPasswords,
    enabled: !!vaultId,
  });

  const filteredPassword = useMemo((): PasswordResponseDto[] => {
    if (!passwords) return [];

    return passwords.filter(
      (p) =>
        p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.website?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [passwords, searchTerm]);

  const mutationDelete = useMutation({
    mutationFn: async (id?: string) => {
      if (!id) {
        throw new Error('Id is not defined');
      }

      return await vaultsApi.vaultsControllerDeleteOne({ id });
    },
    onSuccess: (deletedVault: VaultResponseDto) => {
      queryClient.invalidateQueries({ queryKey: ['vaults'] });
      queryClient.removeQueries({ queryKey: ['vault', deletedVault.id] });

      navigate('/all-passwords', { replace: true });
      close();
    },
    onError: (error: Error) => console.error('Error deleting vault:', error),
  });

  if (isVaultLoading || isPasswordLoading) {
    return (
      <section className={styles.vaultView}>
        <LoadingView />
      </section>
    );
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const vaultExtraList = [
    { id: 0, text: 'Edit' },
    { id: 1, text: 'Delete' },
  ];

  return (
    <>
      <section className={styles.vaultView}>
        {vault ? (
          <>
            <HeaderView
              title={vault.name}
              subtitle={vault.description || ''}
              onBack={() => navigate(-1)}
            >
              {vault.ownerId !== '' && (
                <>
                  <Link to={`/${vaultId}/add-password`}>
                    <ExtraAction
                      id="vault-add-action"
                      tooltipText="Add password"
                      tooltipPosition={'bottom'}
                    >
                      <PlusIcon size={18} />
                    </ExtraAction>
                  </Link>
                  <ExtraActionMenu
                    id="vault-more-action"
                    tooltipText="More"
                    tooltipPosition={'bottom'}
                    extraList={vaultExtraList}
                    onExtraClick={(id: number) =>
                      open(id === 0 ? 'UPDATE_VAULT' : 'DELETE_CONFIRM')
                    }
                  />
                </>
              )}
            </HeaderView>
            <SearchView
              id="vault-search-view"
              placeholder="Search..."
              onSearchInput={handleSearch}
            />
            <ListView>
              {filteredPassword.length > 0 ? (
                filteredPassword.map((password) => (
                  <Link key={password.id} to={`/${vaultId}/${password.id}`}>
                    <ListItemView
                      id={`vault-item-${vault.id}`}
                      key={password.id}
                      title={password.service}
                      subtitle={password.username}
                      icon={password.favorite ? <StarIcon size={18} /> : <KeyRound size={18} />}
                      isSelected={passwordId === password.id}
                    />
                  </Link>
                ))
              ) : (
                <EmptyView
                  title="Empty Vault"
                  subtitle="Passwords will be displayed here"
                  icon={<VaultIcon size={48} />}
                />
              )}
            </ListView>
          </>
        ) : (
          <EmptyView
            title="No vault selected"
            subtitle="Please select a vault from the sidebar"
            icon={<VaultIcon size={48} />}
          />
        )}
      </section>

      <ConfirmModalDialog
        isOpen={activeModal === 'DELETE_CONFIRM'}
        title="Delete vault"
        subtitle="Do you really want to delete the vault?"
        icon={<Trash2Icon />}
        onClose={close}
        onConfirm={() => mutationDelete.mutate(vaultId)}
      />

      <VaultModalDialog
        key={vaultId!}
        type={'edit'}
        isOpen={activeModal === 'UPDATE_VAULT'}
        defaultValue={vault}
        onClose={close}
        onSave={close}
      />
    </>
  );
}
