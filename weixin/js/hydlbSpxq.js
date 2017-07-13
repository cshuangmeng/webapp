$(function(){
	var $detailImgs = $('#js-detailImgs'),
		$addGouwuche = $('#js-addGouwuche'),
		$tipContent = $('#js-tipContent'),
		$pay = $('#js-pay'),
		$goshop = $('#js-goshop');
		
	var config = {};
	config.goodId = getUrlParam('goodId');
	config.isInviteCode = getUrlParam('isInviteCode');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	config.unionId = undefined != configData.unionId ? configData.unionId : getUrlParam('unionId');
	//share
	share('20','',config.goodId,'');
	//关闭弹框
	hideTip();
	//加载商品详情(id=1)
	$.ajax({
		type: "POST",
	    url: goodsinfo,
	    dataType:"json",
	    data:{"id":config.goodId,"uuid":config.uuid,"openId":config.openid},
	    async:false,
		success:function(data){
			if(data.code == 0){
				config.goodId = data.data.id;
				$goshop.attr("shopId",data.data.shopId);
				if(data.data.detailImgs){
					var detailImgsArr = new Array();  
					var detailImgsList = data.data.detailImgs;
					detailImgsArr = detailImgsList.split(',');
					for(var i=0;i<detailImgsArr.length;i++){
						$detailImgs.append('<img src="'+detailImgsArr[i]+'"/>');
					}
				}
				//是否可购买（0：不可购买、1：可购买）
				if(data.data.extras.buyEnable){
					config.buyEnable = data.data.extras.buyEnable;
				}
				
			}
		}
	});
	
	//去店铺
	$goshop.click(function(){
		config.shopId = $(this).attr("shopId");
		window.location.href="/weixin/dianpu.html?openid="+config.openid+"&uuid="+config.uuid+"&shopId="+config.shopId;
	});
	
	//数量加减
	$(".changenum").blur(function(){
		var _this = $(this);
        if(_this.val() > 1){
        	_this.prev().css('color','#333');
			_this.prev().removeAttr('disabled');
        }
    });
    //减
    reduce();
    function reduce(){
    	$('.reduce').click(function(){
    		console.log('--');
    		var _this = $(this);
    		var val = _this.next().val();
    		val--;
    		if(val >= 1){
				_this.next().val(val);
    		}
    		if(val == 1){
    			_this.css('color','#ccc');
				_this.attr('disabled','disabled');
    		}
		});
    }
	//加
	increase();
	function increase(){
		$('.increase').click(function(){
			console.log('++');
			var _this = $(this);
			_this.prev().prev().css('color','#333');
			var val = _this.prev().val();
			val++;
			_this.prev().val(val);
		});
	}
	
	//加入购物车
	$addGouwuche.click(function(){
		if(config.buyEnable == 0){
			$tipContent.text('该商品仅能购买一次！');
			$('#js-tipCon').css('display','block');
			$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
		}else{
			//添加购物车(uuid=78a6771771f19b951017e100cc6cf1b6&goodsId=1)
			$.ajax({
			    type: "POST",
			    url: login,
			    data:{"unionId":config.unionId,"openId":config.openid},
			    dataType:"json",
			    async:false,
			    success: function(data){
			    	if(data.code == 0){
						$.ajax({
							type: "POST",
						    url: useraddGoods,
						    dataType:"json",
						    data:{"uuid":config.uuid,"goodsId":config.goodId,"amount":"1"},
						    async:false,
							success:function(data){
								if(data.code == 0){
									$tipContent.text('添加购物车成功！');
									$('#js-tipCon').css('display','block');
									$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
								}else{
									$tipContent.text(data.msg);
									$('#js-tipCon').css('display','block');
									$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
								}
							}
						});
			    	}else if(data.code == 104){
			    		window.location.href = "/weixin/bangdingPhone.html?openid="+config.openid+"&goodId="+config.goodId+"&loginReturn=3&isInviteCode="+config.isInviteCode;
			    	}else{
			    		$tipContent.text(data.msg);
						$('#js-tipCon').css('display','block');
						$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
			    	}
			    }
			});
		}
		
	});
	
	//去订单详情页面（立即购买）
	$pay.click(function(){
		//批量保存商品useraddMultiGoods
		if(config.buyEnable == 0){
			$tipContent.text('该商品仅能购买一次！');
			$('#js-tipCon').css('display','block');
			$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
		}else{
			$.ajax({
			    type: "POST",
			    url: login,
			    data:{"unionId":config.unionId,"openId":config.openid},
			    dataType:"json",
			    async:false,
			    success: function(data){
			    	if(data.code == 0){
						config.itemIds = config.goodId+",1";
						$.ajax({
				        type: "POST",
					        url: useraddMultiGoods,
					        data:{"uuid":config.uuid,"items":config.itemIds},
					        dataType:"json",
					        async:false,
					        success: function(data){
					        	if(data.code == 0){
					        					window.location.href="/weixin/dingdanqueren.html?openid="+config.openid+"&uuid="+config.uuid+"&itemIds="+config.goodId+"&isInviteCode="+config.isInviteCode;
					        	}else{
					        		$tipContent.text(data.msg);
									$('#js-tipCon').css('display','block');
									$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
					        	}          
					        }
					    });
			    	}else if(data.code == 104){
			    		window.location.href = "/weixin/bangdingPhone.html?openid="+config.openid+"&goodId="+config.goodId+"&loginReturn=3&isInviteCode="+config.isInviteCode;
			    	}else{
			    		$tipContent.text(data.msg);
						$('#js-tipCon').css('display','block');
						$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
			    	}
			    }
			});
		}
	});
	
});
