const minVisibleSize = 50;

function unionAABBs(aabb1: number[], aabb2: number[]): number[] {
  const result = new Array(6);

  // Calculate the minimum coordinates
  for (let i = 0; i < 3; i++) {
    result[i] = Math.min(aabb1[i], aabb2[i]);
  }

  // Calculate the maximum coordinates
  for (let i = 3; i < 6; i++) {
    result[i] = Math.max(aabb1[i], aabb2[i]);
  }

  return result;
}

function calculateMaxAllowableDistance(modelsAABBs: number[][], cameraFarPlaneDistance: number) {
  let smallestModelSize = Infinity;

  modelsAABBs.forEach((aabb) => {
    const size = getAABBSize(aabb);
    const maxDimension = Math.max(size[0], size[1], size[2]);
    smallestModelSize = Math.min(smallestModelSize, maxDimension);
  });

  // Calculate the maximum allowable distance
  const maxAllowableDistance = (smallestModelSize * cameraFarPlaneDistance) / minVisibleSize;

  return maxAllowableDistance;
}

function getAABBSize(aabb: number[]): [number, number, number] {
  return [
    aabb[3] - aabb[0], // Width (X-axis)
    aabb[4] - aabb[1], // Height (Y-axis)
    aabb[5] - aabb[2], // Depth (Z-axis)
  ];
}

export function getAABBCenter(aabb: number[]): [number, number, number] {
  return [
    (aabb[0] + aabb[3]) / 2, // Center X
    (aabb[1] + aabb[4]) / 2, // Center Y
    (aabb[2] + aabb[5]) / 2, // Center Z
  ];
}

function calculateVectorDistance(
  v1: [number, number, number],
  v2: [number, number, number],
): number {
  const dx = v2[0] - v1[0];
  const dy = v2[1] - v1[1];
  const dz = v2[2] - v1[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function calculateAABBDiagonalLength(aabb: number[]): number {
  const dx = aabb[3] - aabb[0];
  const dy = aabb[4] - aabb[1];
  const dz = aabb[5] - aabb[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function calculatePairwiseDistances(modelsAABBs: number[][]) {
  const distances: { models: number[]; distance: number }[] = [];

  for (let i = 0; i < modelsAABBs.length; i++) {
    for (let j = i + 1; j < modelsAABBs.length; j++) {
      const center1 = getAABBCenter(modelsAABBs[i]);
      const center2 = getAABBCenter(modelsAABBs[j]);

      const distance = calculateVectorDistance(center1, center2);
      distances.push({ models: [i, j], distance });
    }
  }
  return distances;
}

type ModelsVisibility = {
  status: boolean;
  actualMaxDistance: number;
  maxAllowableDistance: number;
};

export function checkModelsVisibility(
  modelsAABBs: number[][],
  cameraFarPlaneDistance: number,
): ModelsVisibility {
  if (modelsAABBs.length < 2) {
    return { status: true, actualMaxDistance: 0, maxAllowableDistance: 0 };
  }

  const maxAllowableDistance = calculateMaxAllowableDistance(modelsAABBs, cameraFarPlaneDistance);

  // Calculate the bounding box that encompasses all models
  let combinedAABB = [0, 0, 0, 0, 0, 0];

  modelsAABBs.forEach((aabb) => {
    combinedAABB = unionAABBs(combinedAABB, aabb);
  });

  // Calculate the diagonal length of the combined bounding box
  const actualMaxDistance = calculateAABBDiagonalLength(combinedAABB);

  if (actualMaxDistance > maxAllowableDistance) {
    return { status: false, actualMaxDistance, maxAllowableDistance };
  }

  return { status: true, actualMaxDistance: 0, maxAllowableDistance: 0 };
}
