import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readSystemInstructions } from './fileio.mjs';

describe('Utility fileio test', () => {
    it("Parses the file data to a string", async () => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const systemInstructionsLocation = join(__dirname, '../docs/SystemInstructions.txt');
        const additionalInstructionsLocation = join(__dirname, '../docs/additional_sysinstr');
        
        const result = await readSystemInstructions(systemInstructionsLocation, additionalInstructionsLocation);
        expect(result).toBeTypeOf('string');
        expect(result.length).toBeGreaterThan(0);
    })
});