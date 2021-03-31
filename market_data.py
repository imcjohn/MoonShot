import datetime
import json
import requests

params = {
  'access_key': '7d2735316b4962b1d174f41447fdbc16'
}
# january-specific stuff
WEEKENDS = [2,3,9,10,23,24,30,31]
HOLIDAYS = [1,18]
NON_TRADING_DAYS = WEEKENDS + HOLIDAYS
two_dig = lambda x: '0' + str(x) if len(str(x)) == 1 else str(x)


def make_non_holiday(d):
    """
    Makes day into a non-holiday
    """
    while d in NON_TRADING_DAYS:
        d = (d + 1) % 31
    return d


def percent_thru_day(date):
    second = date.hour * 3600
    second += date.minute * 60
    second += date.second
    return second / 86400.0


def wiggly_line(start, end, pct):
    delta = end - start # just flat line for now
    return start + delta * pct


def get_price(date, ticker):
    url = 'http://api.marketstack.com/v1/tickers/%s/eod/%s' % (ticker, date)
    api_result = requests.get(url, params)
    data = api_result.json()
    if 'open' in data and 'close' in data:
        return data['open'], data['close']
    return 9999, 9999  # (open, close)


class MarketDataAggregator:
    def __init__(self):
        self.memo = {}

    def gp_memo(self, day, ticker):
        """
        Memoized get_price function to save on api calls
        """
        date = '%s-%s-%s' % (day.year, two_dig(day.month), two_dig(day.day))
        key = ticker + date
        if key in self.memo:
            return self.memo[key]
        else:
            v = get_price(date, ticker)
            self.memo[key] = v
            return v

    def price_for_date(self, unix, ticker):
        """
        Return price for unix timestamp'ed date (in seconds)
        :param unix: unix timestamp
        :param stock: ticker to get info for
        :return: price of stock at this time
        """
        dt_object = datetime.datetime.fromtimestamp(unix)
        correct_day = make_non_holiday(dt_object.day)
        date = dt_object.replace(day=correct_day)
        open, close = self.gp_memo(date, ticker)
        pct = percent_thru_day(date)
        return round(wiggly_line(open, close, pct), 2)