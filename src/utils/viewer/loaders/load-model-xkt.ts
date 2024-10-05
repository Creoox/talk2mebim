import { getAABBCenter } from '~/utils/viewer/models-distance';

export async function loadModelXKT(
  id: string,
  sources: string[],
  options?: {
    bcfURL?: string;
    position?: (number | null | undefined)[];
    rotation?: (number | null | undefined)[];
    scale?: (number | null | undefined)[];
  },
): Promise<string | undefined> {
  const viewerStore = useViewerStore();

  const viewer = viewerStore.getHelpers().viewer;
  const loader = viewerStore.getLoaders().xktLoaderPlugin;
  const { $math } = useNuxtApp();

  console.log({viewer, loader});

  if (!viewerStore.isInitialized || !loader) return;
  console.log('loadModelXKT', { id, sources, options });

  const t0 = performance.now();
  const sceneModel = loader.load({
    id,
    manifest: {
      xktFiles: sources,
    },
  });

  return new Promise((resolve, reject) => {
    sceneModel.on('loaded', function () {
      console.log(
        `Model ${id} loaded in ${Math.floor(performance.now() - t0) / 1000.0} seconds, objects: ${Object.keys(sceneModel.objects).length}`,
      );

      const modelCenterPosition = getAABBCenter(sceneModel.aabb);

      console.log('Model Info', {
        sceneModel: sceneModel,
        id,
        origin: sceneModel.origin,
        position: sceneModel.position,
        positionFromAABB: modelCenterPosition,
        rotation: sceneModel.rotation,
        scale: sceneModel.scale,
        aabb: sceneModel.aabb,
        worldMatrix: sceneModel.worldMatrix,
        worldNormalMatrix: sceneModel.worldNormalMatrix,
      });

      if (viewer) {
        const sceneAABB = viewer.scene.getAABB(viewer.scene.visibleObjectIds);
        viewer.cameraFlight.jumpTo({ aabb: sceneAABB });
        viewer.cameraControl.pivotPos = $math.getAABB3Center(sceneAABB);
      }

      resolve(sceneModel.id);
    });

    sceneModel.on('error', function (error) {
      console.error(error);
      reject(error);
    });
  });
}
