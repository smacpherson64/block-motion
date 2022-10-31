import { hash as Hash } from "../dependencies/isometric.ts";

export async function hash(input: string) {
  const hashFunc = Hash.createSHA3(224);
  const hmac = await Hash.createHMAC(hashFunc, "key");

  hmac.init();
  hmac.update(input);
  return hmac.digest();
}
