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

      viewerStore.getAllMetaObjects();

      if (viewer) {
        const sceneAABB = viewer.scene.getAABB(viewer.scene.visibleObjectIds);
        viewer.cameraFlight.jumpTo({ aabb: sceneAABB });
        viewer.cameraControl.pivotPos = $math.getAABB3Center(sceneAABB);



        const canvas = window.document.getElementById("xeokit-canvas");
        // if (canvas) {
        //   canvas.addEventListener("mousemove", (function() {
        //     const px = v => v + "px";

        //     const metricsDiv = document.createElement("div");
        //     document.body.appendChild(metricsDiv);
        //     metricsDiv.style.position = "absolute";
        //     metricsDiv.style.color = "black";
        //     metricsDiv.style.background = "white";
        //     metricsDiv.style.borderRadius = "5px";
        //     metricsDiv.style.padding = "5px 10px";
        //     metricsDiv.style.pointerEvents = "none";

        //     let highlighted = null;

        //     return function(event) {
        //         const rect = canvas.getBoundingClientRect();
        //         const canvasPos = [ event.clientX - rect.left, event.clientY - rect.top ];
        //         const pickRecord = viewer.scene.pick({ canvasPos: canvasPos });


        //         const pickEntity = pickRecord && pickRecord.entity && pickRecord.entity.model && pickRecord.entity;

        //         if (highlighted && (highlighted !== pickEntity))
        //         {
        //             highlighted.highlighted = false;
        //             highlighted = null;
        //         }

        //         if (pickEntity)
        //         {
        //             if (! highlighted)
        //             {
        //                 highlighted = pickEntity;
        //                 highlighted.highlighted = true;

        //                 try {
        //                     metricsDiv.innerHTML = `pickEntity.id = ${pickEntity.id}<br />pickEntity.volume = ${highlighted.volume.toFixed(3)} [u³]`;
        //                 } catch (e) {
        //                     metricsDiv.innerHTML = e.toString();
        //                     console.error(e);
        //                 }
        //             }

        //             metricsDiv.style.left = px(canvasPos[0] + 20);
        //             metricsDiv.style.top  = px(canvasPos[1] - 100);
        //         }

        //         metricsDiv.style.display = highlighted ? "" : "none";
        //     }
        // })());
        // }

      }

      resolve(sceneModel.id);
    });

    sceneModel.on('error', function (error) {
      console.error(error);
      reject(error);
    });
  });
}
