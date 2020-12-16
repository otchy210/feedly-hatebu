import { promises as fs } from 'fs';

const encoding = 'utf8';
const parseJsonFile = async (path) => {
    const jsonString = await fs.readFile(path, encoding);
    return JSON.parse(jsonString);
};

const exitWithError = (err) => {
    console.error(`ERROR: ${err}`);
    process.exit(1);
};

export {
    parseJsonFile,
    exitWithError,
};
