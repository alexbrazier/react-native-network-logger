"use strict";

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
function debounce(func, wait, immediate = false) {
  let timeout;
  return function () {
    const args = arguments;
    clearTimeout(timeout);
    // @ts-ignore
    if (immediate && !timeout) func.apply(this, args);
    timeout = setTimeout(function () {
      timeout = undefined;
      // @ts-ignore
      if (!immediate) func.apply(this, args);
    }, wait);
  };
}
export default debounce;
//# sourceMappingURL=debounce.js.map