import { fireEvent, render, screen } from '@testing-library/react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { testUseAppSelector } from '@/redux/test-app-selector';

import CurrentWeather from './CurrentWeather';

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('CurrentWeather component', () => {
  beforeEach(() => {
    const mockUseAppSelector = useAppSelector as jest.Mock;
    mockUseAppSelector.mockImplementation(testUseAppSelector);
    const mockUseAppDispatch = useAppDispatch as jest.Mock;
    mockUseAppDispatch.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render method', () => {
    it('should render the component', () => {
      render(<CurrentWeather />);
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('should add location to saved locations when save button is clicked', () => {
    render(<CurrentWeather />);
    const saveButton = screen.getByRole('button', { name: 'Save Location' });
    fireEvent.click(saveButton);
    const mockUseAppDispatch = useAppDispatch as jest.Mock;
    expect(mockUseAppDispatch).toHaveBeenCalled();
  });
});
