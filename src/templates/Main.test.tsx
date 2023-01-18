import { render, screen, within } from '@testing-library/react';

import { Main } from './Main';

describe('Main template', () => {
  describe('Render method', () => {
    it('should display Weather Finder', () => {
      render(<Main meta={null}>{null}</Main>);

      expect(screen.getByText('Weather Finder')).toBeInTheDocument();
    });

    it('should have a link to support creativedesignsguru.com', () => {
      render(<Main meta={null}>{null}</Main>);

      const copyrightSection = screen.getByText(/© Copyright/);
      const copyrightLink = within(copyrightSection).getByRole('link');

      expect(copyrightLink).toHaveAttribute(
        'href',
        'https://creativedesignsguru.com'
      );
    });
  });
});
