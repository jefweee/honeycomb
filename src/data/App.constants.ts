export const bucketKeysOptions = [
  {
    label: "SourceHosts Grouped By SourceCategory",
    value: ["_sourceCategory", "_sourceHost"]
  },
  {
    label: "All SourceHost",
    value: ["_sourceHost"]
  },
  {
    label: "All SourceCategory",
    value: ["_sourceCategory"]
  }
];

export const aggregateOptions = [
  "max",
  "avg",
  "count",
  "latest",
  "min",
  "sum"
].map(text => ({
  label: text,
  value: text
}));
