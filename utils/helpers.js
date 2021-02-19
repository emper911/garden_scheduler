export const stringDeepCopy = (obj) => {
  if (obj !== undefined) return JSON.parse(JSON.stringify(obj));
  else return undefined;
};

