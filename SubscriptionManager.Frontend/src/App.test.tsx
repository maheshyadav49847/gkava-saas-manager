import { render } from '@testing-library/react';
import { test } from 'vitest';
import App from './App';

test('renders app routes without crashing', () => {
  render(
    <App />
  );
  // Add a simple assertion if needed
});
