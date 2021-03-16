/**
 Holds information for managing the current_holdings table (lil templating engine)
 Author: @ia.n.stagram
 **/

/**
 * Set attribute for div with id id
 */
function set_cash(id, val){
    val = Number(val).toFixed(2);
    document.getElementById(id).innerHTML = '$' + val;
}

var id_count = 0;
function gen_row(stock, price, qty){
    id_count++;
    let net = '$' +(Number(price) * Number(qty)).toFixed(2);
    return `<tr>
                <td>${id_count}</td>
                <td>${stock}</td>
                <td>${price}</td>
                <td>${qty}</td>
                <td>${net}</td>
            </tr>`;
}

/**
 * Given a row dictionary, clear the stock table and add rows in
 * @param row_dict json dict containing rows of stocks (ex         {
            'TSLA' : {'price' : 306.51,  'qty' : 150 },
            'GOOG' : {'price' : 2061.92, 'qty' : 15  }
        })
 * @returns net value of portfolio (minus cash)
 */
function add_rows(row_dict){
    document.getElementById('stonks').innerHTML = '';
    let net = 0;
    for (var r in row_dict) {
        let p = row_dict[r].price;
        let q = row_dict[r].qty;
        document.getElementById('stonks').innerHTML += gen_row(r, p, q);
        net += p * q;
    }
    return net;
}

/**
 * Populate all holdings-based ui layout info based on holdings row and stock values
 * @param row_dict see above format
 * @param cash total cash in portfolio
 */
function populate_tickers(row_dict, cash){
    let net = add_rows(row_dict);
    let n_c = net + cash;
    set_cash('nominal_val', n_c);
    set_cash('available_cash', cash);
}