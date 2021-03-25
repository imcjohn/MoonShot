"""
Player class that is underlying core DS of game

6.031-style concurrent goodness
"""
from threading import Lock # yay me go slow now
from market_data import MarketDataAggregator

mkt = MarketDataAggregator()


class ConcurrentPlayer:
    def __init__(self, password, name, current_time, default_balance=1000000):
        self.name = name
        self.password = password
        self.balance = default_balance
        self.time = current_time
        self.shares = {}
        self.trade_lock = Lock()

    def buy_shares(self, symbol, qty):
        price = mkt.price_for_date(self.time(), symbol)
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
            nominal = mkt.price_for_date(self.time(), symbol) * qty
            self.balance += nominal
        return True
