import { useQuery, useQueryClient } from '@tanstack/react-query';
import { KeyRound } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { PasswordResponseDto } from 'shared-password-manager/api';
import {
  BaseButton,
  CheckableListView,
  ListItemView,
  PasswordRevealerView,
} from 'shared-password-manager/ui';
import styles from './ImportPreviewPage.module.css';

interface ImportPreviewPageContentProps {
  pendingData: PasswordResponseDto[] | undefined;
}

export default function ImportPreviewPage(): React.JSX.Element | null {
  const { data } = useQuery<PasswordResponseDto[]>({
    queryKey: ['pendingImport'],
    staleTime: Infinity,
  });

  if (!data) return null;
  return <ImportPreviewPageContent pendingData={data} />;
}

function ImportPreviewPageContent({ pendingData }: ImportPreviewPageContentProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const allIds = useMemo(
    () => pendingData?.map((p) => `pending-item-${p.id}`) || [],
    [pendingData],
  );

  const [checkedItemsId, setCheckedItemsId] = useState<string[]>(allIds);

  const handleCancel = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['pendingImport'] });
    navigate('/');
  }, [queryClient, navigate]);

  const handleImport = useCallback(async () => {
    const itemsToSave =
      pendingData?.filter((p) => checkedItemsId.includes(`pending-item-${p.id}`)) || [];

    try {
      await window.api.savePasswords(itemsToSave);
      queryClient.invalidateQueries({ queryKey: ['passwords'] });

      handleCancel();
    } catch (error) {
      console.error('Error saving passwords:', error);
    }
  }, [pendingData, checkedItemsId, queryClient, handleCancel]);

  return (
    <main className="container flexContainer">
      <CheckableListView
        allItemIds={allIds}
        checkedItemsId={checkedItemsId}
        setCheckedItemsId={setCheckedItemsId}
        defaultShowCheckbox={true}
      >
        {pendingData && pendingData.length > 0 ? (
          pendingData.map((password) => (
            <ListItemView
              id={`pending-item-${password.id}`}
              key={password.id}
              title={password.service}
              subtitle={`${password.username}`}
              icon={<KeyRound size={18} />}
              extras={[
                <PasswordRevealerView
                  key={`key-rvl-${password.id}`}
                  id={`psw-rvl-${password.id}`}
                  password={password.password}
                />,
              ]}
            />
          ))
        ) : (
          <p>No passwords in this vault. Click "Add password" to create one.</p>
        )}
      </CheckableListView>
      <div className="flexSpace"></div>
      <div className={styles.buttonContainer}>
        <BaseButton id="cancel-button" fit="flex" variant="outline" onClick={handleCancel}>
          Cancel
        </BaseButton>
        <BaseButton id="import-button" fit="flex" variant="primary" onClick={handleImport}>
          Import
        </BaseButton>
      </div>
    </main>
  );
}
