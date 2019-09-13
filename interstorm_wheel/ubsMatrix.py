import json
from interstorm.settings import UBSSYSTEM_user,UBSSYSTEM_password,LANGUAGE_CODE,UBSSYSTEM_url,UBSSYSTEM_urlApi
import requests

class Struct:
    def __init__(self, **entries):
        self.__dict__.update(entries)


class ubsSystem:

    def __init__(self):
        self.url = UBSSYSTEM_url
        self.urlApi = UBSSYSTEM_urlApi
        self.payload ={}
        self.header ={}
        self.loginApp()

    def loginApp(self):
        # self.payload = (('username', 'ubs_app_user_buckandbutler'), ('password', '*App_user_buck321!'),('culture','en'))
        self.payload = (('username', UBSSYSTEM_user), ('password', UBSSYSTEM_password),('culture','en'))
        try:
            r = requests.post(self.url + 'loginApp' , data=self.payload)
            self.payload =()
            val = []
            if (r.status_code == 200) :
                val = Struct(**r.json())
                self.sessionID = val.sessionID
                self.registrationRealm = val.registrationRealm
                self.universalID = val.universalID
                self.domainID = val.domainID
                self.header={'Authorization': self.sessionID}
                self.payload={"domainID": self.domainID }
                print('login payload')
                print(self.payload)
        except Exception as e:
            print("HAHA")
            print(e)

    def getEligibleDepositBonusPrograms(self,request):
        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control':'no-cache'})
        r = s.get(self.urlApi + 'info/eligible-deposit-bonus-program',params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else :
            return  {
                'result': ("error", r.status_code)
            }

    def getEligibleClaimBonusProgram(self,request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.get(self.urlApi + 'info/eligible-claim-bonus-program', params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def getEligibleConvertBonusPrograms(self,request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.get(self.urlApi + 'info/eligible-convert-bonus-program', params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def postclaimBonus(self,request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.post(self.urlApi + 'bonus/trigger/claim', params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def postconvertToBonus(self,request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'content-type': 'application/x-www-form-urlencoded'})
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        import pprint
        pp = pprint.PrettyPrinter(indent=4)
        print('------ session -----')
        pp.pprint(self.sessionID)
        print('------ payload -----')       
        pp.pprint(self.payload)
        print('----- header -----')
        pp.pprint(s.headers)
        # r = s.post(self.urlApi + 'bonus/trigger/convert', params=self.payload, allow_redirects=False)
        r = requests.post(self.urlApi + 'bonus/trigger/convert',data=self.payload,headers=s.headers)
        print('url = '+ self.urlApi + 'bonus/trigger/convert')
        print('result')
        pp.pprint(r)
        pp.pprint(r.headers)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def getBonusWalletsByUser(self, request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.get(self.urlApi + 'wallet/'+ str(self.domainID) +'/'+ str(self.payload['userID']), params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def updateBonusWalletPriority(self, request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.put(self.urlApi + 'wallet/priority', params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def forfeitBonusWallet(self, request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.delete(self.urlApi + 'wallet/forfeit', params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }

    def getBonusWalletAggregation(self, request):

        self.payload.update(request.POST.dict())

        s = requests.Session()
        s.headers.update({'authorization': self.sessionID})
        s.headers.update({'cache-control': 'no-cache'})
        r = s.get(self.urlApi + 'wallet/aggregation', params=self.payload, allow_redirects=False)
        if (r.status_code == 200):
            return Struct(**r.json())
        else:
            return {
                'result': ("error", r.status_code)
            }
