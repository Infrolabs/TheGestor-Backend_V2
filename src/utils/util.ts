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

export const removeEmptyKeys = (object: Object) : any => {
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