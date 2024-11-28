import { render } from '@testing-library/react';
import Message from './Message';

test('Renders a message with \'Loading...\' text', () => {
  const { getByText } = render(<Message agent='user' status='loading' text='Loading...'></Message>);
  expect(getByText("Loading..."));
});