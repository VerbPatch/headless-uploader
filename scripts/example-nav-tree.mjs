import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = new Set(['node_modules', '.angular', '.svelte-kit', 'dist', 'build']);

export function buildExamplesNav(pathPrefix) {
  const rootDir = process.cwd() + '\\examples';
  if (!fs.statSync(rootDir).isDirectory()) {
    return null;
  }

  return scan(rootDir, pathPrefix);
}

function scan(dirPath, pathPrefix) {
  const packageJsonPath = path.join(dirPath, 'package.json');

  const packageExists = fs.existsSync(packageJsonPath);
  if (packageExists) {
    const name = path.basename(dirPath);
    return {
      title: name,
      path: dirPath,
      label: 'pro',
    };
  }

  const entries = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((f) => f.isDirectory() && !IGNORED_DIRS.has(f.name));

  return entries.map((item) => {
    const child = scan(item.path + '\\' + item.name, pathPrefix);
    const result = {
      title: item.name,
      group: 'example',
    };

    if (child.label === 'pro') {
      result.path =
        '/' + pathPrefix + '/' + item.path.substr(dirPath.lastIndexOf('\\') + 1) + '/' + item.name;
    } else {
      result.children = child;
    }
    return result;
  });
}
