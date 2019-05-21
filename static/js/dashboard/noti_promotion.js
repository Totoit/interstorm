
var promo = [];
$.ajax({
    url: '/promotions/api/get_promotion_list/',
    type: 'POST',
    method: 'POST',
    data: {},
    success:function(data){
        if (JSON.parse(data).length > 0){
            $.each( JSON.parse(data) , function( index, value ) {
                promo.push(value.pk);
            });
            //setCookie('pwr_noti_promo', promo.join(',') ,365000);
            sessionStorage.setItem("pwr_noti_promo",  promo.join(',') );
        }
    }
});
$('.promotion_noti_popup').hide();


$(function () {
  c.doCall(function (session){
      session.call("/user/account#getProfile", [], { }).then(function (result) {
          sessionStorage.setItem("pwr_noti_promo",  promo.join(',') );
          sessionStorage.setItem("pwr_noti_promo_"+result.kwargs.fields.userID,  promo.join(',') );
          $('.promotion_noti_popup').hide();
        }, function (e) {
            console.log(e.kwargs.desc);
        });
  });
});
