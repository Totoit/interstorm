from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.db.models import Sum
from random import randint
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import CsrfViewMiddleware
from django.views.decorators.cache import never_cache
from django.core import serializers
from interstorm_wheel.game_logic import Game, GameAccess
from interstorm_wheel.models import WheelTransaction, WheelAccessLog,  WheelGames, WheelBonusCode,WheelLevelManage,WheelImageLevel
from site_config.models import SiteConfig
import datetime
import json
import dateutil.parser
from interstorm import settings
from django.views.decorators.csrf import csrf_protect
from interstorm_vendor.models import InterStormUserVendor
from site_config.models import SiteConfig
# Create your views here.
@never_cache
def index(request):
	template = './home.html'
	context = {}
	# import pprint
	# pp = pprint.PrettyPrinter(indent=4)
	# pp.pprint(request.GET)
	userid = request.GET.get('userid')
	usercode = request.GET.get('usercode')
	print(userid,usercode)
	if(InterStormUserVendor.objects.filter(usercode = usercode).exists()):
		print("exists")
		domain = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = usercode).user_id).domain)
		url = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = usercode).user_id).url)
		print(domain,url)
		apiKey = {
			'url' : url,
			'domain' : domain
    	}
		context['time'] = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
		context['EVERYMATRIX'] = apiKey
		context['userid'] = userid
		context['vendor'] = usercode
		return render(request, template, context)
	else:
		return HttpResponse("no user code or userid")
	# domain = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = code).user_id).domain)
    # url = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = code).user_id).url)

@never_cache
def login(request):
	template = './login.html'
	context = {}
	# import pprint
	# pp = pprint.PrettyPrinter(indent=4)
	# pp.pprint(request.GET)
	# userid = request.GET.get('userid')
	usercode = request.GET.get('usercode')
	# print(userid,usercode)
	if(InterStormUserVendor.objects.filter(usercode = usercode).exists()):
		print("exists")
		domain = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = usercode).user_id).domain)
		url = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = usercode).user_id).url)
		print(domain,url)
		apiKey = {
			'url' : url,
			'domain' : domain
    	}
		context['time'] = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
		context['EVERYMATRIX'] = apiKey
		# context['userid'] = userid
		context['vendor'] = usercode
		return render(request, template, context)
	else:
		return HttpResponse("no user code or userid")
	# domain = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = code).user_id).domain)
    # url = str(SiteConfig.objects.get(vendor_id = InterStormUserVendor.objects.get(usercode = code).user_id).url)


@csrf_exempt
def get_last_transaction(request):

	if request.method == 'POST':
		# csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		vendor = request.POST.get('vendor');
		response = {}
		# if csrf_invalid:
		# 	response = {
		# 		'error' : 'invalid CSRF Token'
		# 	}
		# else :
		response = {
			'transaction_date': None
		}

		if user_id == None or vendor == None :
			raise Exception('User ID is not valid')
		else:
			# try:
			print('data')
			print(InterStormUserVendor.objects.get(usercode = vendor).user_id)
			if(WheelTransaction.objects.filter(user_id=user_id,vendor_id = InterStormUserVendor.objects.get(usercode = vendor).user_id).exists()):
				print("have data")
				transaction = WheelTransaction.objects.filter(user_id=user_id,vendor_id = InterStormUserVendor.objects.get(usercode = vendor).user_id).order_by('-transaction_date')[:1].get()
				response['transaction_date'] = transaction.transaction_date
			else:
				print("no data")
				transaction = None
			# transaction = WheelTransaction.objects.filter(user_id=user_id,vendor_id = InterStormUserVendor.objects.get(usercode = vendor).user_id).order_by('-transaction_date')[:1].get()
			print('ssssss-----------')
			# response['transaction_date'] = ''#transaction.transaction_date

			# except WheelTransaction.DoesNotExist:
				# transaction = None

		return JsonResponse(response)

