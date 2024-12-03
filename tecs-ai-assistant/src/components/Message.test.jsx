import { render } from '@testing-library/react';
import Message from './Message';
import { describe, it, expect } from 'vitest';

describe("Message", () => {
    it('Renders a message with \'Loading...\' text', () => {
        const container = render(<Message agent='user' status='loading' text='Loading...'></Message>);
        const element = container.getByText("Loading...");
        expect(element);
    });
      
    it('Converts url content into a hyperlink', () => {
        let container = render(<Message agent='user' status='loading' text='[test](https://www.test.com)'></Message>);
        let hyperlink = container.getByText("test");
        expect(hyperlink);
        expect(hyperlink.getAttribute('href')).toBe('https://www.test.com');
        container.unmount();
    
        container = render(<Message agent='user' status='loading' text='This is a [test](https://www.test.com)'></Message>);
        hyperlink = container.getByText('test');
        expect(container.getByText('This is a')); // Expect to find element that says "This is a"
        expect(hyperlink); // Expect second element to be "test" as a hyperlink
        expect(hyperlink.tagName).toBe('A');
        expect(hyperlink.getAttribute('href')).toBe('https://www.test.com'); // Expect href to be the link
    });
});