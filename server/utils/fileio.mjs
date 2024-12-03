import * as fs from 'fs/promises';
import * as path from 'path';

export const readSystemInstructions = async (systemInstructionsLocation, additionalInstructionsLocation) => { 
    let instructions = await fs.readFile(systemInstructionsLocation, 'utf-8');
    const files = await fs.readdir(additionalInstructionsLocation, 'utf-8');

    for (let file of files) {
        const filePath = path.join(additionalInstructionsLocation, file);
        let fileContent =  await fs.readFile(filePath, 'utf-8', );
        instructions += '\n' + fileContent;
    }

    return instructions;
};