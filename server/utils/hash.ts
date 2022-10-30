import {
  createHMAC,
  createSHA3,
} from "https://cdn.jsdelivr.net/npm/hash-wasm@4";

export async function hash(input: string) {
  const hashFunc = createSHA3(224);
  const hmac = await createHMAC(hashFunc, "key");

  hmac.init();
  hmac.update(input);
  return hmac.digest();
}
