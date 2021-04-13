/**
 * Holds top level functions for ui abstraction
 * Author: @ia.n.stagram
 */

const PASS_KEY = 'lspass';
let SERVER_RESOLUTION = 744; // 744 for hour -> month, 1 for hour -> hour
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
    api_populate(populate_tickers);
    set_team_name();
    ui_date();

    // handle update times
    let d = function(x){return (x.toString().length < 2)? '0' + x : x};
    var today = new Date();
    var time = 'Last updated at '+d(today.getHours()) + ":" + d(today.getMinutes())+ ":" + d(today.getSeconds());
    for (var e = 1; e <= 4; ++e)
        set_att('up' + e.toString(), time);
}

function update_price(){
    let stock = document.getElementById('info_stock').value;
    api_get_price(stock).then(function(price){
        document.getElementById('price_info').innerHTML = `Stock Price ($): ${price}`;
    });
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

let debounce = Date.now();
function update_cost(){
    if (Date.now() - debounce < 500) return; // lil debouncing action
    debounce = Date.now();
    let stock = document.getElementById('stock_buy').value;
    let qty = document.getElementById('buy_qty').value;
    api_get_price(stock, true).then(
        function(x){
            let nominal = Number(x) * qty;
            document.getElementById('tcost_buy').innerText='$' + nominal;
        }
    )
}

function set_team_name(){
    // this is an api call, but its so simple i'm gonna do bad practices and just put it here
    return     fetch(`api/name?password=${pass}`)
        .then(response => response.text()).then(
            function(n){
                document.getElementById('team_name').innerText = n;
            }
        );
}

let global_date;
function date_update(){
    global_date = new Date(global_date.getTime() + 1000 * SERVER_RESOLUTION); // magic numbers to track server date speed
    document.getElementById('date').innerText = global_date.toUTCString();
}

function ui_date(){
    // handle internal date pulling/updating
    api_datetime().then(function(str){
        let spl = str.split(','); // speed, date
        let date = spl[1];
        SERVER_RESOLUTION = spl[0];
        global_date = new Date(date);
        setInterval(date_update, 1000);
    })
}