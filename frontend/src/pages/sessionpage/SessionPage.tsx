import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { LogOutIcon, MonitorIcon, SmartphoneIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth, useModal, useSocket } from 'shared-password-manager/hooks';
import {
  ErrorBoxView,
  ErrorButton,
  ExtraAction,
  HeaderView,
  ListItemView,
  ListView,
  LoadingView,
} from 'shared-password-manager/ui';
import { formatRelativeDate, parseApiError } from 'shared-password-manager/utils';
import { UAParser } from 'ua-parser-js';
import { usersApi } from '../../apiconfig';
import ConfirmModalDialog from '../../components/modals/confirmmodaldialog/ConfirmModalDialog';
import styles from './SessionPage.module.css';

interface SessionProps {
  message: string;
  time: Date;
}

interface SessionCahngeProps extends SessionProps {
  queryClient: QueryClient;
}

const handleQuery = async () => {
  try {
    const sessions = await usersApi.usersControllerActiveSessions();
    console.log(sessions);
    return sessions;
  } catch (e: unknown) {
    const apiError = await parseApiError(e);
    console.error('Unable load sessions: ', e);
    throw new Error(apiError.message || 'Unable load sessions');
  }
};

const handleSessionChanged = ({ message, time, queryClient }: SessionCahngeProps) => {
  console.log(message, time);
  queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
};

export default function SessionPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const { activeModal, open, close } = useModal();
  const [logOutSession, setLogOutSession] = useState<string | null>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: sessions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: handleQuery,
    enabled: isConnected,
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewSession = (props: SessionProps) =>
      handleSessionChanged({ ...props, queryClient });
    const handleCloseSession = (props: SessionProps) =>
      handleSessionChanged({ ...props, queryClient });

    socket.on('new_session_alert', handleNewSession);
    socket.on('close_session_alert', handleCloseSession);

    return () => {
      socket.off('new_session_alert', handleNewSession);
      socket.off('close_session_alert', handleCloseSession);
    };
  }, [socket, queryClient]);

  const getDeviceInfo = (userAgentString: string): { title: string; isMobile: boolean } => {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    const browser = result.browser.name || 'Unknown browser';
    const os = result.os.name || 'Unknown OS';
    const isMobile = result.device.type === 'mobile' || result.device.type === 'tablet';

    return {
      title: `${browser} su ${os}`,
      isMobile: isMobile,
    };
  };

  const handleLogOutSessionOpen = (soketId: string) => {
    setLogOutSession(soketId);
    open('sessionModal');
  };

  const handleLogOutSession = () => {
    if (!logOutSession) return;

    socket?.emit('request_logout', { socketId: logOutSession });
    setLogOutSession(null);
    close();
  };

  return (
    <>
      <div className={styles.sessionContainer}>
        <HeaderView
          title="Your Sessions"
          subtitle={user?.username}
          forceShowBack={true}
          onBack={() => navigate(-1)}
        />
        <div className={styles.pageContent + ` ${isLoading ? styles.loading : ''}`}>
          {isLoading && <LoadingView />}
          {error && <ErrorBoxView errorMessage={error.message} />}
          {sessions && (
            <>
              <ListView>
                {[...sessions].reverse().map((session, index) => {
                  const { title, isMobile } = getDeviceInfo(session.userAgent);
                  const isCurrentDevice = session.socketId === socket?.id;

                  const listExtras = [
                    <ExtraAction
                      key={session.socketId}
                      id={`session-close-action-${session.socketId}`}
                      error={true}
                      tooltipText="Close session"
                      tooltipPosition="bottom"
                      onExtraClick={() => handleLogOutSessionOpen(session.socketId)}
                    >
                      <LogOutIcon />
                    </ExtraAction>,
                  ];

                  return (
                    <ListItemView
                      key={index}
                      id={`session-item-${session.socketId}`}
                      isSelected={isCurrentDevice}
                      title={`${isCurrentDevice ? 'This device • ' : ''}${title}`}
                      subtitle={`IP: ${session.ip} • ${formatRelativeDate(session.connectedAt)}`}
                      icon={isMobile ? <SmartphoneIcon size={18} /> : <MonitorIcon size={18} />}
                      extras={listExtras}
                    />
                  );
                })}
              </ListView>
              <div className={styles.closeSessionsContainer}>
                <ErrorButton
                  text="Close all sessions"
                  icon={<LogOutIcon size={18} />}
                  onClick={() => open('allSessionModal')}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModalDialog
        isOpen={activeModal === 'allSessionModal'}
        title="Close all session"
        subtitle="Are you sure you want to close all sessions? This will log you out from all devices."
        onClose={close}
        onConfirm={() => socket?.emit('request_global_logout')}
      />

      <ConfirmModalDialog
        isOpen={activeModal === 'sessionModal'}
        title="Close this session"
        subtitle="Are you sure you want to close this sessions? This will log you out from that devices."
        onClose={close}
        onConfirm={handleLogOutSession}
      />
    </>
  );
}
