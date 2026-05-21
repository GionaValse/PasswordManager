import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { AccountView } from './AccountView';

const mockAuth = {
  user: null as unknown, // UserResponseDto | null
  logout: vi.fn(),
};

const mockSidebar = {
  isExpanded: true,
};

vi.mock('../../hooks/auth/AuthHook', () => ({
  useAuth: () => mockAuth,
}));

vi.mock('../../hooks/sidebar/SidebarHook', () => ({
  useSidebar: () => mockSidebar,
}));

describe('AccountView Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.user = { id: '1', username: 'Gerry', email: 'g@test.it', icon: 'avatar.png' };
    mockSidebar.isExpanded = true;
  });

  it('Show username and avatar when logged in and expanded', async () => {
    const { getByText, getByAltText } = await render(
      <MemoryRouter>
        <AccountView />
      </MemoryRouter>,
    );

    await expect.element(getByText('Gerry')).toBeVisible();
    await expect.element(getByAltText("Gerry's avatar")).toBeVisible();
  });

  it('Show "Not logged in" message when user is null', async () => {
    mockAuth.user = null;

    const { getByText } = await render(
      <MemoryRouter>
        <AccountView />
      </MemoryRouter>,
    );

    await expect.element(getByText(/not logged in/i)).toBeVisible();
  });

  it('hide username when sidebar is collapsed', async () => {
    await page.viewport(720, 800);
    mockSidebar.isExpanded = false;

    const { getByText } = await render(
      <MemoryRouter>
        <AccountView />
      </MemoryRouter>,
    );

    const nameElement = getByText('Gerry');
    await expect.element(nameElement).not.toBeVisible();
  });

  it('calls the logout function when the extra action button is clicked', async () => {
    const { getByRole } = await render(
      <MemoryRouter>
        <AccountView />
      </MemoryRouter>,
    );

    const logoutBtn = getByRole('button');
    await logoutBtn.click();

    expect(mockAuth.logout).toHaveBeenCalledTimes(1);
  });

  it('render children (extra additional actions)', async () => {
    const { getByText } = await render(
      <MemoryRouter>
        <AccountView>
          <button>Settings</button>
        </AccountView>
      </MemoryRouter>,
    );

    await expect.element(getByText('Settings')).toBeVisible();
  });
});
