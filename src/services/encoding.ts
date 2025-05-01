const charset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function encodeBase62(num: number): string {
  let str = "";
  while (num > 0) {
    str = charset[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str || "a";
}

function decodeBase62(str: string): number {
  return str.split("").reduce(
    (acc, char) => acc * 62 + charset.indexOf(char),
    0,
  );
}

export { decodeBase62, encodeBase62 };
