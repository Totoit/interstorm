from django.shortcuts import render
from django.http import HttpResponse,JsonResponse 
from django.db.models import Sum,Count,Max
from django.forms.models import model_to_dict
import random
# from treasure_chest.views import Treasure_Game_Log, Treasure_Game
from django.utils import timezone
from treasure_chest.game_logic import Game, GameAccess
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware
from treasure_chest.models import Treasure_Game,Treasure_Game_Access,Treasure_Transaction,Treasure_Roll_Bonus_Setting,Treasure_Every_Deposit_Setting,Treasure_Game_Log
from django.db.models.functions import Lower
from django.core import serializers
import json
import dateutil.parser
import pprint
import math
# def save_game_data(request):
#     if(request.method == 'POST'):
#         user_id = request.user
#         point = request.POST.get('point')
#         last_topup = request.POST.get('last_topup')
#         position =  request.POST.get('position')
		
#         treasure_game_log = Treasure_Game(user_id = user_id, point = point, last_topup = last_topup, position=position)
#         treasure_game_log.save()
#         return HttpResponse("Save Game Data Done")
#     else:
#         return HttpResponse("Error for save game data.")

# def save_log(request):
#     if(request.method == 'POST'):
#         user_id = request.user
#         item = request.POST.get('item')
#         number = request.POST.get('number')
		
#         treasure_game_log = Treasure_Game_Log(user_id = user_id,item = item, number = number)
#         treasure_game_log.save()
#         return HttpResponse("Save Log Done")
#     else:
#         return HttpResponse("Error for save log")


# default function
# def function_name(request):
#     if(request.method == 'POST'):
#         userid = request.user
#     else:
#         return HttpResponse("Only POST method.")

#check user's game data profile.
def check_user(request):
	if(request.method == 'POST'):
		userid = request.user
		if(Treasure_Game.objects.filter(userid = userid).exists()):
			print ("have user")
		else:
			# get last top_up from matrix
			last_topup = timezone.now()
			Treasure_Game_Temp = Treasure_Game(userid = userid, last_topup = last_topup)
			Treasure_Game_Temp.save()
			print ("save done")
	else:
		return HttpResponse("Only POST method.")

#for get treasure game data by user id.
def user_status(request):
	if(request.method == 'POST'):
		check_user(request)
		userid = request.user
		Treasure_Game_list = Treasure_Game.objects.filter(userid = userid)
		position = Treasure_Game_list[0].position
		point = Treasure_Game_list[0].point
		json = {
			'position'  : position,
			'point'     : point,
		}
		return JsonResponse(json)
	else:
		return HttpResponse("Only POST method.")

#for random number and step 
def randomNumber(request):
	if(request.method == 'POST'):
		random_number = random.randint(1,6)
		save_game(request, random_number)
		# save_log(request)
		return HttpResponse(random_number)
	else:
		return HttpResponse("Only POST method.")

#for save game data
# def save_game(request, random_number):
#     if(request.method == 'POST'):
#         userid = request.user
#         if(Treasure_Game.objects.filter(userid = userid).exists()):
#             Treasure_Game_list = Treasure_Game.objects.filter(userid = userid)
#             point = int(Treasure_Game_list[0].point) - 1
#             position = int(Treasure_Game_list[0].position) + random_number
#             if(position > 24):
#                 position = position - 24
			
#             #update Treasure_Game data
#             Treasure_Game.objects.filter(userid = userid).update(point = point,position = position)

#             #save Trasure Game log
#             log = Treasure_Game_Log(userid = userid,timestampe = timezone.now(),reward = position,number = random_number)
#             log.save()

#             #call reward
#             TreasureChestReward_list = TreasureChestReward.objects.filter(reward_no = position)
#             reward_name = str(TreasureChestReward_list[0].name)
			
