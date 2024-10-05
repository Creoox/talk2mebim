import {
  FastNavPlugin,
  math,
  NavCubePlugin,
  Viewer,
  XKTLoaderPlugin,
} from '@xeokit/xeokit-sdk';

import { utils } from '@xeokit/xeokit-sdk/src/viewer/scene/utils';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      Viewer,
      FastNavPlugin,
      NavCubePlugin,
      math,
      XKTLoaderPlugin,
      utils,
    },
  };
});

export type ViewerType = InstanceType<typeof Viewer>;
export type XKTLoaderPluginType = InstanceType<typeof XKTLoaderPlugin>;
