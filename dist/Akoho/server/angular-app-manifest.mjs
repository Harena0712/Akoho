
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-IGR6HNC3.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-EWHWZIMH.js",
      "chunk-XZXBDMHN.js",
      "chunk-VXCI52IL.js"
    ],
    "route": "/inserer-lot"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-KENADCUO.js",
      "chunk-XZXBDMHN.js",
      "chunk-VXCI52IL.js"
    ],
    "route": "/inserer-mort"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-4WXHQQSW.js",
      "chunk-XZXBDMHN.js",
      "chunk-VXCI52IL.js"
    ],
    "route": "/inserer-oeufs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-LOAMX4DN.js",
      "chunk-XZXBDMHN.js",
      "chunk-VXCI52IL.js"
    ],
    "route": "/eclosion-oeufs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GQSOTHNH.js",
      "chunk-VXCI52IL.js"
    ],
    "route": "/situation"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11441, hash: 'eecc27567a85521b80a47a75c9c3be0e3eb035482e9858e4807469260cb637a7', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1096, hash: '73c58042268a7b1e2fd35854ac498cd1f5d1e6bae64882626c95e01b4e53e061', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'situation/index.html': {size: 23001, hash: 'd982734fcdb5810f14bd6c5a2c4cba6143ccac18a5338113be4cad6d49d21049', text: () => import('./assets-chunks/situation_index_html.mjs').then(m => m.default)},
    'eclosion-oeufs/index.html': {size: 24245, hash: '9c7633a9c6ed32543ef50222a497ec2eab5c8834b7b40b1a15451cb26ebf1671', text: () => import('./assets-chunks/eclosion-oeufs_index_html.mjs').then(m => m.default)},
    'inserer-lot/index.html': {size: 24674, hash: 'd2ae9e13bcbff2658a26b6410891bef2cd476037f4b9aab896273720a9cb6634', text: () => import('./assets-chunks/inserer-lot_index_html.mjs').then(m => m.default)},
    'index.html': {size: 22613, hash: '3c35dfc471666cc6a6edbd954b6cc415a70406020b3cf6c2eb6d667b8274d646', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'inserer-oeufs/index.html': {size: 24168, hash: '5a93b9120fa67a8ec2324807a6aaacd2a4138cd93dd39d5b65a292cdd3ff705c', text: () => import('./assets-chunks/inserer-oeufs_index_html.mjs').then(m => m.default)},
    'inserer-mort/index.html': {size: 24214, hash: '262499f93414ef193d4b21fb9b810c4dc5401d97049b7cd9bf2f88d66c3a6165', text: () => import('./assets-chunks/inserer-mort_index_html.mjs').then(m => m.default)},
    'styles-FYPYUGHI.css': {size: 11558, hash: '8RhhRysJfcU', text: () => import('./assets-chunks/styles-FYPYUGHI_css.mjs').then(m => m.default)}
  },
};
