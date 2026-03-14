
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-LWDRPE5B.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "redirectTo": "/configuration/races",
    "route": "/configuration"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-H75XQRQU.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/configuration/races"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GKE2HEHI.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/configuration/sakafo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GWIIEHO5.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/tableau-conf-sakafo"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RAZH2JGQ.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/poids-akoho"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-25Q7U3BO.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/inserer-lot"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GD5VS5H4.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/inserer-mort"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-N5ASWCST.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/inserer-oeufs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-L62WSHC6.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/eclosion-oeufs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-S5WB7TIP.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/liste-lots"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-VY4MOA2Z.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/liste-morts"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FJMXZ37R.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/liste-oeufs"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-SO6QRT3D.js",
      "chunk-RYVTY23I.js",
      "chunk-SL4L3F55.js"
    ],
    "route": "/situation"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 11390, hash: 'b63c1f867c8b0b9732bc43f2fed15becd2a87548a30ee7c6377f3c9090139c6f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1045, hash: '63d79bc5636708b5714ca371e9252612dfbac6d083e4f5d077161740a90cefda', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 26141, hash: '709753a15fb248e7ad721eafe5bd17cf6d63239c79bf6fdcbf1a5a5d27626082', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'configuration/races/index.html': {size: 30398, hash: 'd61889d06721edf4b0ec541e6667380413b35f2fe5e8566e5885030d1db054e1', text: () => import('./assets-chunks/configuration_races_index_html.mjs').then(m => m.default)},
    'liste-morts/index.html': {size: 25242, hash: 'e58050d11a46c5348d3f145330e4ec972a5aafe1b492c822b557a13655a81495', text: () => import('./assets-chunks/liste-morts_index_html.mjs').then(m => m.default)},
    'situation/index.html': {size: 28050, hash: '924ac4b7b2762608814c0139a6bcf0438299ab2ce7dbf5dfee41824d21d466a9', text: () => import('./assets-chunks/situation_index_html.mjs').then(m => m.default)},
    'tableau-conf-sakafo/index.html': {size: 30589, hash: '73971dd9ed2cc04d0adca0a0c4a239d023a4cc395aececfa0f54e2292236bea9', text: () => import('./assets-chunks/tableau-conf-sakafo_index_html.mjs').then(m => m.default)},
    'inserer-oeufs/index.html': {size: 28333, hash: 'f1822d190a620076a0d130afcfb2045331d1154186872dc2ac0ad27d8ddb8fd2', text: () => import('./assets-chunks/inserer-oeufs_index_html.mjs').then(m => m.default)},
    'liste-lots/index.html': {size: 25166, hash: '3e86003214f101cf235323a452fbc3bf3ab167eb6d489daf75ee8fdbc12105dc', text: () => import('./assets-chunks/liste-lots_index_html.mjs').then(m => m.default)},
    'inserer-lot/index.html': {size: 29183, hash: '793ac8c1545a0a74de6381927c12d2cf3e69947209538408538907dfde050ca0', text: () => import('./assets-chunks/inserer-lot_index_html.mjs').then(m => m.default)},
    'inserer-mort/index.html': {size: 28379, hash: 'ddc988bf2eed619e5e7efe19a00503f53e34eb490d8f8e740faaf221ac41aead', text: () => import('./assets-chunks/inserer-mort_index_html.mjs').then(m => m.default)},
    'configuration/sakafo/index.html': {size: 30978, hash: 'cc86b3a5a0b7fc38f3df8d19fe126a61087db4c3ed712a34680f0090ecc67357', text: () => import('./assets-chunks/configuration_sakafo_index_html.mjs').then(m => m.default)},
    'eclosion-oeufs/index.html': {size: 28444, hash: 'fd470603679fadb421c374047b23c12769fa0b37ed3150d16450e12678ce904b', text: () => import('./assets-chunks/eclosion-oeufs_index_html.mjs').then(m => m.default)},
    'poids-akoho/index.html': {size: 29079, hash: 'add2d3a210a1c1a60aacf9a8493ead1609b7bdaa2dd11a6717330fa0cde180fd', text: () => import('./assets-chunks/poids-akoho_index_html.mjs').then(m => m.default)},
    'liste-oeufs/index.html': {size: 25250, hash: '689bca2192976fe3132a909cbed273af5ffd9902d3e4630b93b4cdc0a08de954', text: () => import('./assets-chunks/liste-oeufs_index_html.mjs').then(m => m.default)},
    'styles-FYPYUGHI.css': {size: 11558, hash: '8RhhRysJfcU', text: () => import('./assets-chunks/styles-FYPYUGHI_css.mjs').then(m => m.default)}
  },
};
