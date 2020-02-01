export function planetText(number) {
  const str = "" + number / 1000;
  const segments = str.split(".");
  if (segments.length < 2) {
    return str;
  }
  const result = segments[0] + "." + segments[1].slice(0, 1) + "k";
  return result;
}

export function connectionText(number) {
  const str = "" + Math.floor(number);
  const result = str + "%";
  return result;
}
