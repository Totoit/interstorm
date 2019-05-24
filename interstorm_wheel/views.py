from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.db.models import Sum
from random import randint
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware
from django.views.decorators.cache import never_cache
from django.core import serializers
# from wheel.game_logic import Game, GameAccess
from interstorm_wheel.models import WheelTransaction, WheelAccessLog,  WheelGames, WheelBonusCode
from site_config.models import SiteConfig
import datetime
import json
import dateutil.parser
from interstorm import settings
# Create your views here.
@never_cache
def index(request):
	template = './home.html'
	context = {}
	context['time'] = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
	context['EVERYMATRIX'] = {
		'url':'api-stage.everymatrix.com/v2',
		'domain':'http://www.exclusiveclubcasino.com',
	}
	return render(request, template, context)


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
					transaction = WheelTransaction.objects.filter(user_id=user_id).order_by('-transaction_date')[:1].get()
					response['transaction_date'] = transaction.transaction_date

				except WheelTransaction.DoesNotExist:
					transaction = None

		return JsonResponse(response)

@csrf_exempt
def get_spins(request):

	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		transactions = json.loads(request.POST.get('transactions'));
		game_type = request.POST.get('game_type');
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

				check_spin = game_access.get_spin_count();
				if game_type == '3':
					if check_spin['level_1']  >  0 :
						for i in range(check_spin['level_1']):
							game_access.add_spins('3', 1, 'plus from level 1 ')
							game_access.use_spin('1')
					if check_spin['level_2']  >  0 :
						for i in range(check_spin['level_2']):
							game_access.add_spins('3', 1, 'plus from level 2 ')
							game_access.use_spin('2')
				elif game_type == '2':
					if check_spin['level_1']  >  0 :
						for i in range(check_spin['level_1']):
							game_access.add_spins('2', 1, 'plus from level 1 ')
							game_access.use_spin('1')
				response = {
					'spins': game_access.get_spin_count(),
					'show_game': show_game
				}

				#'totalTransactions': totalTransactions.get('amount__sum'),
				#'givenGoldSpins': givenGoldSpins.get('gold_spins__sum')
		return JsonResponse(response)

@csrf_exempt
def spin(request):
	if request.method == 'POST':
		csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		game_type = request.POST.get('wheel')
		user_id = request.POST.get('user_id')
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
				game = Game(user_id, get_client_ip(request), game_type);

				game.play()

				# get the results back
				game_result = game.result()

				# results
				response = game_result
				
		return JsonResponse(response)

def handle_transactions(game_access, transactions):
	# insert new transactions
	
	# free_spin  = 0;
	if 'totalRecordCount' in transactions and transactions['totalRecordCount'] > 0:
		for transaction in transactions['transactions']:
			transaction_id = transaction['transactionID']
			transaction_date = dateutil.parser.parse(transaction['time'])
			amount = transaction['debit']['amount']
			name = transaction['debit']['name']
			currency = transaction['debit']['currency']
			WheelTransaction.objects.create(
				user_id=game_access.user_id, 
				transaction_id=transaction_id, 
				transaction_date=transaction_date, 
				amount=amount, 
				casino_name=name,
				currency=currency
			)
			
			level_1 = 0
			level_2 = 0
			level_3 = 0
			# sumary monney
			totalTransactions = 0
			totalTransactionsQuery = WheelTransaction.objects.filter(user_id=game_access.user_id, currency=currency).aggregate(Sum('amount'))
			totalTransactions = totalTransactionsQuery.get('amount__sum')
			
			totalTransactionsCount = WheelTransaction.objects.filter(user_id=game_access.user_id, currency=currency).count()
			
			deposit_euro = 0

			# find level
			deposit_level = 1

			if deposit_euro < 500:
					deposit_level  = 1
			elif  deposit_euro >= 500 and deposit_euro <  2000:
					deposit_level = 2
			else:
					deposit_level = 3
			# get spin
			if totalTransactionsCount == 1 or totalTransactionsCount>3:
					game_access.add_spins(str(deposit_level), 1, 'deposit ' + str(amount) + '(' + transaction_id + ')')
					# free_spin +=1
		

def get_client_ip(request):
	x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
	if x_forwarded_for:
		ip = x_forwarded_for.split(',')[0]
	else:
		ip = request.META.get('REMOTE_ADDR')
	return ip


@csrf_exempt
def get_bonus_code(request):
		if request.method == 'POST':
			print(request)
			csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
			if csrf_invalid:
				response = {
					'error' : 'invalid CSRF Token'
				}
				return JsonResponse(response)
			else :
				# user_id = request.POST.get('user_id');
				response = WheelBonusCode.objects.all()
				json_res = []

				for record in response: 
					json_obj = record.bonus_code
					json_res.append(json_obj)
				print(json_res)
				# response_serialized = serializers.serialize('json', response,fields=('bonus_code'))
				return JsonResponse(json_res,safe=False)