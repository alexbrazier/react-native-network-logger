const fromEntries = (arr: any[]) =>
  arr.reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});

export default fromEntries;
