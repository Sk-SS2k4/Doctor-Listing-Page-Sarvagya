import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch before rendering component
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('renders doctor search app', () => {
  render(<App />);
  const searchElement = screen.getByPlaceholder(/Search Symptoms, Doctors, Specialists, Clinics/i);
  expect(searchElement).toBeInTheDocument();
});