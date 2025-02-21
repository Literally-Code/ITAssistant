import fetch from 'node-fetch';
import { describe, it, expect } from 'vitest';

describe('Server running test', () => {
    it('Is status 200', async () => {
        const response = await fetch('http://localhost:3000/test');
        console.log(response);
        const data = await response.json();
        expect(response.ok).toBe(true);
        expect(data).toEqual({ message: `API test successful`, status: 'success' });
    });
    it('Returns a JSON response', async () => {
        const response = await fetch('http://localhost:3000/test');
        const data = await response.json();
        expect(data).toEqual({ message: `API test successful`, status: 'success' });
    });
});