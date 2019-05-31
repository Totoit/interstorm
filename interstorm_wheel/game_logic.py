from django.conf import settings
import random
from interstorm_wheel.models import WheelAccess, WheelAccessLog, WheelGames, WheelPercentage, WheelBonusCode,WheelTransaction,WheelLevelManage
from django.db.models import Sum
from django.utils import timezone
from django.utils.timezone import localtime, now
from interstorm_vendor.models import InterStormUserVendor

# class controls game mechanics
class Game:

	def __init__(self, user_id, ip,vendor ,game_type):
		self.ip = ip
		self.winning = ''
		self.has_access = False
		self.game_type = game_type
		self.user_id = user_id
		self.error = ''
		self.win_result = ''
		self.win_bonuscode = ''
		self.win_bonus = ''
		self.bonus_machine = ''
		self.vendor = ''
		self.level = 1
		self.user_access_record = GameAccess(user_id,vendor, ip)
		
	def play(self):
		if self.user_access_record.can_spin(self.game_type):	
			wheel = None;
			# if self.game_type == 'blue':
			wheel = GameBlueWheel(self.user_id,self.game_type);

			if wheel != None:
				wheel.play()

				# save the position and bonus we stopped at
				self.win_result = wheel.get_win()
				# print('win_result');
				self.win_bonus = wheel.get_bonus()
				# print('win_bonus');
				self.win_bonuscode = wheel.get_bonuscode()

				# update the spin count
				self.user_access_record.use_spin(self.game_type)

				# log the play result
				self.log()



		else:
			self.error = 'no_access'

	def log(self):
		# log the results
		WheelGames.objects.create(user_id=self.user_id, ip=self.ip, wheel_type=self.game_type, win_result=self.win_result, win_bonus=self.win_bonus, win_bonuscode=self.win_bonuscode)


	def result(self):
		data = {}
		data['winning'] = self.win_result
		data['bonus'] = self.win_bonus
		data['bonuscode'] = self.win_bonuscode
		data['free_spins_machine'] = self.bonus_machine
		data['error'] = self.error

		return data



# Game wheel super class
class GameWheel:

	def __init__(self, user_id,level_id):
		self.win = None
		self.bonus = None
		self.user_id = user_id
		self.level_id = level_id

	# calculates what has been won, based on given probabilities
	def calc_win(self, probabilities):
		winning = 'giftbox' # fallback if something fails (or percentages don't amount to 100)

		# roll a number between 0 and 100
		win_probability = random.randint(0, 100);

		current_probability = 0
		for win in probabilities:
			current_probability += probabilities[win]

			print('Rolled: ' + str(win_probability) + '. ' + win + ' requires at most: ' + str(current_probability))

			# check if rolled number is within the limits of the current winnings
			if win_probability <= current_probability:
				winning = win
				break;

		return winning

	# calculates what has been won, based on given probabilities
	def calc_win_icecube(self, probabilities):
		winning = 'giftbox'  # fallback if something fails (or percentages don't amount to 100)

		# roll a number between 0 and 100
		win_probability = random.randint(0, 1000);

		current_probability = 0
		for win in probabilities:
			current_probability += probabilities[win]

			# print('Rolled: ' + str(win_probability) + '. ' + win + ' requires at most: ' + str(current_probability))

			# check if rolled number is within the limits of the current winnings
			if win_probability <= current_probability:
				winning = win
				break;

		return winning

	# returns the number of spins used across all users on a wheel
	def get_total_wheel_spins(self, wheel_type):
		number_of_spins = WheelGames.objects.filter(wheel_type=wheel_type).count()
		# print('Number of ' + wheel_type + ' spins: ' + str(number_of_spins))

		return number_of_spins

	def get_win(self):
		return self.win

	def get_bonus(self):
		if self.bonus != None:
			return self.bonus
		else:
			return ''

	def get_bonuscode(self):
		internal_bonuscode = ''
		real_bonuscode = ''

		if self.bonus != None:
			internal_bonuscode = self.bonus_winnings[self.bonus]
		else:
			internal_bonuscode = self.winnings[self.win]


		# convert internal bonuscode to a real one
		if internal_bonuscode != '':
			bonus_code_handler = GameBonusCode(self.user_id, internal_bonuscode,self.level_id)
			real_bonuscode = bonus_code_handler.get_real_bonus_code()

		return real_bonuscode

