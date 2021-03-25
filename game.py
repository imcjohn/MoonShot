"""
Bigger game class
"""
import time
import uuid
from player import ConcurrentPlayer


class Game:
    def __init__(self, player_count, game_start=1609459200, game_duration=3600, speed=744):
        self.player_count = player_count
        self.players = []
        self.players_by_username = {}
        self.players_by_password = {}
        self.start_time = None
        self.end_time = None
        self.duration = game_duration
        self.speed = speed
        self.game_start = game_start

    def get_game_time(self):


    def start(self):
        self.start_time = time.time()
        self.end_time = self.start_time + self.duration/self.speed
        for i in range(0,self.player_count)
            team_name = 'MoonShot'+str(i)
            team_pass = uuid.uuid4()[0:9]
            player = ConcurrentPlayer()
