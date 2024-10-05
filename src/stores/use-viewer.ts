import { DataSourceXKT } from "~/utils/viewer/loaders/data-sources/data-source-xkt";

export type ViewerStoreState = {
  isLoading: boolean;
  isInitialized: boolean;
};

export const useViewerStore = defineStore('viewer-store', () => {
  const { $FastNavPlugin, $NavCubePlugin, $Viewer, $math, $XKTLoaderPlugin } = useNuxtApp();

  const tempVec3 = ($math as any).vec3();
  let viewer: InstanceType<typeof $Viewer> | undefined;
  let fastNavPlugin: InstanceType<typeof $FastNavPlugin> | undefined;
  let navCubePlugin: InstanceType<typeof $NavCubePlugin> | undefined;

  let xktLoaderPlugin: InstanceType<typeof $XKTLoaderPlugin> | undefined = undefined;

  const state: ViewerStoreState = reactive({
    isLoading: true,
    isInitialized: false,
  });

  function getHelpers() {
    return {
      viewer,
      navCubePlugin,
      fastNavPlugin,
    };
  }

  function getLoaders() {
    return {
      xktLoaderPlugin,
    };
  }

  function initViewer() {
    viewer = new $Viewer({
      canvasId: 'xeokit-canvas',
      transparent: true,
      dtxEnabled: true,
      saoEnabled: true,
    });

    viewer.cameraControl.navMode = 'orbit';
    viewer.cameraControl.followPointer = true;

    xktLoaderPlugin = new $XKTLoaderPlugin(viewer);

    xktLoaderPlugin = new $XKTLoaderPlugin(viewer, {
      dataSource: new DataSourceXKT({
        cacheBuster: false,
      }),
    });

    // TODO: Set to true when you need to load multiple instances of the same model
    xktLoaderPlugin.globalizeObjectIds = true;

    navCubePlugin = new $NavCubePlugin(viewer, {
      canvasId: 'xeokit-canvas-cube',
      visible: true,
      fitVisible: true,
      color: '#CFCFCF',
      synchProjection: true,
      shadowVisible: false,
      cameraFly: true, // Fly camera to each selected axis/diagonal
      cameraFitFOV: 45, // How much field-of-view the scene takes once camera has fitted it to view
      cameraFlyDuration: 0.5,
    });

    fastNavPlugin = new $FastNavPlugin(viewer, {
      hideEdges: true,
      hideSAO: true,
      hidePBR: true,
      //@ts-ignore
      hideColorTexture: false,
      hideTransparentObjects: false,
      scaleCanvasResolution: false,
      scaleCanvasResolutionFactor: 0.5,
      // scaleCanvasResolution: true,      // Reduce canvas resolution while moving (default is false)
      // scaleCanvasResolutionFactor: 0.5,
      delayBeforeRestore: true,
      delayBeforeRestoreSeconds: 0.4,
    });

    state.isInitialized = true;
  }

  function viewFit() {
    if (!viewer) return;

    const scene = viewer.scene;
    const aabb = scene.getAABB(scene.visibleObjectIds);

    viewer.cameraFlight.flyTo({ aabb: aabb });
    viewer.cameraControl.pivotPos = $math.getAABB3Center(aabb, () => tempVec3);
  }

  function getMetaObject(id: string) {
    if (!viewer) return;

    let result = `These are the properties for the object (${id}):\n`;

    viewer.metaScene.metaObjects[id].propertySets.forEach((pset) => {
      pset.properties.forEach((p) => {
        result += `${pset.name}.${p.name}=${p.value}`;
      });
    });

    return result;
  }

  function getAllMetaObjects() {
    if (!viewer) return;

    let result = 'These are the properties for all objects:\n';

    for (const id in viewer.metaScene.metaObjects) {
      result += getMetaObject(id);
    }

    return result;
  }

  return {
    ...toRefs(state),
    getHelpers,
    getLoaders,
    initViewer,
    viewFit,
    getMetaObject,
    getAllMetaObjects,
  };
});
