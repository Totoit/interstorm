from django.conf import settings
import random
# from wheel.models import WheelAccess, WheelAccessLog, WheelGames, WheelPercentage, WheelBonusCode
from django.utils import timezone
from django.utils.timezone import localtime, now
from treasure_chest.models import Treasure_Game,Treasure_Game_Log,Treasure_Game_Access,Treasure_Roll_Bonus_Setting,Treasure_Every_Deposit_Setting,TreasureChestReward
from datetime import datetime
import pprint
from django.core import serializers
# class controls game mechanics
class Game:

	def __init__(self, user_id, ip):
		self.ip = ip
		self.winning = ''
		self.has_access = False
		self.user_id = user_id
		self.win_result = ''
		self.win_bonuscode = ''
		self.win_bonus = ''
		self.win_type = ''
		self.error = ''
		self.point = self.spin =0
		self.position = 1
		self.reward = {}
		self.reward_back = {}
		self.user_access_record = GameAccess(user_id, ip)
		
	def play(self):
		if self.user_access_record.can_spin():	
			# wheel = None;
			# if self.game_type == 'blue':
			# wheel = GameBlueWheel(self.user_id);
			# elif self.game_type == 'gold':
			# 	wheel = GameGoldWheel(self.user_id);
			random_number = random.randint(1,6)
			self.spin = random_number
			# self.spin = 2
			# print('user access')
			# pp = pprint.PrettyPrinter(4)
			# pp.pprint(self.user_access_record)
			# print('self.user_access_record.position',self.user_access_record.access_record.position)
			self.position = self.user_access_record.access_record.position + self.spin
			if self.position >= 24:
				self.position -= 23
			reward_data = TreasureChestReward.objects.filter(reward_no = self.position)
			
			self.reward['reward_no'] = reward_data[0].reward_no
			self.reward['name'] = reward_data[0].name
			if reward_data[0].icon != '':

				self.reward['icon'] = reward_data[0].icon.url
			else:
				self.reward['icon'] = ''
			self.reward['description'] = reward_data[0].description
			self.reward['level'] = reward_data[0].level
			self.reward['rule_type'] = reward_data[0].rule_type

			if reward_data[0].rule_type == '2':
				print('play again')
				self.user_access_record.add_spins(1,'play again',4,0)
			elif reward_data[0].rule_type == '3':
				print('go back')
				reward_back = TreasureChestReward.objects.filter(reward_no = self.position-1)
				self.reward_back['reward_no'] = reward_back[0].reward_no
				self.reward_back['name'] = reward_back[0].name
				if reward_back[0].icon != '':

					self.reward_back['icon'] = reward_back[0].icon.url
				else:
					self.reward_back['icon'] = ''
				self.reward_back['description'] = reward_back[0].description
				self.reward_back['level'] = reward_back[0].level
				self.reward_back['rule_type'] = reward_back[0].rule_type
				self.position -= 1
				print('position',self.position)
			elif reward_data[0].rule_type == '6':
				print('lucky card')
				self.win_bonus = random.randint(2,5)
				self.user_access_record.add_spins(self.win_bonus,'lucky card',5,0)
			elif reward_data[0].rule_type == '7':
				print('go to start')
				self.position = 0

			else:
				pass

			# pp = pprint.PrettyPrinter(4)
			# pp.pprint(reward_data["fields"])
			# if wheel != None:
			# 	wheel.play()

			# 	# save the position and bonus we stopped at
			self.win_type = reward_data[0].rule_type
			self.win_result = reward_data[0].name
			# 	self.win_bonus = wheel.get_bonus()
			self.win_bonuscode = ''
			if reward_data[0].bonus_code != '':
				# self.win_bonuscode = self.bonus_code(reward_data[0].bonus_code)
				self.win_bonuscode = reward_data[0].bonus_code

			# 	# update the spin count
			self.user_access_record.use_spin()
			self.update()
			# 	# log the play result
			self.log()

		else:
			self.error = 'no_access'

	def update(self):
		# log the results
		update_data = Treasure_Game_Access.objects.get(user_id=self.user_id)
		# update_data.point = self.point
		update_data.position = self.position
		update_data.save()

	def log(self):
		# log the results
		Treasure_Game.objects.create(user_id=self.user_id, ip=self.ip, point=self.spin, win_result=self.win_result, win_bonus=self.win_bonus, win_bonuscode=self.win_bonuscode,win_type=self.win_type)

	def bonus_code(self,bonuscodes):
		bonus_code  = {}
		bonus_code  = str(bonuscodes).split(',')
		for index, bonuscode in enumerate(bonus_code, start=0):
			real_bonuscode_log = Treasure_Game.objects.filter(user_id=self.user_id, win_bonuscode=bonuscode)
			# print(real_bonuscode_log.exists())
			if real_bonuscode_log.exists() == False:
				return bonuscode
		
		return ''

	def result(self):
		data = {}
		data['winning'] = self.win_result
		data['bonus'] = self.win_bonus
		data['spin'] = self.spin
		data['position'] = self.position
		data['reward'] = self.reward
		data['reward_back'] = self.reward_back
		data['bonuscode'] = self.win_bonuscode
		# data['free_spins_machine'] = self.bonus_machine
		data['error'] = self.error

		return data


# spins can be added here
class GameAccess:
	def __init__(self, user_id, ip):
		self.user_id = user_id
		self.ip = ip
		# self.transactions = transactions
		self.access_record = self.load_record()

	def load_record(self):
		# find the user access model
		# self.user_id = 1
		user_access_records = Treasure_Game_Access.objects.filter(user_id=self.user_id)
		
		if user_access_records.exists() == False:
			# access model for user has not been created yet
			user_access_record = Treasure_Game_Access.objects.create(user_id=self.user_id, point=0, last_topup=timezone.now(), position=0)
		else:
			user_access_record = user_access_records[:1].get()
		
		return user_access_record;

	def add_spins(self, spins, reason,type,value):
		roll = 0;
		roll += spins
		self.access_record.point += spins
		self.access_record.save()

		# log the spins that were added
		# type 1 = first deposit
		# type 2 = deposit bonus
		# type 3 = every deposit
		# type 4 = play again
		# type 5 = lucky card
		Treasure_Game_Log.objects.create(user_id=self.user_id, ip=self.ip, roll=roll, reason=reason,type=type,value=value)

	def have_recieved_daily_free_spins(self):
		today = localtime(now()).replace(hour=0, minute=0, second=0, microsecond=0)

		user_spin_log = WheelAccessLog.objects.filter(user_id=self.user_id, created_date__gte = today, reason='daily_free')
		return user_spin_log.exists()

	def give_daily_free_spins(self):
		self.add_spins('level_1', 1, 'daily_free')

	def can_spin(self):
		return self.access_record.point > 0

	def get_spin_count(self):
		data = {}
		data['point'] = self.access_record.point
		return data

	def use_spin(self):
		self.access_record.point -= 1
		self.access_record.save()
	