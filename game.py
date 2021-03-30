"""
Bigger game class
"""
import time
import uuid
import datetime
from player import ConcurrentPlayer
from market_data import MarketDataAggregator


class Game:
    def __init__(self, player_count=100, game_start=1609477200, game_duration=3600, speed=744):
        self.player_count = player_count
        self.players = []
        self.players_by_username = {}
        self.players_by_password = {}
        self.player_end_balances = {} # calculated by liquidate
        self.players_ranking     = [] # calculated by liquidate [0] is winner
        self.start_time = None
        self.end_time = None
        self.duration = game_duration
        self.speed = speed
        self.game_start = game_start
        self.game_started = False
        self.mkt = MarketDataAggregator()

    def get_game_time(self):
        delta = time.time() - self.start_time
        return self.game_start + delta * self.speed

    def api_start(self):  # used for /api/start
        # init time/vars
        self.game_started = True
        self.start_time = time.time()
        self.end_time = self.start_time + self.duration/self.speed
        time_func = lambda: self.get_game_time()

        # gen players
        for i in range(0,self.player_count):
            team_name = 'MoonShot'+str(i)
            team_pass = str(uuid.uuid4())[0:9]
            player = ConcurrentPlayer(password=team_pass, name=team_name, current_time=time_func, mkt=self.mkt)
            self.players_by_password[team_pass] = player
            self.players_by_username[team_name] = player
            self.players.append(player)

    def api_name(self, passwd): # used for /api/name
        return self.players_by_password[passwd].name

    def api_time(self): # used for /api/time
        unix = self.get_game_time()
        dt_object = datetime.datetime.fromtimestamp(unix)
        return dt_object.isoformat()

    def api_freeze(self): # used for /api/freeze
        self.game_started = False # only threadsafe because below liquidate calls are all protected by locks
        for player in self.players:
            player.liquidate()
            self.player_end_balances[player.name] = player.balance
        self.players_ranking = sorted(self.players, key=lambda x: self.player_end_balances[x.name])

    def api_winner(self):
        return self.players_ranking[0].name

    def api_ticker(self, symbol):
        return self.mkt.price_for_date(self.get_game_time(), symbol)

    def api_buy(self, password, symbol, qty):
        return self.players_by_password[password].buy_shares(symbol, qty)

    def api_sell(self, password, symbol, qty):
        return self.players_by_password[password].sell_shares(symbol, qty)

    def api_info(self, password):
        return self.players_by_password[password].json_holdings()