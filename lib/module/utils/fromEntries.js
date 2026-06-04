"use strict";

const fromEntries = arr => arr.reduce((acc, [k, v]) => {
  acc[k] = v;
  return acc;
}, {});
export default fromEntries;
//# sourceMappingURL=fromEntries.js.map