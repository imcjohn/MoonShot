"""
Bigger game class

Config params:
player_count - int
game_start - int
game_duration - int
speed - int
player_file - string
link_header - string
"""
import os
import time
import uuid
import datetime
from player import ConcurrentPlayer
from market_data import MarketDataAggregator


class Game:
    def __init__(self, config_dict=None):
        if config_dict is None:
            config_dict = {}
        self.player_count = config_dict.get('player_count', 100)
        self.players = []
        self.players_by_username = {}
        self.players_by_password = {}
        self.player_end_balances = {} # calculated by liquidate
        self.players_ranking     = [] # calculated by liquidate [0] is winner
        self.start_time = None
        self.end_time = None
        self.duration = config_dict.get('game_duration', 3600)
        self.speed = config_dict.get('speed', 1)
        self.game_start = config_dict.get('game_start', 1609477200)
        self.game_started = False
        self.mkt = MarketDataAggregator(config_dict)
        self.player_file = config_dict.get('player_file', 'players.csv')
        self.link_header = config_dict.get('link_header', 'http://nolink?pass=')

    def dump_player_file(self):
        f = open(self.player_file, 'w')
        f.write('Player Name,Player Password,Account Link\n')
        for player in self.players:
            f.write('%s,%s,%s\n' % (player.name, player.password, self.link_header+player.password))
        f.close()

    def get_game_time(self):
        delta = time.time() - self.start_time
        return self.game_start + delta * self.speed

    def api_start(self):  # used for /api/start
        if self.game_started: return  # don't overwrite running game
        # init time/vars
        self.game_started = True
        self.start_time = time.time()
        self.end_time = self.start_time + self.duration
        time_func = lambda: self.get_game_time()

        players = []
        if os.path.exists(self.player_file):
            op = open(self.player_file)
            for line in op:
                line = line.strip('\n')
                nm, pw, *rest = line.split(',')
                players.append((nm, pw))

        # gen players
        for i in range(0,self.player_count):
            if len(players) == 0:
                team_name = 'Stocks'+str(i)
                team_pass = str(uuid.uuid4())[0:9]
            else:  # use existing accounts if possible (to not burn old links)
                team_name, team_pass = players[-1]
                del players[-1]
            player = ConcurrentPlayer(password=team_pass, name=team_name, current_time=time_func, mkt=self.mkt)
            self.players_by_password[team_pass] = player
            self.players_by_username[team_name] = player
            self.players.append(player)
        self.dump_player_file()

    def api_name(self, passwd): # used for /api/name
        return self.players_by_password[passwd].name

    def api_time(self): # used for /api/time
        unix = self.get_game_time()
        dt_object = datetime.datetime.fromtimestamp(unix)
        return dt_object.isoformat()

    def api_freeze(self): # used for /api/freeze
        self.game_started = False # only threadsafe because below liquidate calls are all protected by locks
        for player in self.players:
            player.liquidate(self.game_start + self.duration * self.speed)
            self.player_end_balances[player.name] = player.balance
        print('End balances', self.player_end_balances)
        self.players_ranking = sorted(self.players, key=lambda x: self.player_end_balances[x.name])

    def api_winner(self):
        if self.game_started: return 'Please freeze game first! (/api/freeze)'
        return self.players_ranking[-1].name

    def api_ticker(self, symbol):
        return self.mkt.price_for_date(self.get_game_time(), symbol)

    def api_buy(self, password, symbol, qty):
        if not self.game_started or time.time() > self.end_time: return False
        return self.players_by_password[password].buy_shares(symbol, qty)

    def api_sell(self, password, symbol, qty):
        if not self.game_started or time.time() > self.end_time: return False
        return self.players_by_password[password].sell_shares(symbol, qty)

    def api_info(self, password):
        return self.players_by_password[password].json_holdings()

    def current_ranking(self):
        # return a rough ranking by net worth
        players = [(p.name, p.net_worth()) for p in self.players]
        ranked_p = sorted(players, reverse=True, key=lambda x: x[1])
        out = '<h1>Player Ranking</h1><br>'
        for i, p in enumerate(ranked_p):
            out += '%d. %s (Net Worth: %s)<br>' % (i+1, p[0], str(p[1]))
        return out
