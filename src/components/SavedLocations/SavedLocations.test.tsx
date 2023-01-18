import { render, screen } from '@testing-library/react';

import { useAppSelector } from '@/redux/hooks';
import { testUseAppSelector } from '@/redux/test-app-selector';

import SavedLocations from './SavedLocations';

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('SavedLocations component', () => {
  beforeEach(() => {
    const mockUseAppSelector = useAppSelector as jest.Mock;
    mockUseAppSelector.mockImplementation(testUseAppSelector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render method', () => {
    it('should render the component', () => {
      render(<SavedLocations />);
      expect(screen.getByText('Saved Locations')).toBeInTheDocument();
    });
  });
});
