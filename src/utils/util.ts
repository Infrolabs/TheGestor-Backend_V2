import { EVatType } from "@/interfaces/invoice.interface";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const removeEmptyKeys = (object: Object): any => {
  return Object.fromEntries(Object.entries(object).filter(([_, v]) => v != null));
}

export const getNameAndSurname = (fullName: string): { name: string, surname: string } => {
  const name = fullName.slice(0, fullName.indexOf(" "))
  const surname = fullName.slice(fullName.indexOf(" ") + 1)
  return { name, surname }
}

export const numberToStr = (number: string, padding: number, multiplier = 100) => {
  const str = parseFloat(number) ? String(Math.abs(Math.round(parseFloat(number) * multiplier))) : "0"
  if (parseFloat(number) < 0)
    return "N" + str.padStart(padding - 1, '0')

  return str.padStart(padding, '0')
}

export const getTrimesterStartDate = (trimester: number, year: number): Date => {
  if (trimester < 0 || trimester > 4)
    throw Error("Invalid trimester")
  const date = new Date()
  date.setFullYear(year, trimester === 0 ? 0 : (trimester - 1) * 3, 1)
  date.setHours(0, 0, 0, 0)
  return date
}

export const getTrimesterEndDate = (trimester: number, year: number): Date => {
  if (trimester < 0 || trimester > 4)
    throw Error("Invalid trimester")
  const date = new Date()
  date.setFullYear(year, trimester === 0 ? 12 : trimester * 3, 0)
  date.setHours(23, 59, 59, 999)
  return date
}

export const getVatFromBase = (base: number, vatType: EVatType): number => {
  if (vatType === EVatType.STANDARD_21 || vatType === EVatType.INTRA_COM_21)
    return base * 0.21
  if (vatType === EVatType.STANDARD_21_52)
    return base * 0.262
  if (vatType === EVatType.REDUCED_10 || vatType === EVatType.INTRA_COM_10)
    return base * 0.1
  if (vatType === EVatType.REDUCED_10_14)
    return base * 0.114
  if (vatType === EVatType.SUPER_REDUCED_4 || vatType === EVatType.INTRA_COM_4)
    return base * 0.04
  if (vatType === EVatType.SUPER_REDUCED_4_05)
    return base * 0.045
  return 0
}