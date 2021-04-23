"""
More complicated stock motion plotting, courtesy of @skmendez
"""
import numpy as np
from typing import *
from collections import namedtuple

StockDay = namedtuple('StockDay', ['open', 'close', 'name', 'day'])


def brownian_bridge_batch(M, N, state=None):
    if state is None:
        state = np.random.RandomState()
    dt = 1.0 / N
    dt_sqrt = np.sqrt(dt)
    B = np.empty((M, N))
    B[:, 0] = 0
    for n in range(N - 1):
        t = n * dt
        xi = state.randn(M) * dt_sqrt
        B[:, n + 1] = B[:, n] * (1 - dt / (1 - t)) + xi
    return B


def create_intraday_batch(stocks: Sequence[Tuple[float, float]], intraday_points=200, state=None):
    out = np.zeros((len(stocks), intraday_points))
    noise = brownian_bridge_batch(len(stocks), intraday_points, state=state).T
    log_stocks = np.log(stocks)
    log_delta = log_stocks[:,1] - log_stocks[:,0]
    log_noise = log_delta * noise
    interp_log_stocks = np.linspace(log_stocks[:,0], log_stocks[:,1], intraday_points) + log_noise
    regular_stocks = np.exp(interp_log_stocks)
    return regular_stocks


def create_intraday(stock: StockDay):
    seed = (stock.name.__hash__() + stock.day.__hash__()) % 2**32
    state = np.random.RandomState(seed=seed)
    return create_intraday_batch([(stock.open, stock.close)], 100, state)[:, 0]


def wiggly_line(ticker, date, open, close, pct):
    stock = StockDay(open, close, ticker, date)
    arr = create_intraday(stock)
    return arr[int(pct*100)]
