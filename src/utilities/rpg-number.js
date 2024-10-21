/**
 * 
 * @param {number} number 
 * @returns {string}
 */
export default function RPGNumber(number) {
   if (number < 1 && number > 0) {
      return 1;
   }
   return number.toFixed(0)
}
