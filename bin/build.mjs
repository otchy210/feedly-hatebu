import path from 'path';
import { promises as fs } from 'fs';
import { parseJsonFile, exitWithError } from './common.mjs';

(async () => {
    // validation
    const srcManifestJson = await parseJsonFile(path.resolve('./src/manifest.json'));
    const packageJson = await parseJsonFile(path.resolve('./package.json'))
    const version = packageJson?.version;
    if (!version) {
        exitWithError(`package.json does't have version`);
    }
    const description = packageJson?.description;
    if (!description) {
        exitWithError(`package.json does't have description`);
    }
    const destManifest = {...srcManifestJson, ...{ version, description }};
    const destManifestJson = JSON.stringify(destManifest, null, 4);

    // clean up
    await fs.rmdir('./build', {recursive: true});
    await fs.mkdir('./build');

    // manifest.json
    await fs.writeFile(path.resolve('./build/manifest.json'), destManifestJson);

    // copy files
    const files = ['options.html'];
    await fs.mkdir(`./build/img`);
    (await fs.readdir('./src/img')).forEach(async (file) => {
        files.push(`img/${file}`);
    });
    files.forEach(async (file) => {
        const srcPath = path.resolve('./src/', file);
        const destPath = path.resolve('./build/', file);
        await fs.copyFile(srcPath, destPath);
    });
})();
