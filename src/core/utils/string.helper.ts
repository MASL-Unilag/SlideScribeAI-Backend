export class StringHelper {
  static generateHexColorCode() {
    const hexColorAlphabets = "ABCDEF";
    const hexColorNumbers = "0123456789";

    return `${StringHelper._randomlyPick(
      hexColorAlphabets,
    )}${StringHelper._randomlyPick(
      hexColorNumbers,
    )}${StringHelper._randomlyPick(hexColorAlphabets)}`;
  }

  private static _randomlyPick = (value: string) => {
    const firstIndex = Math.round(Math.random());
    const secondIndex = Math.round(Math.random());

    return `${value.at(firstIndex)}${value.at(secondIndex)}`;
  };
}