#             json = {
#                 'point'     : point
#                 'position'  : position
#                 'reward'    : reward_name
#             }
#             return JsonResponse
#         else:
#             return HttpResponse("Can't Save No user data")
#     else:
#         return HttpResponse("Only POST method.")

# def save_log(request):
#     if(request.method == 'POST'):
#         userid = request.user
#     else:
#         return HttpResponse("Only POST method.")

@csrf_exempt
def get_spins(request):

	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		transactions = json.loads(request.POST.get('transactions'));
		# game_type = request.POST.get('game_type');
		response = {}

		if csrf_invalid:
			response = {
				'error' : 'invalid CSRF Token'
			}
		else :
			if user_id == None:
				raise Exception('User ID is not valid')
			else:
				ip = get_client_ip(request)
				game_access = GameAccess(user_id, get_client_ip(request))
				show_game = False

				# give free spins based on transactions, if necessary
				handle_transactions(game_access, transactions)

				# check if the user have the free spins, otherwise give them
				# if game_access.have_recieved_daily_free_spins() == False:
				# 	game_access.give_daily_free_spins()

				# 	# give a variable back to auto trigger the game overlay
				# 	show_game = True

				# temp for testing
				#game_access.give_daily_free_spins()
				#show_game = True

				# get the sum of previous transactions
				#totalTransactions = Treasure_Transaction.objects.filter(user_id=game_access.user_id, currency='DKK').aggregate(Sum('amount'))

				check_spin = game_access.get_spin_count();
				response = {
					'spins': game_access.get_spin_count(),
					'show_game': show_game
				}

				#'totalTransactions': totalTransactions.get('amount__sum'),
				#'givenGoldSpins': givenGoldSpins.get('gold_spins__sum')
		return JsonResponse(response)

def handle_transactions(game_access, transactions):
	# insert new transactions

	# free_spin  = 0;
	if 'totalRecordCount' in transactions and transactions['totalRecordCount'] > 0:
		sum_all = 0
		for transaction in transactions['transactions']:
			transaction_id = transaction['transactionID']
			transaction_date = dateutil.parser.parse(transaction['time'])
			amount = transaction['credit']['amount']
			name = transaction['credit']['name']
			currency = transaction['credit']['currency']
			Treasure_Transaction.objects.create(
				user_id=game_access.user_id, 
				transaction_id=transaction_id, 
				transaction_date=transaction_date, 
				amount=amount, 
				casino_name=name,
				currency=currency
			)
			# pp = pprint.PrettyPrinter(indent=4)
			# pp.pprint(transaction)
			# sumary monney
			totalTransactions = 0
			totalTransactionsQuery = Treasure_Transaction.objects.filter(user_id=game_access.user_id, currency=currency).aggregate(Sum('amount'))
			totalTransactions = totalTransactionsQuery.get('amount__sum')
			# print('totalTransactions',totalTransactions)
			totalTransactionsCount = Treasure_Transaction.objects.filter(user_id=game_access.user_id, currency=currency).count()
			# print('totalTransactionsCount',totalTransactionsCount)
			deposit_euro = 0
			deposit_euro = to_euro(totalTransactions,currency)
			sum_all += deposit_euro
			first_deposit = Treasure_Roll_Bonus_Setting.objects.filter(check_first=1,active_status=1)

			# print(deposit_euro)
			if totalTransactionsCount == 1 and deposit_euro > first_deposit[0].total:
				game_access.add_spins(first_deposit[0].roll,'first deposit',1,0)

			# print('sum all',sum_all)
			roll_deposit = Treasure_Roll_Bonus_Setting.objects.filter(check_first=0,active_status=1)
			amount_after_bonus = deposit_euro
			# print('amount_after_bonus 1',amount_after_bonus)
			for roll_list in roll_deposit:
				# pp = pprint.PrettyPrinter(indent=4)
				# pp.pprint(roll_list)
				# print(roll_list.total)
				amount_after_bonus -= roll_list.total
				if deposit_euro >=  roll_list.total:
					check_log = Treasure_Game_Log.objects.filter(user_id=game_access.user_id,value=roll_list.total,type=2)
					if check_log.exists() == False:
						game_access.add_spins(roll_list.roll,'deposit bonus >'+str(roll_list.total),2,roll_list.total)
			# print('amount_after_bonus 2',amount_after_bonus)
			if int(amount_after_bonus) > 0 :
				deposit_every = Treasure_Every_Deposit_Setting.objects.get(id=1)
				# print('s')
				# pp = pprint.PrettyPrinter(indent=4)
				# pp.pprint(deposit_every)
				# print(deposit_every.more_than_total)
				every_round = math.ceil(amount_after_bonus/deposit_every.more_than_total)
				# print('every_round',every_round)
				sum_value = roll_list.total
				for x in range(every_round):
					# print(x)
					# amount_after_bonus -= deposit_every.more_than_total
					sum_value += deposit_every.more_than_total
					if amount_after_bonus > 0:
						check_log = Treasure_Game_Log.objects.filter(user_id=game_access.user_id,value=sum_value,type=3)
						if check_log.exists() == False:
							game_access.add_spins(deposit_every.roll,'deposit bonus every '+str(deposit_every.more_than_total),3,sum_value)
			# print('amount_after_bonus 3',amount_after_bonus)
			# get spin
			# if totalTransactionsCount == 1 or totalTransactionsCount>3:
    				#game_access.add_spins(str(deposit_level), 1, 'deposit ' + str(amount) + '(' + transaction_id + ')')
    				# free_spin +=1
		
		# total_amount = roll_deposit.get('total__sum')
		# roll_all = roll_deposit.get('roll__sum')
		# print('roll all',roll_all)
		# print('total_amount',total_amount)
		# if sum_all >=  total_amount:
		# 	print('more than')
