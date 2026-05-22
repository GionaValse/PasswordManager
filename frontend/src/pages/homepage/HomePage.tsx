import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router';
import { AccountView, ExtraAction, ThemeSwitch } from 'shared-password-manager/ui';
import PasswordView from '../../components/passwordview/PasswordView';
import Sidebar from '../../components/sidebarview/SidebarView';
import VaultView from '../../components/vaultview/VaultView';
import { OtpProvider } from '../../providers/otp/OtpProvider';
import { SidebarProvider } from '../../providers/sidebar/SidebarProvider';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { vaultId, passwordId } = useParams();
  const isMobile = useMediaQuery({ query: '(max-width: 720px)' });

  return (
    <div className={styles.appRoot}>
      {(!isMobile || (!vaultId && !passwordId)) && (
        <SidebarProvider>
          <Sidebar title="Password Manager">
            <AccountView>
              <ExtraAction noHover={true}>
                <ThemeSwitch />
              </ExtraAction>
            </AccountView>
          </Sidebar>
        </SidebarProvider>
      )}
      {(!isMobile || (vaultId && !passwordId)) && <VaultView />}
      {(!isMobile || passwordId) && (
        <OtpProvider>
          <PasswordView />
        </OtpProvider>
      )}
    </div>
  );
}
