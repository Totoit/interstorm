from django.conf import settings
import random
from interstorm_wheel.models import WheelAccess, WheelAccessLog, WheelGames, WheelPercentage, WheelBonusCode,WheelTransaction,WheelLevelManage
from django.db.models import Sum
from django.utils import timezone
from django.utils.timezone import localtime, now
from interstorm_vendor.models import InterStormUserVendor

# class controls game mechanics
class Game:

	def __init__(self, user_id, ip,vendor):
		self.ip = ip
		self.winning = ''
		self.has_access = False
		# self.game_type = game_type
		self.user_id = user_id
		self.error = ''
		self.win_result = ''
		self.win_bonuscode = ''
		self.win_bonus = ''
		self.bonus_machine = ''
		self.vendor = vendor
		self.level = 1
		self.user_access_record = GameAccess(user_id, ip, vendor)
		self.game_type = self.user_access_record.get_level()
		
	def play(self,vendor):
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
		print(self.user_access_record.vendor)
		WheelGames.objects.create(user_id=self.user_id, ip=self.ip, wheel_type=self.game_type, win_result=self.win_result, win_bonus=self.win_bonus, win_bonuscode=self.win_bonuscode,vendor_id = self.user_access_record.vendor)


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

			# print('Rolled: ' + str(win_probability) + '. ' + win + ' requires at most: ' + str(current_probability))

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
		# print('self')
		# print(self.win)
		# print(self.winnings)
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
		# self.winnings = suffle_price(self.winnings)
		# print('datasssss')
		# print(game_type)
		get_winning = WheelBonusCode.objects.filter(level=game_type);
		for item in get_winning:
				# data_test = {'item.rewards':item['percent']}
				self.winnings[item.winning_key]  = item.bonus_key
		self.winnings = suffle_price(self.winnings)
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
		self.bonus_probabilities = {
			'dud': 995,
			'60spins': 1,
			'50':1,
			'100':1,
			'200':1,
			'1000':1
		}

		self.probabilities = suffle_price(self.probabilities)

	def play(self):
		self.win = self.calc_win(self.probabilities)
		# print('win',self.win)
		# if self.win == 'bonus':
		# 	self.play_bonus()

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
		# self.bonus_code_machine = settings.WHEEL_FREE_SPINS_MACHINES


	def get_real_bonus_code(self):

		# should return the real bonus code to be used
		# these are set up in everymatrix
		if self.bonus_code == '' or self.bonus_code == None:
			return ''

		# print(self.real_bonus_codes)
		# bonuscodes = self.real_bonus_codes[self.bonus_code]
		bonuscode = self.real_bonus_codes[self.bonus_code]
		# bonuscode = 'xxx'
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
			# print(user_access_records)
			# for item in user_access_record:
			# 	print(item)

		return user_access_record;

	def get_level(self):
		level_1 = 0
		level_2 = 0
		level_3 = 0
		# sumary monney
		totalTransactions = 0
		deposit_euro = 0
		# totalTransactionsQuery = WheelTransaction.objects.filter(user_id=self.user_id,vendor_id=self.vendor).aggregate(Sum('amount'))
		totalTransactionsQuery = WheelTransaction.objects.filter(user_id=self.user_id, vendor_id=self.vendor).order_by('-transaction_date')
		if totalTransactionsQuery.exists():
			totalTransactions = totalTransactionsQuery[0].amount
			currency = totalTransactionsQuery[0].currency
			totalTransactions = self.currencyChange(totalTransactions,currency)
		# totalTransactions = totalTransactionsQuery.get('amount__sum')
		
		# totalTransactionsCount = WheelTransaction.objects.filter(user_id=self.user_id,vendor_id=self.vendor).count()
		
		#---------------- change
		
		# vendor_id = '3'
		level1 = WheelLevelManage.objects.filter(level = 1,vendor_id = self.vendor)
		level2 = WheelLevelManage.objects.filter(level = 2,vendor_id = self.vendor)
		level3 = WheelLevelManage.objects.filter(level = 3,vendor_id = self.vendor)
		
		# print(level1[0].deposit,leve2[0].deposit,leve3[0].deposit)
		
		#test Data
		if totalTransactions != None:
			deposit_euro = totalTransactions
		
		# find level
		deposit_level = 1
		
		print(deposit_euro)
		if deposit_euro < level1[0].deposit:
			deposit_level  = 1
		elif deposit_euro >= level1[0].deposit and deposit_euro < level2[0].deposit:
			deposit_level = 2
		else:
			deposit_level = 2
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

	def can_spin(self, game_type):
		print("can spin : " ,game_type)
		number_of_spins_left = 0;
		if game_type == 1:
			number_of_spins_left = self.access_record.level_1
		elif game_type == 2:
			number_of_spins_left = self.access_record.level_2
		elif game_type == 3:
				number_of_spins_left = self.access_record.level_3

		# print('spin left')
		# print(number_of_spins_left)
		# print('self.access_record')
		# print(self.access_record.level_1)
		# print(self.access_record.level_2)
		# print(self.access_record.level_3)
		return number_of_spins_left > 0

	def get_spin_count(self):
		data = {}
		data['level_1'] = self.access_record.level_1
		data['level_2'] = self.access_record.level_2
		data['level_3'] = self.access_record.level_3
		return data

	def use_spin(self, game_type):
		print('Use Spin')
		if game_type == 1:
			# self.access_record.blue_spins -= 1
			self.access_record.level_1 -= 1
		elif game_type == 2:
			self.access_record.level_2 -= 1
		elif game_type == 3:
				self.access_record.level_3 -= 1
			
		self.access_record.save()
	
	def reset_spin(self):
		print('reset Spin')
		self.access_record.level_1 = 0
		self.access_record.level_2 = 0
		self.access_record.level_3 = 0
			
		self.access_record.save()
	
	def currencyChange(self,amount,currency):
		change = {'AED':4.09731788111637,
				'AMD':531.979222078666,
				'ARS':65.1405096123022,
				'AUD':1.62344935448461,
				'BCH':208.429613079337,
				'BGN':1.95582809570531,
				'BHD':0.420567120972207,
				'BIF':2072.00857384327,
				'BMD':1.11549236941549,
				'BNB':16.5874889499811,
				'BND':1.51842803159091,
				'BOB':7.71139584810717,
				'BRL':4.60441515042597,
				'BSD':1.11549236941549,
				'BTC':7391.53101873889,
				'BTN':78.893204845494,
				'BWP':12.1541601499888,
				'BYR':22731.5367190915,
				'BZD':2.2477496818566,
				'CAD':1.46077558990101,
				'CDF':1852.4571997552,
				'CHF':1.0997513138594,
				'CLP':808.423271582751,
				'CNY':7.8922946153622,
				'COP':3836.10532926628,
				'CRC':648.332508912872,
				'CUC':1.11549236941549,
				'CUP':27.8874432927599,
				'CVE':110.264859482616,
				'CZK':25.5963309079958,
				'DJF':198.234138001379,
				'DKK':7.47100572172409,
				'DOP':58.9924179870023,
				'DZD':133.228429877308,
				'EEK':15.6466247656425,
				'EGP':18.074000641144,
				'ETB':32.9614206195782,
				'ETH':156.838029550908,
				'EUR':1,
				'FJD':2.44751071001836,
				'FKP':0.859705073780126,
				'GBP':0.859705073780126,
				'GEL':3.30744698419483,
				'GHS':6.10235571832409,
				'GIP':0.859705073780126,
				'GMD':56.638030522338,
				'GNF':10316.7997260567,
				'GTQ':8.6591173584869,
				'GYD':232.614586996435,
				'HKD':8.74869876919789,
				'HNL':27.4856170039149,
				'HRK':7.43727086389291,
				'HTG':106.830338737724,
				'HUF':330.030299880514,
				'IDR':15688.2344022304,
				'ILS':3.94773802469376,
				'INR':78.893204845494,
				'IQD':1329.65360546332,
				'IRR':46967.9864339767,
				'ISK':139.2798913941,
				'JMD':151.429237135835,
				'JOD':0.790887012949165,
				'JPY':121.13582440427,
				'KES':115.736879377508,
				'KGS':77.8519307175955,
				'KHR':4531.36567645545,
				'KPW':150.591884671802,
				'KRW':1307.02617907345,
				'KWD':0.338276294187933,
				'KYD':0.929581022138895,
				'KZT':434.842052243518,
				'LAK':9837.94423407583,
				'LBP':1681.61669111433,
				'LKR':202.788852838033,
				'LRD':235.830741881272,
				'LSL':16.4688462323078,
				'LTC':49.3190089468725,
				'LTL':3.45279723336669,
				'LVL':0.702802576232988,
				'LYD':1.57172069437833,
				'MAD':10.7120059062958,
				'MDL':19.3192828901992,
				'MGA':4098.09172535724,
				'MKD':61.5043889218096,
				'MMK':1708.07840024869,
				'MNT':2926.50341749157,
				'MOP':9.01125207643213,
				'MRO':416.252659290273,
				'MUR':40.4552938090751,
				'MVR':17.1799943657046,
				'MWK':816.043692989188,
				'MXN':21.3382996085136,
				'MYR':4.66563468394517,
				'MZN':69.5697078909278,
				'NAD':16.4688462323078,
				'NGN':403.720743921275,
				'NIO':37.4760736732692,
				'NOK':10.1839752868148,
				'NPR':126.782364655482,
				'NZD':1.74036875491787,
				'OMR':0.429452793347646,
				'PAB':1.11549236941549,
				'PEN':3.72663953138205,
				'PGK':3.81671054293236,
				'PHP':57.0029745193849,
				'PKR':174.275888130094,
				'PLN':4.27818264831311,
				'PYG':7181.23333074285,
				'QAR':4.0612962765079,
				'RON':4.75879192935759,
				'RSD':117.641985214832,
				'RUB':71.1106420182435,
				'RWF':1033.33060588104,
				'SAR':4.18426865874627,
				'SBD':9.23253999864,
				'SCR':15.2898475825959,
				'SDG':50.2753557863242,
				'SEK':10.745190934613,
				'SGD':1.51842803159091,
				'SHP':0.859705073780126,
				'SLL':10675.8983602258,
				'SOS':646.726581245568,
				'SRD':8.31934506173439,
				'STD':24573.1100572172,
				'SVC':9.76057061812106,
				'SYP':239.496522279752,
				'SZL':16.4688462323078,
				'THB':33.7662758279014,
				'TJS':10.8085505289438,
				'TMT':3.90568966689657,
				'TND':3.15141974529099,
				'TOP':2.5769819605405,
				'TRX':0.0140274526184902,
				'TRY':6.52018923461012,
				'TTD':7.55444866476914,
				'TWD':34.056598439883,
				'TZS':2562.27234726688,
				'UAH':27.8064590396441,
				'UGX':4115.9907762699,
				'USD':1.11549236941549,
				'UYU':41.6654141692814,
				'UZS':10526.7396022965,
				'VEF':2086013162.86451,
				'VND':25892.2408777844,
				'VUV':126.20722258381,
				'WST':2.9757812727679,
				'XAF':655.955510438018,
				'XCD':3.01183784886488,
				'XPF':119.331304339379,
				'XRP':0.266791657357127,
				'YER':279.245827221418,
				'ZAR':16.4688462323078,
				'ZMK':5859.20530595195,
				'ZMW':14.7293197074052,
				'ZWD':418.088128151077}
		if currency in change:
			return amount / change[currency]
		else:
			return 0


def suffle_price(reward):

	keys =  list(reward.keys()) 
	random.shuffle(keys)
	data = []
	for key in keys:

		data.append({key:reward[key]})

	stringItem = ''
	import json
	for item in data:
		# print(item)
		stringItem = stringItem + str(item)
	stringItem =stringItem.replace('}{',',')
	stringItem =stringItem.replace("'", "\"")
	json_data = json.loads(stringItem)
	python_dict = json_data
	# print(json_data)
	return python_dict
