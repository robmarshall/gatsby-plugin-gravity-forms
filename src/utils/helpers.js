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

export const valueToLowerCase = (string) =>
  string ? string.toLowerCase() : "";