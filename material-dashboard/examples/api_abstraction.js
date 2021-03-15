/**
 * Holds api calls, according to spec in api-defs.txt
 * Author: @ia.n.stagram
 */

/**
 * Get price for stock on server
 * @param stock stock to get price for
 */
function api_get_price(stock){
    return 420.69;
}

/**
 * Execute either a buy or sell on the server
 * @param stock stock symbol to execute on
 * @param qty attempted quantity to execute
 * @param type either 'BUY' or 'SELL'
 * @returns true on success, otherwise false
 */
function api_execute(stock, qty, type){
    console.log(`Executing: operation ${type} with quantity ${qty} and symbol ${stock}`);
    return false;
}