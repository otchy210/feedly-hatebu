import path from 'path';
import fs from 'fs';
import { parseJsonFile, exitWithError } from './common.mjs';
import { exec } from 'child_process';

(async () => {
    !fs.existsSync('./dist') && fs.mkdirSync('./dist');

    const manifestJson = await parseJsonFile(path.resolve('./build/manifest.json'));
    const packageJson = await parseJsonFile(path.resolve('./package.json'))
    const version = manifestJson.version;
    const name = packageJson?.name;
    if (!name) {
        exitWithError(`package.json doesn't have name`);
    }
    const buildPath = path.resolve('./build');
    const distName = `${name}_${version}`;
    const distPath = path.resolve(`./dist/${distName}`);
    !fs.existsSync(distPath) && fs.mkdirSync(distPath);

    const zipFileName = `${distName}.zip`;
    const zipPath = path.resolve(`./dist/${zipFileName}`);
    if (fs.existsSync(zipPath)) {
        exitWithError(`${zipPath} exists already`);
    }
    ['manifest.json', 'options.html'].forEach(file => {
        const src = path.resolve(buildPath, file);
        const dest = path.resolve(distPath, file);
        fs.copyFileSync(src, dest);
    });
    ['img', 'js'].forEach(dir => {
        const srcDirPath = path.resolve(buildPath, dir);
        const destDirPath = path.resolve(distPath, dir);
        !fs.existsSync(destDirPath) && fs.mkdirSync(destDirPath);
        fs.readdirSync(srcDirPath).forEach(file => {
            const src = path.resolve(srcDirPath, file);
            const dest = path.resolve(destDirPath, file);
            fs.copyFileSync(src, dest);
        });
    });

    process.chdir(distPath);
    exec(`zip -r ${zipPath} *`, (err, stdout, stderr) => {
        stdout && console.log(stdout);
        if (err || stderr) {
            err && console.error(err);
            stderr && console.error(stderr);
            process.exit(1);
        }
        fs.promises.rmdir(distPath, {recursive: true});
    });
})();