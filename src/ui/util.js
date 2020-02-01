export function shortenNumberText(number) {
  const r1 =
    Math.abs(number) > 999
      ? Math.sign(number) * (Math.abs(number) / 1000).toFixed(1)
      : Math.sign(number) * Math.abs(number);

  if (r1 > 999) {
    return Math.sign(r1) * (Math.abs(r1) / 1000).toFixed(1) + "m";
  } else {
    return r1 + "k";
  }
}

export function connectionText(number) {
  const str = "" + Math.floor(number);
  const result = str + "%";
  return result;
}
