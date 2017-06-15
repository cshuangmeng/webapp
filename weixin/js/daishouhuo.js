$(function(){
	var $daishouhuomain = $('#js-p-daishouhuo-main');
	var config = {};
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	//share
	share('6','','','');
	$.ajax({
	    type: "POST",
	    url: orderlist,
	    data:{"uuid":config.uuid,"state":"2"},
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.code == 0){
	    		for(var i=0;i<data.data.orders.length;i++){
	    			$daishouhuomain.append('<div class="p-daishouhuo-li"><div class="orderNumber"><span>订单编号</span><span>'+data.data.orders[i].tradeNo+'</span></div><div class="js-goodsList'+i+'"></div><div class="mes"><span>商品共计实付  ￥<b>'+data.data.orders[i].totalPrice+'</b></span><div class="clear"></div></div><div class="pay"><span>'+data.data.orders[i].state+'</span><div class="clear"></div></div></div>');
					for(var j=0;j<data.data.orders[i].goods.length;j++){
						$('.js-goodsList'+i+'').append('<div class="goods" goodId="'+data.data.orders[i].goods[j].id+'"><div class="goodsImg"><img src="'+data.data.orders[i].goods[j].headImg+'"/></div><div class="goodsCon"><p class="tit">'+data.data.orders[i].goods[j].name+'</p><p class="message"><span style="float: right;">X'+data.data.orders[i].goods[j].amount+'</span></p></div><div class="clear"></div></div>');
					}
					//去商品详情
		    		$('.goods').click(function(){
						config.goodId = $(this).attr('goodId');
						window.location.href="/weixin/shangpinxiangqing.html?openid="+config.openid+"&uuid="+config.uuid+"&goodId="+config.goodId;
					});
				}
	    	}
	    }
	});
});
