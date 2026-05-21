import { useQuery } from '@tanstack/react-query';
import { LockKeyholeIcon, MenuIcon, PlusIcon, StarIcon, VaultIcon, XIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import type { VaultResponseDto } from 'shared-password-manager/api';
import { useModal, useSidebar } from 'shared-password-manager/hooks';
import { allPasswordsVault, favoritesVault } from 'shared-password-manager/models';
import { ExtraAction, ExtraContainer, ListItemView, ListView } from 'shared-password-manager/ui';
import { vaultsApi } from '../../apiconfig';
import VaultModalDialog from '../modals/vaultmodaldialog/VaultModalDialog';
import styles from './SidebarView.module.css';

interface SidebarProps {
  title: string;
  children?: React.ReactNode;
}

interface SidebarListHeaderProps {
  name: string;
  isExtended?: boolean;
  onEdit?: () => void;
  children?: React.ReactNode;
}

export default function Sidebar({ title, children }: SidebarProps) {
  const { vaultId } = useParams();
  const { isExpanded, close: closeSidebar, toggleSidebar } = useSidebar();
  const { activeModal, open, close: closeModal } = useModal<'ADD_MODAL'>();
  const navigate = useNavigate();

  const { data: vaults } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => vaultsApi.vaultsControllerFindAll(),
  });

  const handleSaveVault = (vault: VaultResponseDto) => {
    closeModal();
    navigate(`/${vault.id}`, { replace: true });
  };

  return (
    <>
      <section className={styles.sidebar + (isExpanded ? ` ${styles.extended}` : '')}>
        <div className={styles.sidebarTitleContainer}>
          <div className={styles.hamburgerMenu}>
            <ExtraContainer>
              <ExtraAction id="sidebar-hamburger-action" onExtraClick={toggleSidebar}>
                {isExpanded ? <XIcon size={18} /> : <MenuIcon size={18} />}
              </ExtraAction>
            </ExtraContainer>
          </div>
          <h1 className={styles.sidebarTitle}>{title}</h1>
        </div>
        <div className={styles.sidebarListContainer}>
          <SidebarListHeader name="Quick Access" isExtended={isExpanded} />
          <ListView>
            <Link to={`/${allPasswordsVault.id}`}>
              <ListItemView
                id="sidebar-all-password-item"
                title={allPasswordsVault.name}
                icon={<LockKeyholeIcon size={18} />}
                isSelected={vaultId === allPasswordsVault.id}
                onItemClick={closeSidebar}
              />
            </Link>
            <Link to={`/${favoritesVault.id}`}>
              <ListItemView
                id="sidebar-favorites-item"
                title={favoritesVault.name}
                icon={<StarIcon size={18} />}
                isSelected={vaultId === favoritesVault.id}
                onItemClick={closeSidebar}
              />
            </Link>
          </ListView>
          <div className="divider"></div>
          <SidebarListHeader
            name="Vaults"
            isExtended={isExpanded}
            onEdit={() => open('ADD_MODAL')}
          />
          <ListView>
            {vaults &&
              vaults.map((vault) => (
                <Link key={vault.id} to={`/${vault.id}`}>
                  <ListItemView
                    id={`sidebar-vault-item-${vault.id}`}
                    title={vault.name}
                    icon={<VaultIcon size={18} color={vault.color} />}
                    isSelected={vaultId === vault.id}
                    onItemClick={closeSidebar}
                  />
                </Link>
              ))}
          </ListView>
        </div>
        <div className="divider"></div>
        {children}
      </section>

      <VaultModalDialog
        key={'new'}
        type={'add'}
        isOpen={activeModal === 'ADD_MODAL'}
        onClose={closeModal}
        onSave={handleSaveVault}
      />
    </>
  );
}

function SidebarListHeader({ name, isExtended, onEdit }: SidebarListHeaderProps) {
  return (
    <div className={styles.sidebarListHeader + (isExtended ? ` ${styles.extended}` : '')}>
      <h3 className={styles.sidebarListTitle}>{name.toUpperCase()}</h3>
      <ExtraContainer>
        {onEdit && (
          <ExtraAction
            id="sidebar-add-vault-action"
            tooltipText="Add vault"
            tooltipPosition={'left'}
            type="small"
            onExtraClick={onEdit}
          >
            <PlusIcon size={16} />
          </ExtraAction>
        )}
      </ExtraContainer>
    </div>
  );
}
