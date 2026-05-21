import { ClockFadingIcon, LogOutIcon } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/auth/AuthHook';
import { useSidebar } from '../../hooks/sidebar/SidebarHook';
import { ExtraAction, ExtraContainer } from '../extrascomponent/ExtrasComponent';
import styles from './AccountView.module.css';

interface AccountViewProps {
  children?: React.ReactNode;
}

export function AccountView({ children }: AccountViewProps) {
  const { user, logout } = useAuth();
  const { isExpanded } = useSidebar();

  return (
    <div className={styles.accountView + (isExpanded ? '' : ` ${styles.collapsed}`)}>
      {user ? (
        <>
          <Link className={styles.session} to="/sessions">
            <img src={user.icon} alt={`${user.username}'s avatar`} className={styles.accountIcon} />
            <ClockFadingIcon className={styles.sessionIcon} size={18} />
          </Link>
          <span className={styles.accountName}>{user.username}</span>
          <div className={styles.accountExtras}>
            <ExtraContainer>
              {children}
              <ExtraAction
                id="account-logout-extra"
                tooltipText="Logout"
                error={true}
                onExtraClick={logout}
              >
                <LogOutIcon size={18} />
              </ExtraAction>
            </ExtraContainer>
          </div>
        </>
      ) : (
        <span className={styles.accountName}>Not logged in</span>
      )}
    </div>
  );
}
