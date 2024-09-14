export class UtilsService {
  static *generateRandomString(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const base = characters.length;
    const totalCombinations = Math.pow(base, length);

    for (let i = 0; i < totalCombinations; i++) {
      let result = '';
      let num = i;

      for (let j = 0; j < length; j++) {
        result = characters[num % base] + result;
        num = Math.floor(num / base);
      }

      yield result;
    }
  }
}
