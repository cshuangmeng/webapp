$(function(){
	$('.p-ddqr-goods .items div:last').css("border","none");
	var $pay = $('#js-pay'),
		$isbuluobi = $('#js-isbuluobi'),
		$isbuluofen = $('#js-isbuluofen'),
		$tipContent = $('#js-tipContent'),
		$buluobiVal = $('#js-buluobiVal'),
		$buluofenVal = $('#js-buluofenVal'),
		$choseaddress = $('#js-p-ddqr-address'),
		$addressli = $('.p-address-li'),
		$consigner = $('#js-consigner'),
		$areaName = $('#js-areaName'),
		$mobile = $('#js-mobile'),
		$goodsList = $('#js-goodsList'),
		$coin = $('#js-coin'),
		$point = $('#js-point'),
		$yaoqingmaVal = $('#js-yaoqingmaVal'),
		$totleMoney = $('#js-totleMoney'),
		$biDikou = $('#js-biDikou'),
		$fenDikou = $('#js-fenDikou'),
		$yaoqingmaHtml = $('#js-p-ddqr-yaoqingma');
	
	//关闭弹框
	hideTip();
	var config = {};
	config.coinDikou = 0;
	config.pointDikou = 0;
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	config.itemIds = getUrlParam('itemIds');
	config.isInviteCode = getUrlParam('isInviteCode');
	//share
	share('8','','','');
	if(config.isInviteCode && config.isInviteCode == 1){
		$yaoqingmaHtml.show();
	}
	//订单确认orderconfirm
	$.ajax({
        type: "POST",
        url: orderconfirm,
        data:{"uuid":config.uuid,"itemIds":config.itemIds},
        dataType:"json",
        async:false,
        success: function(data){
        	if(data.code == 0){
        		config.totalMiniPrice = data.data.totalMiniPrice;
        		config.coinRate = data.data.coinRate;
        		config.pointRate = data.data.pointRate;
        		config.point = data.data.point;
        		config.coin = data.data.coin;
        		$coin.text(config.coin);
        		$point.text(config.point);
        		//是否可用抵扣
    			if(config.coinRate == 0){
        			$('#js-coinRate').css("display","none");
        		}
    			if(config.pointRate == 0){
        			$('#js-pointRate').css("display","none");
        		}
    			if(config.coinRate == 0 && config.pointRate == 0){
    				$('.p-ddqr-dikou').css("display","none");
    			}
        		//地址
        		if(data.data.address == null || data.data.address == "" || data.data.address == undefined){
        			window.location.href="/weixin/addAddress.html?openid="+config.openid+"&uuid="+config.uuid+"&page=0"+"&itemIds="+config.itemIds;
        		}else{
        			if(data.data.address.consigner){
	        			$consigner.text(data.data.address.consigner);
	        		}
	        		if(data.data.address.consigner){
	        			$mobile.text(data.data.address.mobile);
	        		}
	        		if(data.data.address.areaName && data.data.address.address){
	        			$areaName.text(data.data.address.areaName+data.data.address.address);
	        		}
	        		if(data.data.address.id){
	        			config.areaId = data.data.address.id;
	        		}
        		}
        		//商品
        		for(var i=0;i<data.data.goods.length;i++){
					$goodsList.append('<div class="p-ddqr-goods" totalPrice="'+data.data.goods[i].totalPrice+'"><div class="shopname">'+data.data.goods[i].shopName+'</div><div class="shopGoodsList'+i+'"></div><div class="items"><div class="money"><span class="tit">实际支付现金：</span><span class="con">￥'+data.data.goods[i].totalPrice+'</span></div><div class="buluobi"><span class="tit">本次消费所获得的部落分：</span><span class="con">'+data.data.goods[i].totalPoint+'</span></div></div></div>');
					for(var j=0;j<data.data.goods[i].goods.length;j++){
						$('.shopGoodsList'+i+'').append('<div class="goods"><div class="goodsImg"><img src="'+data.data.goods[i].goods[j].headImg+'"/></div><div class="goodsCon"><p class="tit">'+data.data.goods[i].goods[j].goodsName+'</p><div class="num"><span class="price">￥'+data.data.goods[i].goods[j].price+'</span><span class="number">X'+data.data.goods[i].goods[j].amount+'</span></div></div><div class="clear"></div></div>');
					}
				}
        	}       
        }
    });
    
    //总金额
    config.totalPrice = 0;
	$('.p-ddqr-goods').each(function(){
		config.totalPrice += parseInt($(this).attr('totalPrice'));
	});
	$totleMoney.text(config.totalPrice);
	//最高抵扣金额
	config.MaximumPrice = config.totalPrice - config.totalMiniPrice;
	//部落币输入判断
	$buluobiVal.blur(function(){
		var _this = $(this);
		if(_this.val()%config.coinRate != 0){
			$tipContent.text('每两个部落币抵扣一元，部落币选用个数应为'+config.coinRate+'的倍数！');
			showTip();
			$('#js-isbuluobi labal').removeClass('isDefaultHover');
			config.isbuluobi = 0;
			_this.val("");
		}
		if(_this.val()%config.coinRate == 0){
			var dikouPrice = _this.val()/config.coinRate+$buluofenVal.val()/config.pointRate;
			config.shifuPrice = config.totalPrice-dikouPrice;
			$biDikou.text(_this.val()/config.coinRate);
			if(config.shifuPrice < config.totalMiniPrice){
				$tipContent.text('超过最高抵扣金额，最高抵扣金额为¥'+config.MaximumPrice+'！');
				showTip();
				$('#js-isbuluobi labal').removeClass('isDefaultHover');
				config.isbuluobi = 0;
				_this.val("");
			}
		}
	});
	//修改部落分
	$buluobiVal.focus(function(){
		config.isbuluobi = 0;
		$('#js-isbuluobi labal').removeClass('isDefaultHover');
		config.coinDikou = 0;
		$totleMoney.text(config.totalPrice-config.coinDikou-config.pointDikou);
	});
	//	是否使用部落币
	config.isbuluobi = 0;
	$('#js-isbuluobi labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('isDefaultHover') || $buluobiVal.val()%config.coinRate != 0 || parseInt($coin.text())<$buluobiVal.val()){
			_this.removeClass('isDefaultHover');
			config.isbuluobi = 0;
			config.coinDikou = 0;
			$totleMoney.text(config.totalPrice-config.coinDikou-config.pointDikou);
		}else{
			_this.addClass('isDefaultHover');
			config.isbuluobi = _this.parent().parent().find('input').val();
			config.coinDikou = $buluobiVal.val()/config.coinRate;
			$totleMoney.text(config.totalPrice-config.coinDikou-config.pointDikou);
		}
	});
	
	//	部落分输入判断
	$buluofenVal.blur(function(){
		var _this = $(this);
		if(_this.val()%config.pointRate != 0){
			$tipContent.text('每三个部落分抵扣一元，部落分选用个数应为'+config.pointRate+'的倍数！');
			showTip();
			$('#js-isbuluofen labal').removeClass('isDefaultHover');
			config.isbuluofen = 0;
			_this.val("");
		}
		if(_this.val()%config.pointRate == 0){
			var dikouPrice = _this.val()/config.pointRate+$buluobiVal.val()/config.coinRate;
			config.shifuPrice = config.totalPrice-dikouPrice;
			
			$fenDikou.text(_this.val()/config.pointRate);
			if(config.shifuPrice < config.totalMiniPrice){
				$tipContent.text('超过最高抵扣金额，最高抵扣金额为¥'+config.MaximumPrice+'！');
				showTip();
				$('#js-isbuluofen labal').removeClass('isDefaultHover');
				config.isbuluofen = 0;
				_this.val("");
			}
		}
	});
	//修改部落分
	$buluofenVal.focus(function(){
		config.isbuluofen = 0;
		$('#js-isbuluofen labal').removeClass('isDefaultHover');
		config.pointDikou = 0;
		$totleMoney.text(config.totalPrice-config.coinDikou-config.pointDikou);
	});
	//	是否使用部落分
	config.isbuluofen = 0;
	$('#js-isbuluofen labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('isDefaultHover') || $buluofenVal.val()%config.pointRate != 0 || parseInt($point.text())<$buluofenVal.val()){
			_this.removeClass('isDefaultHover');
			config.isbuluofen = 0;
			config.pointDikou = 0;
			$totleMoney.text(config.totalPrice-config.coinDikou-config.pointDikou);
		}else{
			_this.addClass('isDefaultHover');
			config.isbuluofen = _this.parent().parent().find('input').val();
			config.pointDikou = $buluofenVal.val()/config.pointRate;
			$totleMoney.text(config.totalPrice-config.coinDikou-config.pointDikou);
		}
	});

	//重新选择地址
	$choseaddress.click(function(){
		$('.p-address-main').show();
	});
	$addressli.click(function(){
		$('.p-address-main').hide();
		$consigner.text($(this).attr('consigner'));
		$areaName.text($(this).attr('areaName'));
		$mobile.text($(this).attr('mobile'));
		config.areaId = $(this).attr('areaId');
	});
	
	//支付(ordernew)uuid=6d4722642c554a4aa75e417fafea6c76&itemIds=4&price=83&addressId=4&coin=10&point=0
	var payConfig={};
	$pay.click(function(){
		payConfig.totalPrice = config.totalPrice-config.isbuluobi/config.coinRate-config.isbuluofen/config.pointRate;
		config.tribeId = $yaoqingmaVal.val();
		console.log(config.tribeId);
		if(config.tribeId==""||config.tribeId==undefined||config.tribeId==null){
			config.tribeId = 0;
		}
		$.ajax({
		    type: "POST",
		    url: login,
		    data:{"openId":config.openid},
		    dataType:"json",
		    async:false,
		    success: function(data){
		    	if(data.code == 0){
					$.ajax({
					    type: "POST",
					    url: ordernew,
					    data:{"uuid":config.uuid,"itemIds":config.itemIds,"price":payConfig.totalPrice,"addressId":config.areaId,"coin":config.isbuluobi,"point":config.isbuluofen,"tribeId":config.tribeId},
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
					    	}else{
					    		$tipContent.text(data.msg);
								showTip();
					    	}
					    }
					});
		    	}else if(data.code == 104){
		    		window.location.href = "/weixin/bangdingPhone.html?openid="+config.openid+"&itemIds="+config.itemIds+"&loginReturn=1";
		    	}else{
		    		$tipContent.text(data.msg);
					showTip();
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
//			        			state=0表示待付款
								if(data.data.order.state == 0){
				        			window.location.href="/weixin/paySuccess.html?openid="+config.openid+"&uuid="+config.uuid+"&state=0";
				        		}
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
