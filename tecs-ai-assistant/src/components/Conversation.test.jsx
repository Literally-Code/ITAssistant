import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/user-event';
import Conversation from './Conversation';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

describe("Conversation", () => {
    it("Allows the user to type in the input field and toggles the submit button's ability", async () => {
        const container = render(<Conversation />);
        const button = container.getByTestId('submit');
        const input = container.getByTestId('input');
        expect(button).toBeDisabled();

        input.focus();
        expect(input).toHaveFocus();

        await userEvent.type(input, 'Test');
        expect(input).toHaveTextContent('Test');
        expect(button).toBeEnabled;
    });
});