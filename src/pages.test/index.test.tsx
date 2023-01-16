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
    mockUseAppSelector.mockReturnValue({
      currentWeather: {
        weatherLoading: false,
        error: null,
      },
      geoLocation: {
        geoLoading: false,
        city: 'London',
        currentState: 'England',
        country: 'UK',
      },
      weatherForecast: {
        weatherForecastLoading: false,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    render(<Index />);

    expect(screen.getByText('Weather')).toBeInTheDocument();
  });

  it('should display loading spinner when weatherLoading is true', () => {
    const mockUseAppSelector = useAppSelector as jest.Mock;
    mockUseAppSelector.mockImplementation(
      testUseAppSelector((state) => ({
        ...state,
        currentWeather: {
          ...state.currentWeather,
          weatherLoading: true,
        },
      }))
    );

    render(<Index />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