@csrf_exempt
def get_spins(request):

	if request.method == 'POST':
		# csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
		user_id = request.POST.get('user_id');
		transactions = json.loads(request.POST.get('transactions'));
		vendor = request.POST.get('vendor');
		# game_type = request.POST.get('game_type');
		response = {}

		# if csrf_invalid:
		# 	response = {
		# 		'error' : 'invalid CSRF Token'
		# 	}
		# else :
		if user_id == None:
			raise Exception('User ID is not valid')
		else:
			ip = get_client_ip(request)
			game_access = GameAccess(user_id, get_client_ip(request),vendor)
			show_game = False
			level = 1

			# give free spins based on transactions, if necessary
			handle_transactions(game_access, transactions)
			level = game_access.get_level()
			check_spin = game_access.get_spin_count();
			if level == '3':
				if check_spin['level_1']  >  0 :
					for i in range(check_spin['level_1']):
						game_access.add_spins('3', 1, 'plus from level 1 ')
						game_access.use_spin('1')
				if check_spin['level_2']  >  0 :
					for i in range(check_spin['level_2']):
						game_access.add_spins('3', 1, 'plus from level 2 ')
						game_access.use_spin('2')
			elif level == '2':
				if check_spin['level_1']  >  0 :
					for i in range(check_spin['level_1']):
						game_access.add_spins('2', 1, 'plus from level 1 ')
						game_access.use_spin('1')
			response = {
				'spins': game_access.get_spin_count(),
				'level':level,
				'show_game': show_game,

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
		vendor = request.POST.get('vendor')
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
				game = Game(user_id, get_client_ip(request),vendor, game_type);

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
		print('game_access.vendor',game_access.vendor)
		# print(transactions['totalRecordCount'])
		# vendor_id = InterStormUserVendor.objects.get(usercode = game_access.vendor).user_id
		# print(transactions['transactions'])
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
				currency=currency,
				vendor_id=game_access.vendor
			)
			
			level_1 = 0
			level_2 = 0
			level_3 = 0
			# sumary monney
			totalTransactions = 0
			deposit_euro = 0
			totalTransactionsQuery = WheelTransaction.objects.filter(user_id=game_access.user_id, currency=currency,vendor_id=game_access.vendor).aggregate(Sum('amount'))
			totalTransactions = totalTransactionsQuery.get('amount__sum')
			
			totalTransactionsCount = WheelTransaction.objects.filter(user_id=game_access.user_id, currency=currency,vendor_id=game_access.vendor).count()
			
			#---------------- change
			
			# vendor_id = '3'
			level1 = WheelLevelManage.objects.filter(level = 1,vendor_id = game_access.vendor)
			level2 = WheelLevelManage.objects.filter(level = 2,vendor_id = game_access.vendor)
			level3 = WheelLevelManage.objects.filter(level = 3,vendor_id = game_access.vendor)
			
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
			# get spin
			
			game_access.add_spins(str(deposit_level), 1, 'deposit ' + str(amount) + '(' + transaction_id + ')')
			
		

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
			# csrf_invalid = CsrfViewMiddleware().process_view(request, None, (), {})
			# print(csrf_invalid)
			# if csrf_invalid:
			# 	response = {
			# 		'error' : 'invalid CSRF Token'
			# 	}
			# 	return JsonResponse(response)
			# else :
				# user_id = request.POST.get('user_id');
			response = WheelBonusCode.objects.all()
			json_res = []

			for record in response: 
				json_obj = record.bonus_code
				json_res.append(json_obj)
			print(json_res)
			# response_serialized = serializers.serialize('json', response,fields=('bonus_code'))
			return JsonResponse(json_res,safe=False)
		else:
			return HttpResponse("USER ONLY POST")

# @csrf_exempt
def get_wheel_image(request):
	if(request.method == 'POST'):
		level = 1

		vendor = request.POST.get('vendor')
		# userid = request.POST.get('userid')
		level = request.POST.get('level')
		print('level=',level,' vendor = ',vendor)
		WheelImageLevelTemp = WheelImageLevel.objects.filter(level=level ,vendor_id = InterStormUserVendor.objects.get(usercode = vendor).user_id)
		print(WheelImageLevelTemp)
		imagaPath = WheelImageLevelTemp[0].image.url
		return HttpResponse(imagaPath)

	else:
		return HttpResponse("Use Only Post")