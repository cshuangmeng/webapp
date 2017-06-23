$.ajax({
    type: "POST",
    url: login,
    data:{"openId":configData.openid},
    dataType:"json",
    async:false,
    success: function(data){
    	if(data.code == 104){
    		window.location.href = "/weixin/bangdingPhone.html?openid="+configData.openid+"&loginReturn=2";
    	}
    }
});
$(function(){
	var $total = $('#js-total'),
		$danjia = $('.js-danjia'),
		$totleNum = $('.js-totleNum'),
		$tipContent = $('#js-tipContent'),
		$shoplist = $('#js-p-gouwuche-goods'),
		$allGoogs = $('#allGoogs'),
		$pay = $('#js-pay');
	var config = {};
	config.price = 0;
	config.totleNum = 0;
	config.goodNum = 1;
	//share
	share('9','','','');
	//关闭弹框
	hideTip();
	//我的购物车(uuid=78a6771771f19b951017e100cc6cf1b6)
	$.ajax({
		type: "POST",
	    url: usercar,
	    dataType:"json",
	    data:{"uuid":configData.uuid},
	    async:false,
		success:function(data){
			if(data.code == 0){
				for(var i=0;i<data.data.length;i++){
					$shoplist.append('<div class="shop js-shop"><div class="shopName"><labal id="shop'+i+'" class="checkboxLabal" price="" totleNum=""></labal><input for="shop'+i+'" class="checkboxStyle" type="checkbox" name="checkShop"><span>'+data.data[i].shopName+'</span></div><div class="shopGoods js-shopGoods'+i+'"></div></div>');
					for(var j=0;j<data.data[i].goods.length;j++){
						$('.js-shopGoods'+i+'').append('<div class="shopGoodsList"><div class="check"><labal id="shop00_'+j+'" goodsId="'+data.data[i].goods[j].goodsId+'" itemId="'+data.data[i].goods[j].itemId+'" goodsId="'+data.data[i].goods[j].goodsId+'" class="checkboxLabal js-goodsLabal" price="'+data.data[i].goods[j].price+'" totleNum="1"></labal><input for="shop00_'+j+'" class="checkboxStyle" type="checkbox" name="checkItem"></div><div class="goodsImg"><img src="'+data.data[i].goods[j].headImg+'"/></div><div class="goodsCon"><p class="tit">'+data.data[i].goods[j].goodsName+'</p><div class="num"><span>￥'+data.data[i].goods[j].price+'</span><div class="numchange"><button  goodsId="'+data.data[i].goods[j].goodsId+'" class="reduce" price="'+data.data[i].goods[j].price+'">-</button><input type="text" class="changenum js-shuliang" value="1" class="num"/><button class="increase" price="'+data.data[i].goods[j].price+'" buyAmount="'+data.data[i].goods[j].buyAmount+'">+</button></div></div></div><div class="clear"></div></div>');
						config.shopPrice = 0;
						config.shopNum = 0;
						$('.js-shopGoods'+i+' labal').each(function(){
							config.shopPrice = config.shopPrice + parseInt($(this).attr('price'));
							config.shopNum = config.shopNum + parseInt($(this).attr('totleNum'));
						});
						$('#shop'+i+'').attr("price",config.shopPrice);
						$('#shop'+i+'').attr("totleNum",config.shopNum);
					}
				}
			}
			config.allPrice = 0;
			config.allNum = 0;
			$('.js-goodsLabal').each(function(){
				config.allPrice = config.allPrice + parseInt($(this).attr('price'))*parseInt($(this).attr('totleNum'));
				config.allNum = config.allNum + parseInt($(this).attr('totleNum'));
			});
			$allGoogs.attr("price",config.allPrice);
			$allGoogs.attr("totleNum",config.allNum);
		}
	});
	
	//选择店铺
	$('.shopName labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('checkboxLabalHover')){
			$('.quanxuan labal').removeClass('checkboxLabalHover');
			_this.removeClass('checkboxLabalHover');
			_this.parent().siblings().find('div').find('labal').removeClass('checkboxLabalHover');
			_this.parent().siblings().find('div').find('input').attr("checked",false);
			
			config.price -= parseInt(_this.attr('price'));
			$total.text(config.price);
			config.totleNum -= parseInt(_this.attr('totleNum'));
			$totleNum.text(config.totleNum);
		}else{
			_this.addClass('checkboxLabalHover');
			_this.parent().siblings().find('div').find('labal').addClass('checkboxLabalHover');
			_this.parent().siblings().find('div').find('input').attr("checked",true);
			config.price += parseInt(_this.attr('price'));
			$total.text(config.price);
			config.totleNum += parseInt(_this.attr('totleNum'));
			$totleNum.text(config.totleNum);
    		if($(".shopName labal").length == $(".shopName labal.checkboxLabalHover").length){
    			$('.quanxuan labal').addClass('checkboxLabalHover');
    		}
		}
	});
	//选择商品
	$('.shopGoods labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('checkboxLabalHover')){
			$('.quanxuan labal').removeClass('checkboxLabalHover');
			_this.removeClass('checkboxLabalHover');
			_this.siblings().attr("checked",false);
			_this.parent().parent().parent().siblings().find('labal').removeClass('checkboxLabalHover');
			config.price -= parseInt(_this.attr('price'))*parseInt(_this.parent().parent().find('.js-shuliang').val());
			$total.text(config.price);
			config.totleNum -= parseInt(_this.attr('totleNum'));
			$totleNum.text(config.totleNum);
		}else{
			_this.addClass('checkboxLabalHover');
			_this.siblings().attr("checked",true);
			
			if(_this.parent().parent().siblings().find('labal').length == _this.parent().parent().siblings().find('labal.checkboxLabalHover').length){
				_this.parent().parent().parent().siblings().find('labal').addClass('checkboxLabalHover');
			}
			config.price +=  parseInt(_this.attr('price'))*parseInt(_this.parent().parent().find('.js-shuliang').val());
			$total.text(config.price);
			config.totleNum += parseInt(_this.attr('totleNum'));
			$totleNum.text(config.totleNum);
			if($(".shopGoods labal").length == $(".shopGoods labal.checkboxLabalHover").length){
    			$('.quanxuan labal').addClass('checkboxLabalHover');
    		}
		}
	});
	//选择全部商品
	$('.quanxuan labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('checkboxLabalHover')){
			_this.removeClass('checkboxLabalHover');
			$('.p-gouwuche-goods .shopGoods div labal').removeClass('checkboxLabalHover');
			$('.p-gouwuche-goods .shopName labal').removeClass('checkboxLabalHover');
			$('.p-gouwuche-goods .shopGoods div input').attr("checked",false);
			$total.text('0');
			$totleNum.text('0');
			config.price = 0;
			config.totleNum = 0;
			config.goodNum = 1;
		}else{
			_this.addClass('checkboxLabalHover');
			$('.p-gouwuche-goods .shopGoods div labal').addClass('checkboxLabalHover');
			$('.p-gouwuche-goods .shopName labal').addClass('checkboxLabalHover');
			$('.p-gouwuche-goods .shopGoods div input').attr("checked",true);
			
			config.PRICE = 0;
			config.NUM = 0;
			$('.js-shop').each(function(){
				config.PRICE = config.PRICE + parseInt($(this).find('labal').attr('price'));
				config.NUM = config.NUM + parseInt($(this).find('labal').attr('totleNum'));
			});
			$total.text(config.PRICE);
			$totleNum.text(config.NUM);
		}
	});
	//数量加减
	$(".changenum").blur(function(){
		var _this = $(this);
        if(_this.val() > 0){
        	_this.prev().css('color','#333');
			_this.prev().removeAttr('disabled');
        }
    });
    //减
    reduce();
    function reduce(){
    	$('.reduce').click(function(){
    		var _this = $(this);
    		var val = _this.next().val();
    		val--;
    		if(val >= 0){
				_this.next().val(val);
				config.goodNum -= 1;
				_this.parent().parent().parent().parent().find('labal').attr("totleNum",config.goodNum);
				_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("totleNum",parseInt(_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("totleNum"))-1);
				_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("price",parseInt(_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("price"))-parseInt(_this.attr('price')));
				if(_this.parent().parent().parent().parent().find('labal').hasClass('checkboxLabalHover')){
					config.price -= parseInt(_this.attr('price'));
					$total.text(config.price);
					config.totleNum -= 1;
					$totleNum.text(config.totleNum);
				}
    		}
    		if(val == 0){
    			_this.css('color','#ccc');
				_this.attr('disabled','disabled');
				//删除购物车
				var goodsId = _this.attr('goodsId');
				$.ajax({
		        type: "POST",
			        url: userdropGoods,
			        data:{"uuid":configData.uuid,"goodsId":goodsId},
			        dataType:"json",
			        async:false,
			        success: function(data){
			        	if(data.code == 0){
			        		window.location.reload();
			        	}else{
			        		$tipContent.text(data.msg);
							showTip();
			        	}          
			        }
			    });
				
				
				
    		}
		});
    }
	
	//加
	increase();
	function increase(){
		$('.increase').click(function(){
			var _this = $(this);
			if(_this.attr('buyAmount') <= 1){
				return;
			}else{
				_this.prev().prev().css('color','#333');
				var val = _this.prev().val();
				val++;
				_this.prev().val(val);
				config.goodNum += 1;
				_this.parent().parent().parent().parent().find('labal').attr("totleNum",config.goodNum);
				_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("totleNum",parseInt(_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("totleNum"))+1);
				_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("price",parseInt(_this.parent().parent().parent().parent().parent().siblings().find('labal').attr("price"))+parseInt(_this.attr('price')));
				if(_this.parent().parent().parent().parent().find('labal').hasClass('checkboxLabalHover')){
					config.price += parseInt(_this.attr('price'));
					$total.text(config.price);
					config.totleNum += 1;
					$totleNum.text(config.totleNum);
				}
			}
			
		});
	}
	
	//结算
	$pay.click(function(){
		var items = "";
		var itemIds = "";
		$('.js-goodsLabal').each(function(){
			var _this = $(this);
			if(_this.hasClass('checkboxLabalHover')){
				items += _this.attr('goodsId') +","+_this.attr('totleNum')+"_";
				config.items = items.substring(0,items.length-1);
				itemIds += _this.attr('goodsId') +",";
				config.itemIds = itemIds.substring(0,itemIds.length-1);
			}
		});
		//批量保存商品useraddMultiGoods
		if(config.items != "" && config.items != undefined){
			$.ajax({
	        type: "POST",
		        url: useraddMultiGoods,
		        data:{"uuid":configData.uuid,"items":config.items},
		        dataType:"json",
		        async:false,
		        success: function(data){
		        	if(data.code == 0){
		        					window.location.href="/weixin/dingdanqueren.html?openid="+configData.openid+"&uuid="+configData.uuid+"&itemIds="+config.itemIds;
		        	}else{
		        		$tipContent.text(data.msg);
						showTip();
		        	}          
		        }
		    });
		}else{
			$tipContent.text('请先选择商品！');
			showTip();
		}
		
		
	});
	
	
		
	
	
})