def to_euro(amount,convert_from):
		if convert_from == 'USD':
				deposit_euro = ( amount * (0.86588))
		elif convert_from == 'GBP':
				deposit_euro = ( amount * (1.12495))
		elif convert_from == 'CAD':
				deposit_euro = ( amount * (0.67542))
		elif convert_from == 'NOK':
				deposit_euro = ( amount * (0.10591))
		elif convert_from == 'SEK':
				deposit_euro = ( amount * (0.09631))
		elif convert_from == 'ARS':
				deposit_euro = ( amount * (0.02228))
		elif convert_from == 'ITL':
				deposit_euro = ( amount * (0.00052))
		elif convert_from == 'CNH':
				deposit_euro = ( amount * (0.12574))
		elif convert_from == 'KRW':
				deposit_euro = ( amount * (0.00077))
		elif convert_from == 'JPY':
				deposit_euro = ( amount * (0.00761))
		else:
				deposit_euro = amount
		return deposit_euro

@csrf_exempt
def spin(request):
	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		# game_type = request.POST.get('wheel')
		user_id = request.POST.get('user_id')
		# user_email = request.POST.get('user_email')
		response = {}

		if csrf_invalid:
			response = {
				'error' : 'invalid CSRF Token'
			}
		else :
			if user_id == None:
				raise Exception('User ID is not valid')
			else:

				# play the game
				game = Game(user_id, get_client_ip(request));

				game.play()

				# get the results back
				game_result = game.result()

				# send_email(user_id, user_email, game_result)
				#
				# results
				response = game_result
				
		return JsonResponse(response)

@csrf_exempt
def get_last_transaction(request):

	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		response = {}
		if csrf_invalid:
			response = {
				'error' : 'invalid CSRF Token'
			}
		else :
			response = {
				'transaction_date': None
			}

			if user_id == None:
				raise Exception('User ID is not valid')
			else:
				try:
					transaction = Treasure_Transaction.objects.filter(user_id=user_id).order_by('-transaction_date')[:1].get()
					response['transaction_date'] = transaction.transaction_date

				except Treasure_Transaction.DoesNotExist:
					transaction = None

		return JsonResponse(response)

