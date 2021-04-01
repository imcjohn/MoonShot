import falcon
from game import Game
import os
import logging
logging.basicConfig(level=logging.INFO)

class GameResource(object):
    def __init__(self):
        self.game = Game()
        self.lookup_table = {
            'name': self.name,
            'time': self.time,
            'start': self.start,
            'freeze': self.freeze,
            'winner': self.winner,
            'ticker': self.ticker,
            'buy': self.buy,
            'sell': self.sell,
            'info': self.info
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

    def on_get(self, req, resp, api_call):
        """Handles GET requests"""
        resp.status = falcon.HTTP_200  # This is the default status
        logging.debug('Got Request: ', api_call, ' with params ', req.params)
        if api_call in self.lookup_table:
            result = self.lookup_table[api_call](req.params)
            resp.body = str(result)
        else:
            resp.status = falcon.HTTP_404
            resp.body = "not found"


class RedirectorComponent(object):
    def on_get(self, req, resp):
        raise falcon.HTTPMovedPermanently('/index.html')


app = falcon.API()
things = GameResource()
dir = os.path.dirname(os.path.abspath(__file__))
app.add_static_route('/', dir+'/material-dashboard')
app.add_route('/api/{api_call}', things)
app.add_route('/', RedirectorComponent())
