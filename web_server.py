import falcon
from game import Game
import os
import yaml
import logging
from time import time


class GameResource(object):
    def __init__(self, config_dict):
        self.game = Game(config_dict)
        self.conf = config_dict
        self.lookup_table = {
            'name': self.name,
            'time': self.time,
            'start': self.start,
            'freeze': self.freeze,
            'winner': self.winner,
            'ticker': self.ticker,
            'buy': self.buy,
            'sell': self.sell,
            'info': self.info,
            'ranking': self.ranking
        }

    def name(self, params):
        return self.game.api_name(params['password'])

    def time(self, params):
        return self.game.api_time()

    def start(self, params):
        self.game.api_start()
        return 'Starting...'

    def freeze(self, params):
        self.game.api_freeze()
        return 'Freezing...'

    def winner(self, params):
        return self.game.api_winner()

    def ticker(self, params):
        return self.game.api_ticker(params['symbol'])

    def buy(self, params):
        res = self.game.api_buy(params['password'], params['symbol'], params['qty'])
        return 'OK' if res else 'FAIL'

    def sell(self, params):
        res = self.game.api_sell(params['password'], params['symbol'], params['qty'])
        return 'OK' if res else 'FAIL'

    def info(self, params):
        return self.game.api_info(params['password'])

    def ranking(self, params):
        return self.game.current_ranking()

    def on_get(self, req, resp, api_call):
        """Handles GET requests"""
        resp.status = falcon.HTTP_200  # This is the default status
        logging.debug('Got Request: ', api_call, ' with params ', req.params)
        if api_call in self.lookup_table:
            result = self.lookup_table[api_call](req.params)
            resp.body = str(result)
            resp.content_type='text/html'
        else:
            resp.status = falcon.HTTP_404
            resp.body = "not found"


class RedirectorComponent(object):
    def __init__(self, url):
        self.u = url

    def on_get(self, req, resp):
        raise falcon.HTTPMovedPermanently(self.u)


# first load config
with open('moonshot.yaml') as cf:
    conf = yaml.safe_load(cf)
logging.basicConfig(level=logging.INFO, handlers=[logging.FileHandler('moonshot-%s.log' % str(int(time())))])
# then start server
app = falcon.API()
things = GameResource(conf)
dp = os.path.dirname(os.path.abspath(__file__))
app.add_static_route('/', dp+'/material-dashboard')
app.add_route('/api/{api_call}', things)
app.add_route('/', RedirectorComponent('/index.html'))
