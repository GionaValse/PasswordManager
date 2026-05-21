import { useQuery } from '@tanstack/react-query';
import { KeyRound, VaultIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { PasswordResponseDto } from 'shared-password-manager/api';
import {
  EmptyView,
  ListItemView,
  ListView,
  LoadingView,
  PasswordRevealerView,
  SearchView,
} from 'shared-password-manager/ui';
import { parseApiError } from 'shared-password-manager/utils';

const handleQueryPasswords = async (): Promise<PasswordResponseDto[]> => {
  try {
    const resposne = await window.api.getPasswords();
    return resposne;
  } catch (e: unknown) {
    const apiError = await parseApiError(e);
    console.error('Error fetching data:', apiError.message);
    return [];
  }
};

export default function PasswordListPage(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: passwords, isLoading: isPasswordLoading } = useQuery({
    queryKey: ['passwords'],
    queryFn: handleQueryPasswords,
  });

  const filteredPassword = useMemo((): PasswordResponseDto[] => {
    if (!passwords) return [];

    return passwords.filter(
      (p) =>
        p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.website?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [passwords, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isPasswordLoading) {
    return <LoadingView />;
  }

  return (
    <main className="container">
      <SearchView id="vault-search-view" placeholder="Search..." onSearchInput={handleSearch} />
      <ListView>
        {filteredPassword.length > 0 ? (
          filteredPassword.map((password) => (
            <ListItemView
              id={`vault-item-${password.id}`}
              key={password.id}
              title={password.service}
              subtitle={password.username}
              icon={<KeyRound size={18} />}
              extras={[
                <PasswordRevealerView id={`psw-rvl-${password.id}`} password={password.password} />,
              ]}
            />
          ))
        ) : (
          <EmptyView
            title="Empty Vault"
            subtitle="Passwords will be displayed here"
            icon={<VaultIcon size={48} />}
          />
        )}
      </ListView>
    </main>
  );
}
