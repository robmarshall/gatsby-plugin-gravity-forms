export const createGfKeyFromField = (string) => {
  const fieldName = "input_";
  const field = string.slice(string.indexOf(fieldName) + fieldName.length);
  return field.replace("_", ".");
};

export const doesObjectExist = (obj) => {
  if (typeof obj !== "undefined") {
    return true;
  }
  return false;
};

export const filteredKeys = (obj, filter) => {
  let key,
    keys = [];
  for (key in obj)
    if ({}.hasOwnProperty.call(obj, key) && filter.test(key)) keys.push(key);
  return keys;
};

export const get = (obj, path, def) =>
  (() =>
    typeof path === "string"
      ? path.replace(/\[(\d+)]/g, ".$1")
      : path.join("."))()
    .split(".")
    .filter(Boolean)
    .every((step) => (obj = obj[step]) !== undefined)
    ? obj
    : def;

export const valueToLowerCase = (string) =>
  string ? string.toLowerCase() : "";
