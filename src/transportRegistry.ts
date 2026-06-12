export type NetworkTransportAdapter = {
  isInterceptorEnabled: () => boolean;
  setOpenCallback: (callback: (...args: any[]) => void) => void;
  setRequestHeaderCallback: (callback: (...args: any[]) => void) => void;
  setSendCallback: (callback: (...args: any[]) => void) => void;
  setHeaderReceivedCallback: (callback: (...args: any[]) => void) => void;
  setResponseCallback: (callback: (...args: any[]) => void) => void;
  enableInterception: () => void;
  disableInterception: () => void;
};

const transports = new Map<string, NetworkTransportAdapter>();

export const registerNetworkTransport = (
  name: string,
  transport: NetworkTransportAdapter
) => {
  transports.set(name, transport);
};

export const unregisterNetworkTransport = (name: string) => {
  transports.delete(name);
};

export const getNetworkTransport = (name: string) => transports.get(name);
