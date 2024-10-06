import { AppRouter, AppRouterOutput } from "~/server/api/[trpc]";
import { DataSourceXKT } from "~/utils/viewer/loaders/data-sources/data-source-xkt";

import { type MetaObject } from "~/server/store/store.service";

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
      // @ts-ignore xeokit
      readableGeometryEnabled: true,
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
    xktLoaderPlugin.globalizeObjectIds = false;

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

  function getMetaObject(id: string): MetaObject | null {
    if (!viewer) return null;



    // @ts-ignore xeokit
    const metaObjectJson = viewer.metaScene.metaObjects[id].getJSON();
    //console.log({metaObjectJson});



    viewer.metaScene.metaObjects[id].propertySets.forEach((pset) => {
      pset.properties.forEach((p) => {
        //console.log({p});

        if (!metaObjectJson.propertSets) {
          metaObjectJson.propertySets = {};
        }

        metaObjectJson.propertySets[p.name] = p.value;

        const entity = viewer?.scene.objects[id];

        if (entity) {
          // @ts-ignore xeokit
          metaObjectJson.surface = entity.surfaceArea?.toFixed(3) ?? 0;
          // @ts-ignore xeokit
          console.log(entity.surfaceArea);
          // @ts-ignore xeokit
          metaObjectJson.volume = entity.volume?.toFixed(3) ?? 0;

          console.log('Entity found!');
        } else {
          console.log('Entity not found!');
        }
      });
    });

    return {
      id: metaObjectJson.id,
      type: metaObjectJson.type,
      name: metaObjectJson.name,
      parent: metaObjectJson.parent ?? null,
      data: JSON.stringify(metaObjectJson),
    };
  }

  function getAllMetaObjects() {
    if (!viewer) return;

    //let result = 'These are the properties for all objects:\n';



    const allMetaObjects: MetaObject[] = [];

    for (const id in viewer.metaScene.metaObjects) {
      const metaObject = getMetaObject(id);
      if (!metaObject) continue;

      allMetaObjects.push(metaObject);
    }

    const { $trpc } = useNuxtApp();
    const chatStore = useChatStore();

    if (!chatStore.chat) return;
    $trpc.store.storeMeta.mutate({ chatId: chatStore.chat?.id, metaObjects: allMetaObjects });

    //return result;
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
