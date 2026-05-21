import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EmptyView } from './EmptyView';

describe('EmptyView Component', () => {
  const MockIcon = <svg data-testid="test-mock-icon" />;

  it('renders correctly with default id and required props', async () => {
    await render(<EmptyView title="Nessun dato trovato" icon={MockIcon} />);

    await expect.element(page.getByTestId('test-empty-view')).toBeInTheDocument();

    await expect
      .element(page.getByTestId('test-empty-view-title'))
      .toHaveTextContent('Nessun dato trovato');

    await expect.element(page.getByTestId('test-mock-icon')).toBeInTheDocument();

    await expect.element(page.getByTestId('test-empty-view-subtitle')).not.toBeInTheDocument();
  });

  it('renders the subtitle when provided', async () => {
    await render(
      <EmptyView title="Nessun dato" subtitle="Prova a cercare qualcos'altro" icon={MockIcon} />,
    );

    await expect
      .element(page.getByTestId('test-empty-view-subtitle'))
      .toHaveTextContent("Prova a cercare qualcos'altro");
  });

  it('uses custom id for all data-testids', async () => {
    await render(<EmptyView id="custom-empty" title="Custom Title" icon={MockIcon} />);

    await expect.element(page.getByTestId('test-custom-empty')).toBeInTheDocument();
    await expect.element(page.getByTestId('test-custom-empty-title')).toBeInTheDocument();
  });

  it('applies the error class when isError is true', async () => {
    await render(<EmptyView title="Errore critico" icon={MockIcon} isError={true} />);

    await expect.element(page.getByTestId('test-empty-view')).toHaveClass(/error/);
  });

  it('does NOT apply the error class when isError is false', async () => {
    await render(<EmptyView title="Tutto ok" icon={MockIcon} isError={false} />);

    const container = page.getByTestId('test-empty-view');

    await expect.element(container).not.toHaveClass(/error/);
  });
});
