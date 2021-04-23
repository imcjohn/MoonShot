import datetime
import json
import requests
from holidays import HolidayChecker
from market_math import wiggly_line

two_dig = lambda x: '0' + str(x) if len(str(x)) == 1 else str(x)


def percent_thru_day(date):
    second = date.hour * 3600
    second += date.minute * 60
    second += date.second
    return second / 86400.0


class MarketDataAggregator:
    def __init__(self, config_dict):
        self.memo = {}
        self.prev_data = {}
        self.conf = config_dict
        self.holiday = HolidayChecker()
        self.params = {
          'access_key': config_dict.get('marketstack_api', 'X')
        }

    def get_price(self, date, ticker):
        url = 'http://api.marketstack.com/v1/tickers/%s/eod/%s' % (ticker, date)
        api_result = requests.get(url, self.params)
        data = api_result.json()
        if 'open' in data and 'close' in data:
            self.prev_data[ticker] = data
            return data['open'], data['close']
        elif ticker in self.prev_data: # better to return something inaccurate than nothing (keeps the game going)
            return self.prev_data[ticker]['open'], self.prev_data[ticker]['close']
        return None  # (open, close)

    def gp_memo(self, day, ticker):
        """
        Memoized get_price function to save on api calls
        returns open, close price OR None
        """
        date = '%s-%s-%s' % (day.year, two_dig(day.month), two_dig(day.day))
        key = ticker + date
        if key in self.memo:
            return self.memo[key]
        else:
            v = self.get_price(date, ticker)
            self.memo[key] = v
            return v

    def price_for_date(self, unix, ticker, pretty=False):
        """
        Return price for unix timestamp'ed date (in seconds)
        :param unix: unix timestamp
        :param stock: ticker to get info for
        :param pretty: return 0 rather than None on failure (only use for DISPLAY prices not listed ones)
        :return: price of stock at this time OR None on failure
        """
        dt_object = datetime.datetime.fromtimestamp(unix)
        date = self.holiday.make_trading_day(dt_object) # make sure to skip holidays etc
        res = self.gp_memo(date, ticker)
        if res is None: return 0 if pretty else None
        open, close = res
        pct = percent_thru_day(date)
        return round(wiggly_line(ticker, date, open, close, pct), 2)
