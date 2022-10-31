export default function inverse<Fn extends (...args: any[]) => any>(fn: Fn) {
  return (...args: Parameters<Fn>) => !fn(...args);
}
