import * as React from "react";
import styles from "./honeyComb.module.css";
import { useEffect, useRef, FunctionComponent } from "react";
import { bucketizeData } from "./honeyComb-utils";
import { CPU_Usage } from "../data/CPU_Usage";
import { renderFn, updateZoomRect } from "./honeyComb-d3";

interface HoneyCombProps {
  bucketKeys: string[];
  colorDimension: string;
}

export const HoneyComb: FunctionComponent<HoneyCombProps> = props => {
  const groupEl = useRef(null);
  const svgEl = useRef(null);
  const zoomEl = useRef(null);

  useEffect(() => {
    // TODO: Remove the any type below.
    const { width, height } = (svgEl.current as any).getBoundingClientRect();
    var buckets = bucketizeData(CPU_Usage.slice(0, 80), props.bucketKeys);
    const renderProps = {
      width,
      height,
      parentGroupEl: groupEl.current
    };
    updateZoomRect(zoomEl.current, renderProps);
    renderFn(buckets, props.colorDimension, renderProps);
  });
  return (
    <svg className={styles.svg} ref={svgEl}>
      <g ref={groupEl} />
      <rect ref={zoomEl} />
    </svg>
  );
};
