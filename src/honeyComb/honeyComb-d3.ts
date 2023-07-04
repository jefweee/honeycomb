import {
  interpolateYlOrRd,
  transition,
  min,
  select,
  style,
  event,
  zoom,
  zoomIdentity
} from "d3";
import { hexbin as d3Hexbin } from "d3-hexbin";
// import { zoom as d3Zoom } from "d3-zoom";
import { bestFitElemCountPerRow } from "./honeyComb-utils";
import { getColorValue } from "./honeyComb-utils";

function getPlaceHolderElems(rows, columns, len, radius) {
  let points = [];
  for (let i = 0, count = 0; i < rows; i++) {
    for (let j = 0; j < columns && count <= len - 1; j++, count++) {
      points.push([radius * j * 1.75, radius * i * 1.5]);
    }
  }
  return points;
}

function renderHoneyComb(data, index, { width, height, x, y, colorDimension }) {
  function getColors(d, i) {
    var value = data[i].aggregateInfo[colorDimension];
    return getColorValue(value);
  }

  const svgGroup = select(this);
  const t = transition().duration(1000);

  const MapColumns = Math.ceil(
    data.length / Math.floor(Math.sqrt(data.length))
  );
  const MapRows = Math.ceil(data.length / MapColumns);

  //The maximum radius the hexagons can have to still fit the screen
  const hexRadius = Math.floor(
    min([
      width / ((MapColumns + 0.5) * Math.sqrt(3)),
      height / ((MapRows + 1 / 3) * 1.5),
      width / 7
    ])
  );

  var points = getPlaceHolderElems(MapRows, MapColumns, data.length, hexRadius);

  var offSetX = hexRadius * Math.cos((30 * Math.PI) / 180);
  var adjustedOffSetX =
    offSetX + (width - offSetX * 2 * MapColumns - offSetX) / 2;
  var coverredHeight = hexRadius * 2 + MapRows * ((3 * hexRadius) / 4);
  var offSetY = hexRadius;

  //Set the hexagon radius
  const hexbin = d3Hexbin().radius(hexRadius);
  const zeroHexBin = d3Hexbin().radius(0);

  const translateX = adjustedOffSetX + x;
  const translateY = offSetY + y;

  svgGroup
    .attr("width", width)
    .attr("height", height)
    .attr("transform", `translate(${translateX},${translateY})`);

  //Draw the hexagons
  var hexagons = svgGroup.selectAll(".hexagon").data(hexbin(points));

  hexagons.exit().remove();

  hexagons
    .transition(t)
    .style("fill", getColors)
    .attr("d", function(d) {
      return "M" + d.x + "," + d.y + hexbin.hexagon();
    });

  hexagons
    .enter()
    .append("path")
    .attr("class", "hexagon")
    .attr("d", function(d) {
      return "M" + d.x + "," + d.y + zeroHexBin.hexagon();
    })
    .attr("stroke", "white")
    .attr("stroke-width", "1px")
    .style("fill", getColors)
    .style("fill-opacity", 1)
    .transition(t)
    .attr("d", function(d) {
      return "M" + d.x + "," + d.y + hexbin.hexagon();
    });
}

export function renderFn(
  buckets,
  colorDimension,
  { width, height, parentGroupEl }
) {
  // Adding data to the svg-group elements
  const parentGroup = select(parentGroupEl)
    .attr("width", width)
    .attr("height", height);

  const groups = parentGroup.selectAll("g").data(buckets);

  // Determine the best fitting countPerRow. (Min. unused space).
  let countPerRow = bestFitElemCountPerRow(buckets.length, width, height);
  // Deterimine the unit dimensions for each svg group.
  const unitWidth = Math.floor(width / countPerRow);
  const rowCount = Math.ceil(buckets.length / countPerRow);
  const unitHeight = height / rowCount;

  function childRenderFn(d, i) {
    const x = unitWidth * (i % countPerRow);
    const y = unitHeight * Math.floor(i / countPerRow);
    // Send the unit diminesions to update the groups dimensions and (x, y) for appropiate translations
    renderHoneyComb.call(this, d, i, {
      width: unitWidth,
      height: unitHeight,
      x,
      y,
      colorDimension
    });
  }

  groups.each(childRenderFn);

  groups.exit().remove();

  groups
    .enter()
    .append("g")
    .each(childRenderFn);
}

export function updateZoomRect(zoomEl, { width, height, parentGroupEl }) {
  const minZoomLimit = 1;
  const maxZoomLimit = 50;
  const parentGroupSelection = select(parentGroupEl);
  const zoomSelection = select(zoomEl);
  const t = transition().duration(750);

  const zoomExtent = zoom()
    .scaleExtent([minZoomLimit, maxZoomLimit])
    .on("zoom", zoomed);

  zoomSelection
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoomExtent);

  function zoomed() {
    parentGroupSelection.attr("transform", event.transform);
  }
}
