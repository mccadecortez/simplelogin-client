import { globby } from 'globby';
import { join, parse } from 'path';
import { $ } from 'zx/core';
import { distOpenApiDir } from '../constants';
import { copy, sectionHeader } from '../utils';

export const buildOAS = async () => {
  console.log(sectionHeader('📄 Building OpenAPI Spec'));
  await Promise.all([
    $`boats -i ./oas/index.yml -o ${join('build', 'openapi', 'simplelogin.json')}`,
    $`boats -i ./oas/index.yml -o ${join('build', 'openapi', 'simplelogin.yml')}`,
  ]);

  const output = await globby([join('build', 'openapi', 'simplelogin_*.*')]);
  await copy(output, distOpenApiDir, (name) => `simplelogin${parse(name).ext}`); // rename to simplelogin.json (remove _version)

  return (await globby([join(distOpenApiDir, 'simplelogin*.json')]))[0];
};
