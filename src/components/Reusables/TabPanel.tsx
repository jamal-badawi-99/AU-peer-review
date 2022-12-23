import React from "react";

interface Props {
  children?: React.ReactNode;
  index: number;
  value: number;
  other?: any;
}

export default React.memo(TabPanel);

function TabPanel(props: Props) {
  const { index, value, children, other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && <div style={{ height: "100%" }}>{children}</div>}
    </div>
  );
}
