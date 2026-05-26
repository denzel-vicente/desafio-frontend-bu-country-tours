import { render, screen, fireEvent } from '@testing-library/react';
import { jest, describe, it, expect } from '@jest/globals';
import { AppContextProvider } from '../context/AppContext';
import { useAppContext } from '../context/useAppContext';
import { BookingWidget } from './BookingWidget';
import toursData from '../tours.json';

jest.mock('lucide-react', () => ({
  Users: () => <div data-testid="icon-users" />,
  AlertCircle: () => <div data-testid="icon-alert" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  ChevronUp: () => <div data-testid="icon-chevron" />,
  X: () => <div data-testid="icon-x" />
}));

// Create a wrapper component to easily switch currency
const TestWrapper = () => {
  const { setCurrency, setActiveTour } = useAppContext();
  
  // Expose a button to change currency for testing
  return (
    <>
      <button data-testid="change-to-usd" onClick={() => setCurrency('USD')}>To USD</button>
      <button data-testid="set-tour-1" onClick={() => setActiveTour(toursData[0])}>Set Tour 1</button>
      <BookingWidget />
    </>
  );
};

describe('BookingWidget Component', () => {
  it('calculates total correctly when adding a child and changing currency to USD', () => {
    render(
      <AppContextProvider>
        <TestWrapper />
      </AppContextProvider>
    );

    // Initial state: 1 adult, 0 children, BRL currency.
    // For tour-001 (default), adult price is 180.0 BRL, child price is 90.0 BRL.
    // Wait for initial render.
    const childrenCount = screen.getByTestId('children-count');
    expect(childrenCount).toHaveTextContent('0');

    // Click to add 1 child
    const btnAddChild = screen.getByTestId('increment-children');
    fireEvent.click(btnAddChild);
    
    expect(childrenCount).toHaveTextContent('1');

    // Initial total in BRL: (1 * 180) + (1 * 90) = 270 BRL
    const totalPriceElement = screen.getByTestId('total-price');
    expect(totalPriceElement.textContent.replace(/\s+/g, '')).toBe('R$270.00');

    // Change currency to USD
    const btnChangeUsd = screen.getByTestId('change-to-usd');
    fireEvent.click(btnChangeUsd);

    // Converted total in USD: 270 / 5 = 54.00
    expect(totalPriceElement.textContent.replace(/\s+/g, '')).toBe('$54.00');
  });

  it('disables reserve button when no date is selected', () => {
    render(
      <AppContextProvider>
        <BookingWidget />
      </AppContextProvider>
    );

    const btnReserve = screen.getByTestId('btn-reserve');
    expect(btnReserve).toBeDisabled();

    // Select date
    const dateInput = screen.getByTestId('date-input');
    fireEvent.change(dateInput, { target: { value: '2026-05-25' } });

    expect(btnReserve).not.toBeDisabled();
  });
});