# Blue game wheel
class GameBlueWheel(GameWheel):
	def __init__(self, user_id, game_type):
		GameWheel.__init__(self, user_id,game_type)

		# possible winning. The value is the type of bonus code given when winning
		self.winnings = {
			# 'giftbox': 'gifbox_bonus_code',
			# 'money': 'money_bonus_code',
			# 'shift': 'shift_bonus_code',
			# 'jackpot':  'jackpot_bonus_code'
		}
		# print('datasssss')
		# print(game_type)
		get_winning = WheelBonusCode.objects.filter(level=game_type);
		for item in get_winning:
				# data_test = {'item.rewards':item['percent']}
				self.winnings[item.winning_key]  = item.bonus_key
		# print("get_winning = "+str(self.winnings))
		# the probabilities of winning. Must amount to 100
		self.probabilities = {
			# 'jackpot':5,
			# 'giftbox': 25,
			# 'money': 35,
			# 'shift': 35
		}

		get_percent = WheelPercentage.objects.filter(level=game_type);
		for item in get_percent:
				# data_test = {'item.rewards':item['percent']}
				self.probabilities[item.rewards]  = item.percentage
			# print("percent = "+str(item.rewards));
		# print("percent = "+str(self.probabilities))
		# # bonus prize winnings
		# self.bonus_winnings = {
		# 	'dud': '',
		# 	'60spins': '60_spins_bonus_code',
		# 	'50': '50_bonus_code',
		# 	'100': '100_bonus_code',
		# 	'200': '200_bonus_code',
		# 	'1000': '1000_bonus_code',
		# }
		#
		# # the probabilities of winning a bonus. Must amount to 100. Most of these are calcuated based on number of spins
		# self.bonus_probabilities = {
		# 	'dud': 995,
		# 	'60spins': 1,
		# 	'50':1,
		# 	'100':1,
		# 	'200':1,
		# 	'1000':1
		# }

	def play(self):
		self.win = self.calc_win(self.probabilities)
		# print('win',self.win)
		if self.win == 'bonus':
			self.play_bonus()

		# check if there is still a valid bonuscode for this user
		# otherwise they can't win...
		# to fix, add more bonus codes for each winnings, each one can only be used 1 time per user
		# if self.win != 'dud':
		# 	try:
		# 		bonus = self.get_bonuscode()
		# 	except:
		# 		self.win = 'dud'


	def play_bonus(self):
		number_of_spins = self.get_total_wheel_spins('level_1')

		# the amount of spins required for a 'full round'. Meaning all wins have been triggered
		full_round_spins = 100000

		# calc the number of times we have completed a full round
		reached_max_times = number_of_spins // full_round_spins

		# remove the number of times we completed the round from the number of spins
		# that way we only use spins from the current round to determine the next win
		spin_calc = number_of_spins - (full_round_spins * reached_max_times);

		# calc the winning based on calc. The number will be zero when a round is completed
		# make sure the first spin doesn't trigger a 1000 win
		if number_of_spins > 0 and spin_calc == 0:
			win = '1000'
		elif spin_calc == 50000:
			win = '500'
		elif spin_calc == 20000:
			win = '200'
		elif spin_calc == 10000:
			win = '100'
		else:
			win = self.calc_win_icecube(self.bonus_probabilities)

		self.bonus = win

# handle bonus codes
class GameBonusCode:
	def __init__(self, user_id, bonus_code, level_id):
		self.user_id = user_id
		self.bonus_code = bonus_code

		# the bonus codes
		# self.real_bonus_codes = settings.WHEEL_BONUS_CODES
		# print('lv')
		# print(level_id)
		self.real_bonus_codes = {}
		get_bonus_codes = WheelBonusCode.objects.filter(level=level_id);
		print('---- - ---- query  - - - -')
		print(get_bonus_codes.query)
		for item in get_bonus_codes:
				# data_test = {'item.rewards':item['percent']}
			self.real_bonus_codes[item.bonus_key]  = {}
			# self.real_bonus_codes[item.bonus_key]  = str(item.bonus_code).split(',')
			self.real_bonus_codes[item.bonus_key]  = str(item.bonus_code)
		# print("get_bonus_codes = "+str(self.real_bonus_codes))
		# used to determine which machine the bonus code is valid for
		self.bonus_code_machine = settings.WHEEL_FREE_SPINS_MACHINES


	def get_real_bonus_code(self):

		# should return the real bonus code to be used
		# these are set up in everymatrix
		if self.bonus_code == '' or self.bonus_code == None:
			return ''

		# print(self.real_bonus_codes)
		# bonuscodes = self.real_bonus_codes[self.bonus_code]
		bonuscode = self.real_bonus_codes[self.bonus_code]
		return bonuscode

		# print('bonus code'+str(bonuscodes))
		# return '' # return empty bonus code because winnings is sent to site support instead

		# this code below is used to ensure that each bonus code is only used once per user
		# this is required by everymatrix because each code is only valid one time per user.
		# it's commented out because bonus codes are now handled by sending an email to site support who handle bonus codes manually
		# but it is saved here if it is needed in the future

		for index, bonuscode in enumerate(bonuscodes, start=0):
			real_bonuscode_log = WheelGames.objects.filter(user_id=self.user_id, win_bonuscode=bonuscode)
			# print(real_bonuscode_log.exists())
			if real_bonuscode_log.exists() == False:
				return bonuscode

		# if we haven't found a bonus code as this point. Raise an exeption to stop the game. 
		# the user will not get the winning if no new bonuscode is found
		# raise Exception('No available bonus code for winnings')
		return  ''

	def get_bonus_machine(self, real_bonus_code):
		if real_bonus_code in self.bonus_code_machine:
			return self.bonus_code_machine[real_bonus_code]
		else:
			return ''


