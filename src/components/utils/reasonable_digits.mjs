export function get_reasonable_digits(min, max) {
  let digits = 0;
  switch (Math.abs(max - min)) {
    case (v) => v < 10 && v > 1:
      digits = 1;
      break;
    case (v) => v < 1 && v > 0.1:
      digits = 2;
      break;
    case (v) => v < 0.1:
      digits = 3;
      break;
  }
  return digits;
}