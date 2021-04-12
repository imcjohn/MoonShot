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
        qty = int(qty)
        price = self.market.price_for_date(self.time(), symbol)
        with self.trade_lock:
            nominal = price * int(qty)
            if nominal > self.balance:
                return False
            self.balance -= nominal
            self.shares[symbol] = int(self.shares.get(symbol, 0) + qty)
        return True

    def sell_shares(self, symbol, qty, time=None):
        qty = int(qty)
        with self.trade_lock:
            if self.shares[symbol] < qty:
                return False
            self.shares[symbol] = self.shares.get(symbol) - int(qty)
            if time is None: time = self.time()  # you can sell either at a fixed time or current game time
            nominal = self.market.price_for_date(time, symbol) * qty
            self.balance += nominal
        return True

    def liquidate(self, liquidate_time):
        for symbol in self.shares:
            if self.shares[symbol] > 0:
                self.sell_shares(symbol, self.shares[symbol], time=liquidate_time)

    def json_holdings(self):
        # returns holdings in the format in api-defs.txt
        holdings = {'USD': {'qty': self.balance}}
        with self.trade_lock:  # ew slow
            for ticker in self.shares.keys():
                holdings[ticker] = {'price': self.market.price_for_date(self.time(), ticker),
                                    'qty': self.shares[ticker]}
        return json.dumps(holdings)

    def net_worth(self):
        # returns current net worth
        nw = 0
        with self.trade_lock:
            nw += self.balance
            for ticker in self.shares.keys():
                nw += self.market.price_for_date(self.time(), ticker) * self.shares[ticker]
        return nw