# class controls access for the game and how many spins are left
# spins can be added here
class GameAccess:
	def __init__(self, user_id, ip,vendor):
		self.user_id = user_id
		self.ip = ip
		# self.vendor = vendor
		self.vendor = InterStormUserVendor.objects.get(usercode = vendor).user_id
		self.access_record = self.load_record()

	def load_record(self):
		# find the user access model
		user_access_records = WheelAccess.objects.filter(user_id=self.user_id,vendor_id=self.vendor)
		# print('user_access_records')
		# print(user_access_records)
		if user_access_records.exists() == False:
			# access model for user has not been created yet
			user_access_record = WheelAccess.objects.create(user_id=self.user_id, level_1=0, level_2=0, level_3=0,vendor_id=self.vendor)
			# print('user_access_records 1')
			# print(user_access_record)
		else:
			user_access_record = user_access_records[:1].get()
			# print('user_access_records 2')
			# print(user_access_records.values)

		return user_access_record;

	def get_level(self):
		level_1 = 0
		level_2 = 0
		level_3 = 0
		# sumary monney
		totalTransactions = 0
		deposit_euro = 0
		totalTransactionsQuery = WheelTransaction.objects.filter(user_id=self.user_id,vendor_id=self.vendor).aggregate(Sum('amount'))
		totalTransactions = totalTransactionsQuery.get('amount__sum')
		
		totalTransactionsCount = WheelTransaction.objects.filter(user_id=self.user_id,vendor_id=self.vendor).count()
		
		#---------------- change
		
		# vendor_id = '3'
		level1 = WheelLevelManage.objects.filter(level = 1,vendor_id = self.vendor)
		level2 = WheelLevelManage.objects.filter(level = 2,vendor_id = self.vendor)
		level3 = WheelLevelManage.objects.filter(level = 3,vendor_id = self.vendor)
		
		# print(level1[0].deposit,leve2[0].deposit,leve3[0].deposit)
		
		#test Data
		
		deposit_euro = totalTransactions
		# find level
		deposit_level = 1
		
	
		if deposit_euro < level1[0].deposit:
			deposit_level  = 1
		elif deposit_euro >= level1[0].deposit and deposit_euro < level2[0].deposit:
			deposit_level = 2
		else:
			deposit_level = 3
		return deposit_level

	def add_spins(self, game_type, spins, reason):
		level_1 = 0;
		level_2 = 0;
		level_3 = 0;
		
		if game_type == '1':
			level_1 += spins;
		elif game_type == '2':
			level_2 += spins;
		elif game_type == '3':
			level_3 += spins;
		self.access_record.level_1 += level_1
		self.access_record.level_2 += level_2
		self.access_record.level_3 += level_3
		self.access_record.save()

		# log the spins that were added
		WheelAccessLog.objects.create(user_id=self.user_id, ip=self.ip, level_1=level_1, level_2=level_2, level_3=level_3, reason=reason,vendor_id=self.vendor)

	# def have_recieved_daily_free_spins(self):
	# 	today = localtime(now()).replace(hour=0, minute=0, second=0, microsecond=0)

	# 	user_spin_log = WheelAccessLog.objects.filter(user_id=self.user_id, created_date__gte = today, reason='daily_free')
	# 	return user_spin_log.exists()

	# def give_daily_free_spins(self):
	# 	self.add_spins('level_1', 1, 'daily_free')
	# 	#self.add_spins('gold', 1, 'daily_free')

	# def can_spin(self, game_type):
	# 	number_of_spins_left = 0;
	# 	if game_type == '1':
	# 		number_of_spins_left = self.access_record.level_1
	# 	elif game_type == '2':
	# 		number_of_spins_left = self.access_record.level_2
	# 	elif game_type == '3':
	# 			number_of_spins_left = self.access_record.level_3

	# 	# print('spin left')
	# 	# print(number_of_spins_left)
	# 	# print('self.access_record')
	# 	# print(self.access_record.level_1)
	# 	# print(self.access_record.level_2)
	# 	# print(self.access_record.level_3)
	# 	return number_of_spins_left > 0

	def get_spin_count(self):
		data = {}
		data['level_1'] = self.access_record.level_1
		data['level_2'] = self.access_record.level_2
		data['level_3'] = self.access_record.level_3
		return data

	def use_spin(self, game_type):
		if game_type == '1':
			# self.access_record.blue_spins -= 1
			self.access_record.level_1 -= 1
		elif game_type == '2':
			self.access_record.level_2 -= 1
		elif game_type == '3':
				self.access_record.level_3 -= 1
			
		self.access_record.save()