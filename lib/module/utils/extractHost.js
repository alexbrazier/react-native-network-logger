"use strict";

const extractHost = url => {
  const host = url.split('//')[1]?.split(':')[0]?.split('/')[0] || undefined;
  return host;
};
export default extractHost;
//# sourceMappingURL=extractHost.js.map