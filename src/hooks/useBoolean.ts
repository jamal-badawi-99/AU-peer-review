import React from "react";
export default function useBoolean() {
  const [state, setState] = React.useState(false);
  const enable = React.useCallback(() => setState(true), []);
  const disable = React.useCallback(() => setState(false), []);
  return [state, enable, disable] as const;
}
