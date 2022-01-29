import { render, screen } from '@testing-library/react';
import App from './App';

test('renders blog title', () => {
  render(<App />);
  const h1Element = screen.getByText(/My blog post/i);
  expect(h1Element).toBeInTheDocument();
});
