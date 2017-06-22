$(function(){
	var $daifukuanmain = $('#js-p-daifukuan-main'),
		$tipContent = $('#js-tipContent');
	var config = {};
	//关闭弹框
	hideTip();
	//share
	share('5','','','');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	$.ajax({
	    type: "POST",
	    url: orderlist,
	    data:{"uuid":config.uuid,"state":"0"},
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.code == 0){
	    		for(var i=0;i<data.data.orders.length;i++){
					$daifukuanmain.append('<div class="p-daifukuan-li"><div class="orderNumber"><span>订单编号</span><span>'+data.data.orders[i].tradeNo+'</span><span class="js-orderDel" style="float: right;" orderId="'+data.data.orders[i].orderId+'">删除</span></div><div class="js-goodsList'+i+'"></div><div class="mes"><span>商品实付  ￥<b>'+data.data.orders[i].totalPrice+'</b></span><div class="clear"></div></div><div class="pay"><span orderId="'+data.data.orders[i].orderId+'" class="js-pay">付款</span><div class="clear"></div></div></div>');
					for(var j=0;j<data.data.orders[i].goods.length;j++){
						$('.js-goodsList'+i+'').append('<div class="goods" goodId="'+data.data.orders[i].goods[j].id+'"><div class="goodsImg"><img src="'+data.data.orders[i].goods[j].headImg+'"/></div><div class="goodsCon"><p class="tit">'+data.data.orders[i].goods[j].name+'</p><p class="message"><span style="float: right;">X'+data.data.orders[i].goods[j].amount+'</span></p></div><div class="clear"></div></div>');
					}
				}
	    		//去商品详情
	    		$('.goods').click(function(){
					config.goodId = $(this).attr('goodId');
					window.location.href="/weixin/shangpinxiangqing.html?openid="+config.openid+"&uuid="+config.uuid+"&goodId="+config.goodId;
				});
	    	}
	    }
	});
	//删除订单
	$('.js-orderDel').click(function(){
		var _this = $(this);
		config.orderId = _this.attr('orderId');
		$tipContent.text("确定要删除该订单？");
		showTip();
	});
	$('#js-tipBtn-true').click(function(){
		$('#js-tipCon').hide();
		$.ajax({
		    type: "POST",
		    url: orderdelete,
		    data:{"uuid":config.uuid,"orderId":config.orderId},
		    dataType:"json",
		    async:false,
		    success: function(data){
		    	if(data.code == 0){
		    		window.location.reload();
		    	}
		    }
		});
	});
	
	//付款
	var payConfig = {};
	$('.js-pay').click(function(){
		var _this = $(this);
		config.orderId = _this.attr('orderId');
		$.ajax({
		    type: "POST",
		    url: orderpay,
		    data:{"uuid":config.uuid,"orderId":config.orderId},
		    dataType:"json",
		    async:false,
		    success: function(data){
		    	if(data.code == 0){
		    		console.log(data);
		    		payConfig.appId=data.data.payInfo.appId;
					payConfig.timeStamp=data.data.payInfo.timeStamp;
					payConfig.nonceStr=data.data.payInfo.nonceStr;
					payConfig.package=data.data.payInfo.package;
					payConfig.signType=data.data.payInfo.signType;
					payConfig.paySign=data.data.payInfo.paySign;
					payConfig.orderId=data.data.orderId;
					if(typeof WeixinJSBridge == "undefined"){
						if( document.addEventListener ){
							document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
						}else if (document.attachEvent){
							document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
							document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						}
					}else{
						onBridgeReady(payConfig.orderId);
					}
		    	}
		    }
		});
	});
	function onBridgeReady(orderID){
	   	WeixinJSBridge.invoke(
	       	'getBrandWCPayRequest',{
	       		"appId" : payConfig.appId,             
				"timeStamp" : payConfig.timeStamp,     
				"nonceStr" : payConfig.nonceStr,       
				"package" : payConfig.package,         
				"signType" : payConfig.signType,       
				"paySign" : payConfig.paySign          
	       	},
	       	function(res){
				console.log(res);
				//支付结果查询(orderinfo)
				$.ajax({
			        type: "POST",
			        url: orderinfo,
			        data:{"uuid":config.uuid,"orderId":orderID},
			        dataType:"json",
			        async:false,
			        success: function(data){
			        	if(data.code == 0){
			        		if(data.data.order.state != undefined){
			        			if(data.data.order.state != 0 && data.data.order.state != 4){
				        			window.location.href="/weixin/paySuccess.html?openid="+config.openid+"&uuid="+config.uuid+"&state=1";
				        		}
//			        			//state=0表示待付款
//								if(data.data.order.state == 0){
//				        			window.location.href="/weixin/paySuccess.html?openid="+config.openid+"&uuid="+config.uuid+"&state=0";
//				        		}
			        		}
			        	}else{
			        		$tipContent.text(data.msg);
							showTip();
			        	}          
			        }
			    });
				
	       	}
	   	);
	}
	
});
