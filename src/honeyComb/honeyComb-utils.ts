import { values, groupBy } from "lodash";

export function bucketizeData(
  visualData,
  bucketKeys,
  selectedBucketIdx = 0,
  accum = []
) {
  const selectedBucketKey = bucketKeys[selectedBucketIdx];
  const selectedValues = values(
    groupBy(visualData, ({ metaData: { data } }) => data[selectedBucketKey])
  );
  if (selectedBucketIdx + 2 < bucketKeys.length) {
    selectedValues.forEach(groupData => {
      bucketizeData(groupData, bucketKeys, selectedBucketIdx + 1, accum);
    });
  } else {
    accum.push(...selectedValues);
  }
  return accum;
}

export function getColorValue(val) {
  if (val < 50) {
    return "#69db4a";
  } else if (val < 80) {
    return "#e1c60e";
  } else {
    return "#c73a25";
  }
}

// ************** TODO: Revisit this logic.
export function bestFitElemCountPerRow(bucketLen, width, height) {
  let countPerRow = bucketLen;
  for (let r = 1, base = Infinity; r <= bucketLen; r += 1) {
    const w = Math.floor(width / r);
    const h = (2 * w) / 3;
    const netSpaceLost = Math.abs(width * height - bucketLen * w * h);
    if (netSpaceLost < base) {
      base = netSpaceLost;
      countPerRow = r;
    }
  }
  return countPerRow;
}
