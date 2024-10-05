import {
  AnnotationsPlugin,
  BCFViewpointsPlugin,
  CameraMemento,
  ContextMenu,
  //DistanceMeasurementEditMouseControl,
  DistanceMeasurementsMouseControl,
  DistanceMeasurementsPlugin,
  DistanceMeasurementsTouchControl,
  FastNavPlugin,
  GLTFLoaderPlugin,
  LASLoaderPlugin,
  math,
  ModelMemento,
  NavCubePlugin,
  OBJLoaderPlugin,
  PointerLens,
  SectionPlanesPlugin,
  STLLoaderPlugin,
  StoreyViewsPlugin,
  TreeViewPlugin,
  Viewer,
  XKTLoaderPlugin,
} from '@xeokit/xeokit-sdk';

import { DistanceMeasurementEditMouseControl } from '@xeokit/xeokit-sdk/src/plugins/DistanceMeasurementsPlugin/index.js';

import {
  ZoneEditMouseControl,
  ZonesMouseControl,
  ZonesPlugin,
  ZoneTranslateMouseControl,
} from '@xeokit/xeokit-sdk/src/plugins/ZonesPlugin';

import { DotBIMLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/DotBIMLoaderPlugin/DotBIMLoaderPlugin.js';

import { utils } from '@xeokit/xeokit-sdk/src/viewer/scene/utils';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      Viewer,
      FastNavPlugin,
      NavCubePlugin,
      ContextMenu,
      CameraMemento,
      ModelMemento,
      TreeViewPlugin,
      StoreyViewsPlugin,
      PointerLens,
      DistanceMeasurementsPlugin,
      SectionPlanesPlugin,
      BCFViewpointsPlugin,
      DistanceMeasurementsMouseControl,
      DistanceMeasurementsTouchControl,
      DistanceMeasurementEditMouseControl,

      ZonesPlugin,
      ZoneTranslateMouseControl,
      ZonesMouseControl,
      ZoneEditMouseControl,

      AnnotationsPlugin,

      math,

      XKTLoaderPlugin,
      LASLoaderPlugin,
      OBJLoaderPlugin,
      STLLoaderPlugin,
      GLTFLoaderPlugin,
      DotBIMLoaderPlugin,

      utils,
    },
  };
});

export type ViewerType = InstanceType<typeof Viewer>;
export type XKTLoaderPluginType = InstanceType<typeof XKTLoaderPlugin>;
export type SectionPlanesPluginType = InstanceType<typeof SectionPlanesPlugin>;
export type BCFViewpointsPluginType = InstanceType<typeof BCFViewpointsPlugin>;
export type AnnotationsPluginType = InstanceType<typeof AnnotationsPlugin>;
