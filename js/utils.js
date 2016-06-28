/**
 * @description Helper method to generate random numbers.
 * @param {int} limit - Variable to set the max value possible generated.
 */
function generateRandom(limit){
  return ((Math.floor((Math.random() * 10)) % limit) + 1)
}
