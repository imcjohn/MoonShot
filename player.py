"""
Player class that is underlying core DS of game

6.031-style concurrent goodness
"""
import json
from threading import Lock  # yay me go slow now


class ConcurrentPlayer:
    def __init__(self, password, name, current_time, mkt, default_balance=1000000):
        self.name = name
        self.password = password
        self.balance = default_balance
        self.time = current_time
        self.shares = {}
        self.trade_lock = Lock()
        self.market = mkt

    def buy_shares(self, symbol, qty):
        price = self.market.price_for_date(self.time(), symbol)
        with self.trade_lock:
            nominal = price * int(qty)
            if nominal > self.balance:
                return False
            self.balance -= nominal
            self.shares[price] = int(self.shares.get(price, 0) + qty)
        return True

    def sell_shares(self, symbol, qty):
        with self.trade_lock:
            if self.shares[symbol] < qty:
                return False
            self.shares[symbol] = self.shares.get(symbol) - int(qty)
            nominal = self.market.price_for_date(self.time(), symbol) * qty
            self.balance += nominal
        return True

    def liquidate(self):
        for symbol in self.shares:
            if self.shares[symbol] > 0:
                self.sell_shares(symbol, self.shares[symbol])

    def json_holdings(self):
        # returns holdings in the format in api-defs.txt
        holdings = {}
        with self.trade_lock:  # ew slow
            for ticker in self.shares:
                holdings[ticker] = {'price': self.market.price_for_date(self.time(), ticker),
                                    'qty': self.shares[ticker]}
        return json.dumps(holdings)
