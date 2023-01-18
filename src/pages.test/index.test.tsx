import { render, screen } from '@testing-library/react';

import Index from '@/pages/index';
import { useAppSelector } from '@/redux/hooks';
import { testUseAppSelector } from '@/redux/test-app-selector';

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('Index page', () => {
  beforeEach(() => {
    const mockUseAppSelector = useAppSelector as jest.Mock;
    mockUseAppSelector.mockImplementation(testUseAppSelector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render method', () => {
    it('should render the page', () => {
      render(<Index />);

      expect(screen.getByText('Weather Finder')).toBeInTheDocument();
    });

    it('should display loading spinner when weather is loading', () => {
      const mockUseAppSelector = useAppSelector as jest.Mock;
      mockUseAppSelector.mockReturnValue({
        weatherLoading: true,
        error: null,
      });
      render(<Index />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should display loading spinner when geo is loading', () => {
      const mockUseAppSelector = useAppSelector as jest.Mock;
      mockUseAppSelector.mockReturnValue({
        geoLoading: true,
        error: null,
      });
      render(<Index />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should display loading spinner when weather forecast is loading', () => {
      const mockUseAppSelector = useAppSelector as jest.Mock;
      mockUseAppSelector.mockReturnValue({
        weatherForecastLoading: true,
        error: null,
      });
      render(<Index />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});
