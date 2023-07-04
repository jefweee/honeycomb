import * as React from "react";
import { render } from "react-dom";
import { HoneyComb } from "./honeyComb/honeyComb";
import styles from "./styles.module.css";
import { bucketKeysOptions, aggregateOptions } from "./data/App.constants";

function App() {
  const [bucketKeys, setBucketKeys] = React.useState(
    bucketKeysOptions[0].value
  );
  const [colorDimension, setColorDimension] = React.useState(
    aggregateOptions[0].value
  );
  return (
    <>
      <div className={styles.App}>
        <HoneyComb bucketKeys={bucketKeys} colorDimension={colorDimension} />
      </div>
      <select
        onChange={({ target: { value } }) => {
          setBucketKeys(value.split(","));
        }}
        className={styles.select}
      >
        {bucketKeysOptions.map(({ label, value }, index) => (
          <option value={value} key={label}>
            {label}
          </option>
        ))}
      </select>

      <select
        onChange={({ target: { value } }) => {
          setColorDimension(value);
        }}
        className={styles.select}
      >
        {aggregateOptions.map(({ label, value }, index) => (
          <option value={value} key={label}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
