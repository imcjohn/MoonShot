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
            return data['open'], data['close']
        return 9999, 9999  # (open, close)

    def gp_memo(self, day, ticker):
        """
        Memoized get_price function to save on api calls
        """
        date = '%s-%s-%s' % (day.year, two_dig(day.month), two_dig(day.day))
        key = ticker + date
        if key in self.memo:
            return self.memo[key]
        else:
            v = self.get_price(date, ticker)
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
        date = self.holiday.make_trading_day(dt_object) # make sure to skip holidays etc
        open, close = self.gp_memo(date, ticker)
        pct = percent_thru_day(date)
        return round(wiggly_line(ticker, date, open, close, pct), 2)