def get_client_ip(request):
	x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
	if x_forwarded_for:
		ip = x_forwarded_for.split(',')[0]
	else:
		ip = request.META.get('REMOTE_ADDR')
	return ip


@csrf_exempt
def get_position(request):

	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		# game_type = request.POST.get('game_type');
		print('user_id',user_id)
		response = {}

		if csrf_invalid:
			response = {
				'error' : 'invalid CSRF Token'
			}
		else :
			if user_id == None:
				raise Exception('User ID is not valid')
			else:
				ip = get_client_ip(request)
				game_access = GameAccess(user_id, get_client_ip(request))
				pp = pprint.PrettyPrinter(4)
				pp.pprint(game_access)
				print('-------- sd -------')
				response = {
					'position': game_access.access_record.position
				}

		return JsonResponse(response)

@csrf_exempt
def get_notifications(request):

	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		# game_type = request.POST.get('game_type');
		print('user_id',user_id)
		response = {}

		if csrf_invalid:
			response = {
				'error' : 'invalid CSRF Token'
			}
		else :
			if user_id == None:
				raise Exception('User ID is not valid')
			else:
				data = Treasure_Game.objects.filter(user_id=user_id,win_type__in=[1, 5, 6]).order_by(Lower('created_date').desc())[:10]
				
				pp = pprint.PrettyPrinter(4)
				pp.pprint(data)

		return render(request,'notifications.html',{'notifications':data})

@csrf_exempt
def get_deposit(request):

	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		# game_type = request.POST.get('game_type');
		print('user_id',user_id)
		response = {}

		if csrf_invalid:
			response = {
				'error' : 'invalid CSRF Token'
			}
		else :
			if user_id == None:
				raise Exception('User ID is not valid')
			else:
				totalTransactionsQuery = Treasure_Transaction.objects.filter(user_id=user_id).values('currency').annotate(Sum('amount'))
				# print(totalTransactionsQuery.query)
				# totalTransactions = totalTransactionsQuery.get('amount__sum')
				# print('--> transactions',totalTransactionsQuery)
				# pp = pprint.PrettyPrinter(4)
				# pp.pprint(totalTransactionsQuery)
				# print(totalTransactions.query)
				deposit_sum = 0
				for deposit_list in totalTransactionsQuery:
					deposit_sum+= to_euro(deposit_list['amount__sum'],deposit_list['currency'])
					# print(test_list['amount__sum'])
				max_roll_deposit = Treasure_Roll_Bonus_Setting.objects.filter(check_first=0,active_status=1).aggregate(Max('total'))
				max_roll = max_roll_deposit.get('total__max')
				print(deposit_sum)
				if deposit_sum >= max_roll:
					total_after_roll = (deposit_sum-max_roll)
					deposit_every = Treasure_Every_Deposit_Setting.objects.get(id=1)
					# print('dele',(total_after_roll))
					every_round = math.ceil(total_after_roll/deposit_every.more_than_total)
					percent_cal = (every_round * deposit_every.more_than_total)-total_after_roll
					percent_value = percent_cal/deposit_every.more_than_total * 100
					# print('eve',percent_value)
					response = {
						'roll':100,
						'every':percent_value,
						'test':[
							{
								'res':'sss',
								'ds':'dddd',
								'wdd':'dsd'
							},{
								'res':'sss',
								'ds':'dddd',
								'wdd':'dsd'
							}
						],
						'sss':serializers.serialize('json',Treasure_Roll_Bonus_Setting.objects.filter(active_status=1))
					}
				else:
					percent_value = deposit_sum/max_roll * 100
					response = {
						'roll':percent_value,
						'every':0
					}

				# pp.pprint(max_roll_deposit)
				print(max_roll_deposit)
				# response = {
				# 	'data':serializers.serialize('json',totalTransactionsQuery)
				# }

		return JsonResponse(response)