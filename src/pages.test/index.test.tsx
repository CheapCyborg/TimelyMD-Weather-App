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

  it('should render the page', () => {
    render(<Index />);

    expect(screen.getByText('Weather Finder')).toBeInTheDocument();
  });

  it('should display loading spinner when weatherLoading is true', () => {
    const mockUseAppSelector = useAppSelector as jest.Mock;
    mockUseAppSelector.mockReturnValue({
      weatherLoading: true,
      error: null,
    });
    render(<Index />);
    // check for div with class name animate-spin
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
