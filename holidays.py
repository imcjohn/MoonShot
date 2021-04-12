import requests
import datetime
import os

def to_format(date):
    """
    Turns a date object into the format used by http://www.market-holidays.com/
    :param date: date object
    :return: string in the format of "January 17, 2022"
    """
    month = date.strftime("%B")
    day = str(date.day)
    year = str(date.year)
    return "%s %s, %s" % (month, day, year)


def is_weekday(date):
    n = date.weekday()
    return n < 5


class HolidayChecker:
    def __init__(self):
        # load holidays data, with caching (so as not to overload their server/make them hate us)
        cached_name = 'holidays_cache_'+datetime.datetime.now().strftime("%Y%m%d")+'.html'
        if os.path.exists(cached_name):
            with open(cached_name) as c:
                self.holidays_data = c.read()
        else:
            self.holidays_data = requests.get('http://www.market-holidays.com/').text
            with open(cached_name, 'w') as fh:
                fh.write(self.holidays_data)

    def is_holiday(self, date):
        return to_format(date) in self.holidays_data

    def is_trading_day(self, date):
        return (not self.is_holiday(date)) and is_weekday(date)

    def make_trading_day(self, date):
        while not self.is_trading_day(date):
            date += datetime.timedelta(days=1)
        return date
