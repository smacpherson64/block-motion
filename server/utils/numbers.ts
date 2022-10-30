export const clamp = (min: number, max: number) => (number: number) => {
  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
};

export const wrap = (min: number, max: number) => (number: number) =>
  number < min ? max : number > max ? min : number;
