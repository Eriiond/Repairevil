export function shortenNumberText(number) {
  if (Math.abs(number) > 999) {
    const r1 = number / 1000;
    if (Math.abs(r1) > 999) {
      return parseFloat(Math.sign(r1) * (Math.abs(r1) / 1000).toFixed(1)) + "m";
    } else {
      return parseFloat(r1.toFixed(1)) + "k";
    }
  } else {
    return parseFloat(number.toFixed(1));
  }
}

export function connectionText(number) {
  const str = "" + Math.floor(number);
  const result = str + "%";
  return result;
}
