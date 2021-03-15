/**
 * Holds top level functions for ui abstraction
 * Author: @ia.n.stagram
 */

const PASS_KEY = 'lspass';
var pass = 'undef';
console.log('ui abstraction started...');

/**
 * Set attribute for div with id id
 */
function set_att(id, val){
    document.getElementById(id).innerHTML = val;
}

/**
 * Log out of website, clear all cookies and go to google
 */
function log_out(){
    localStorage.removeItem(PASS_KEY);
    window.location = 'http://zetapsi.mit.edu';
}

/**
 * Log in to account, set global variable pass equal to the password (as well as setting cookie)
 */
function log_in(){
    // acquire GET params
    var $_GET = {};
    if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
            .toString()
            // get the query string
            .replace(/^.*?\?/, '')
            // and remove any existing hash string (thanks, @vrijdenker)
            .replace(/#.*$/, '')
            .split('&');

        for(var i=0, l=query.length; i<l; i++) {
            var aux = decodeURIComponent(query[i]).split('=');
            $_GET[aux[0]] = aux[1];
        }
    }

    // if pass was passed, use it, otherwise use localstorage
    if ($_GET['pass'] !== undefined){
        pass = $_GET['pass'];
        localStorage.setItem(PASS_KEY, pass);
    } else if (localStorage.getItem(PASS_KEY) !== null) {
        pass = localStorage.getItem(PASS_KEY);
    } else{
        alert('Please log in before attempting to trade! This can be done with an appropriately formed login link');
        window.location = 'http://zetapsi.mit.edu';
    }
}

/**
 * Generic onload hook, called by dashboard.html
 */
function onload(){
    // handle login
    log_in();

    // handle update times
    let d = function(x){return (x.toString().length < 2)? '0' + x : x};
    var today = new Date();
    var time = 'Last updated at '+d(today.getHours()) + ":" + d(today.getMinutes())+ ":" + d(today.getSeconds());
    for (var e = 1; e <= 4; ++e)
        set_att('up' + e.toString(), time);
}

function update_price(){
    let stock = document.getElementById('info_stock').value;
    let price = api_get_price(stock);
    document.getElementById('price_info').innerHTML = `Stock Price ($): ${price}`;
}

function sell_shares(){
    let stock = document.getElementById('stock_sell').value;
    let qty = document.getElementById('sell_qty').value;
    return api_execute(stock, qty, 'SELL');
}

function buy_shares(){
    let stock = document.getElementById('stock_buy').value;
    let qty = document.getElementById('buy_qty').value;
    return api_execute(stock, qty, 'BUY');
}