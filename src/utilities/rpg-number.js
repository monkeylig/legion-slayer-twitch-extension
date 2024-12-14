/**
 * 
 * @param {number} number 
 * @returns {string}
 */
export default function RPGNumber(number) {
   if (number < 99 && number > 0) {
      return number.toFixed(1);
   }
   return number.toFixed(0);
}
