// @ts-check
import fs from 'fs';
import path from 'path';
import { buildExamplesNav } from './example-nav-tree.mjs';

function docNavigation() {
  return [
    {
      title: 'Protocol Cookbook',
      group: 'doc',
      children: [
        {
          title: 'Direct Uploads (HTTP)',
          path: '/uploader/docs/cookbook/direct-uploads',
        },
        {
          title: 'Tus Upload',
          path: '/uploader/docs/cookbook/tus-upload',
        },
        {
          title: 'WebSocket Upload',
          path: '/uploader/docs/cookbook/websocket-upload',
        },
        {
          title: 'WebTransport Upload',
          path: '/uploader/docs/cookbook/webtransport-upload',
        },
        {
          title: 'Cloud Upload (TUS)',
          path: '/uploader/docs/cookbook/cloud-uploads-tus',
        },
        {
          title: 'Custom Previews',
          path: '/uploader/docs/cookbook/custom-previews',
        },
      ],
    },
    {
      title: 'Core Concepts',
      group: 'doc',
      children: [
        {
          title: 'Architecture',
          path: '/uploader/docs/core-concepts/architecture',
        },
        {
          title: 'Options',
          path: '/uploader/docs/core-concepts/uploader-options',
        },
        {
          title: 'State',
          path: '/uploader/docs/core-concepts/uploader-state',
        },
        {
          title: 'Validation',
          path: '/uploader/docs/core-concepts/validation',
        },
        {
          title: 'Protocols',
          path: '/uploader/docs/core-concepts/protocols',
        },
      ],
    },
    {
      title: 'Introduction',
      group: 'doc',
      children: [
        {
          title: 'Headless Uploader?',
          path: '/uploader/docs/introduction',
        },
        {
          title: 'Getting Started',
          path: '/uploader/docs/getting-started',
        },
      ],
    },
  ];
}

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  let publicPath = '';

  app.renderer.on('beginRender', () => {
    publicPath = (app.options.getValue('publicPath') || '').replace(/\/$/, '');
  });

  app.renderer.on('endPage', (page) => {
    if (!page.contents) return;

    // Remove .md and .mdx and preserve anchors
    page.contents = page.contents.replace(/(\[[^\]]*]\([^)\s]+?)\.(md|mdx)(#[^)]+)?\)/g, '$1$3)');
  });

  app.renderer.on('endRender', () => {
    const outputDir = app.options.getValue('out');
    const navJsonPath = path.join(outputDir.replace(/\/api$/, ''), 'navigation.json');
    if (!fs.existsSync(navJsonPath)) return;

    try {
      const originalRaw = fs.readFileSync(navJsonPath, 'utf-8');
      const navData = JSON.parse(originalRaw);

      const processNavItem = (item) => {
        if (item.path) {
          item.path = item.path.replace(/\.(md|mdx)$/, '');

          if (publicPath) {
            const normalized = item.path.startsWith('/') ? item.path : '/' + item.path;
            item.path = publicPath + normalized;
          }
        } else {
          item.group = 'api';
        }
        item.children?.forEach(processNavItem);
      };

      Array.isArray(navData) ? navData.forEach(processNavItem) : processNavItem(navData);

      if (Array.isArray(navData)) {
        const index = navData.findIndex((i) => i.title === 'hooks');
        if (index > -1) {
          navData.unshift(navData.splice(index, 1)[0]);
        }

        docNavigation().forEach((item) => {
          navData.unshift(item);
        });
      }

      const examplesPaths = buildExamplesNav('uploader/examples');
      if (examplesPaths) {
        // @ts-ignore
        examplesPaths.forEach((item) => {
          navData.push(item);
        });
      }

      const updatedRaw = JSON.stringify(navData, null, 2);
      if (updatedRaw !== originalRaw) {
        fs.writeFileSync(navJsonPath, updatedRaw, 'utf-8');
        console.log('navigation.json updated');
      } else {
        console.log('navigation.json unchanged — no write performed');
      }
    } catch (error) {
      console.error('Error processing navigation.json:', error);
    }
  });
}
