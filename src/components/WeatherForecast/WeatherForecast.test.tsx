import { render, screen } from '@testing-library/react';

import { useAppSelector } from '@/redux/hooks';
import { testUseAppSelector } from '@/redux/test-app-selector';

import WeatherForecast from './WeatherForecast';

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('WeatherForecast component', () => {
  beforeEach(() => {
    const mockUseAppSelector = useAppSelector as jest.Mock;
    mockUseAppSelector.mockImplementation(testUseAppSelector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Render method', () => {
    it('should render the component', () => {
      render(<WeatherForecast />);
      expect(screen.getByText('5 Day Forecast')).toBeInTheDocument();
    });
  });
});
