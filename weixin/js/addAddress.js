$(function(){
	var $choseAddress = $('#js-choseAddress'),
		$area = $('#js-area'),
		$save = $('#js-save'),
		$userName = $('#js-userName'),
		$mobile = $('#js-mobile'),
		$address = $('#js-address'),
		$tipContent = $('#js-tipContent'),
		$isDefault = $('#js-isDefault');
	
	var config = {};
	
	//share
	share('1','','','');
	//关闭弹框
	hideTip();
	//是否是更新地址
	config.isUpdata = getUrlParam('isUpdata');
	config.upid = getUrlParam('upid');
	config.page = getUrlParam('page');
	config.isInviteCode = getUrlParam('isInviteCode');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	if(config.isUpdata == 1){
		//获取用户详细信息
		$.ajax({
		    type: "POST",
		    url: addressdetail,
		    data:{"uuid":config.uuid,"openId":config.openid,"id":config.upid},
		    dataType:"json",
		    async:false,
		    success: function(data){
		    	if(data.code == 0){
		    		$userName.val(data.data.consigner);
		    		$mobile.val(data.data.mobile);
		    		$area.val(data.data.areaName);
		    		$address.val(data.data.address);
		    		config.areaId = data.data.areaId;
		    		config.postCode = data.data.postCode;
		    		config.isDefault = data.data.isDefault;
		    		if(config.isDefault == 1){
		    			$('#js-isDefault labal').addClass('isDefaultHover');
		    		}
		    	}
		    }
		});
		
		//save
		$save.click(function(){
			config.userName = $userName.val();
			config.mobile = $mobile.val();
			config.area = $area.val();
			config.address = $address.val();
			if(config.userName && config.mobile && config.area && config.address){
				//更新用户地址(uuid=100000)
				$.ajax({
				    type: "POST",
				    url: addressupdate,
				    data:{"uuid":config.uuid,"openId":config.openid,"id":config.upid,"areaId":config.areaId,"areaName":config.area,"address":config.address,"consigner":config.userName,"mobile":config.mobile,"isDefault":config.isDefault,"postCode":config.postCode},
				    dataType:"json",
				    async:false,
				    success: function(data){
				    	if(data.code == 0){
				    							window.location.href="/weixin/address.html?openid="+config.openid+"&uuid="+config.uuid;
				    	}
				    }
				});
			}else if(!config.userName){
				$tipContent.text('请输入收货人姓名！');
				showTip();
			}else if(!config.mobile){
				$tipContent.text('请输入收货人手机号！');
				showTip();
			}else if(!config.area){
				$tipContent.text('请选择所在地区！');
				showTip();
			}else if(!config.address){
				$tipContent.text('请输入详细收货地址！');
				showTip();
			}
		});
	}
	
	$choseAddress.css('height',window.screen.height);
	//oneLevel(parentId=100000)
	oneLevel();
	function oneLevel(){
		$.ajax({
		    type: "POST",
		    url: arealist,
		    data:{"parentId":100000},
		    dataType:"json",
		    async:false,
		    success: function(data){
		    	if(data.code == 0){
		    		for(var i=0;i<data.data.length;i++){
		    			$choseAddress.append('<p areaId="'+data.data[i].id+'" postCode="'+data.data[i].postCode+'" fullname="'+data.data[i].fullname+'">'+data.data[i].name+'</p>');
					}
		    	}
		    	twoLevel();
		    }
		});
	}
	//twoLevel
	function twoLevel(){
		$('#js-choseAddress p').each(function(){
			var _this = $(this);
			var oneLevelId = _this.attr('areaId');
			_this.click(function(){
				config.area = _this.attr('fullname');
				config.areaVal = _this.text()+" ";
				config.postCode = _this.attr('postcode');
				config.areaid = _this.attr('areaid');
				//地区列表(parentId=100000)
				$.ajax({
				    type: "POST",
				    url: arealist,
				    data:{"parentId":oneLevelId},
				    dataType:"json",
				    async:false,
				    success: function(data){
				    	if(data.code == 0){
				    		if(data.data.length > 0){
				    			$choseAddress.empty();
					    		for(var i=0;i<data.data.length;i++){
					    			$choseAddress.append('<p areaId="'+data.data[i].id+'" postCode="'+data.data[i].postCode+'" fullname="'+data.data[i].fullname+'">'+data.data[i].name+'</p>');
								}
				    		}else{
				    			$choseAddress.hide();
				    			$area.val(config.areaVal);
				    		}
				    		threeLevel();
				    	}
				    }
				});
			});
		});
	}
	//threeLevel
	function threeLevel(){
		$('#js-choseAddress p').each(function(){
			var _this = $(this);
			var twoLevelId = _this.attr('areaId');
			_this.click(function(){
				config.area = _this.attr('fullname');
				config.areaVal += _this.text()+" ";
				config.postCode = _this.attr('postcode');
				config.areaid = _this.attr('areaid');
				//地区列表(parentId=100000)
				$.ajax({
				    type: "POST",
				    url: arealist,
				    data:{"parentId":twoLevelId},
				    dataType:"json",
				    async:false,
				    success: function(data){
				    	if(data.code == 0){
				    		if(data.data.length > 0){
				    			$choseAddress.empty();
					    		for(var i=0;i<data.data.length;i++){
					    			$choseAddress.append('<p areaId="'+data.data[i].id+'" postCode="'+data.data[i].postCode+'" fullname="'+data.data[i].fullname+'">'+data.data[i].name+'</p>');
								}
				    		}else{
				    			$choseAddress.hide();
				    			$area.val(config.areaVal);
				    		}
				    	}
				    	fourLevel();
				    }
				});
			});
		});
	}
	//fourLevel
	function fourLevel(){
		$('#js-choseAddress p').each(function(){
			var _this = $(this);
			var threeLevelId = _this.attr('areaId');
			_this.click(function(){
				config.area = _this.attr('fullname');
				config.areaVal += _this.text()+" ";
				config.postCode = _this.attr('postcode');
				config.areaid = _this.attr('areaid');
				//地区列表(parentId=100000)
				$.ajax({
				    type: "POST",
				    url: arealist,
				    data:{"parentId":threeLevelId},
				    dataType:"json",
				    async:false,
				    success: function(data){
				    	if(data.code == 0){
				    		if(data.data.length > 0){
				    			$choseAddress.empty();
					    		for(var i=0;i<data.data.length;i++){
					    			$choseAddress.append('<p areaId="'+data.data[i].id+'" postCode="'+data.data[i].postCode+'" fullname="'+data.data[i].fullname+'">'+data.data[i].name+'</p>');
								}
				    		}else{
				    			$choseAddress.hide();
				    			$area.val(config.areaVal);
				    		}
				    	}
				    }
				});
			});
		});
	}
	//选择地区
	$area.click(function(){
		if($(this).val() != ''){
			$choseAddress.empty();
			$area.val("");
			oneLevel();
			$choseAddress.show();
		}else{
			$choseAddress.show();
		}
	});
	
	//是否设置为默认地址
	config.isDefault = '0';
	$('#js-isDefault labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('isDefaultHover')){
			_this.removeClass('isDefaultHover');
			config.isDefault = '0';
		}else{
			_this.addClass('isDefaultHover');
			config.isDefault = '1';
		}
	});
	
	//save
	if(!config.isUpdata){
		$save.click(function(){
			config.userName = $userName.val();
			config.mobile = $mobile.val();
			config.area = $area.val();
			config.address = $address.val();
			if(config.userName && config.mobile && config.area && config.address){
				$.ajax({
				    type: "POST",
				    url: addresssave,
				    data:{"areaId":config.areaid,"areaName":config.areaVal,"address":config.address,"mobile":config.mobile,"postCode":config.postCode,'consigner':config.userName,'isDefault':config.isDefault,"uuid":config.uuid,"openId":config.openid},
				    dataType:"json",
				    async:false,
				    success: function(data){
				    	if(data.code == 0){
				    		$tipContent.text('保存成功！');
				    		showTip();
				    		//config.page  0:订单确认
				    		if(config.page == 0){
				    			config.goodId = getUrlParam('itemIds');
				    				window.location.href="/weixin/dingdanqueren.html?openid="+config.openid+"&uuid="+config.uuid+"&itemIds="+config.goodId+"&isInviteCode="+config.isInviteCode;
				    			
				    		}
				    	}
				    }
				});
			}else if(!config.userName){
				$tipContent.text('请输入收货人姓名！');
				showTip();
			}else if(!config.mobile){
				$tipContent.text('请输入收货人手机号！');
				showTip();
			}else if(!config.area){
				$tipContent.text('请选择所在地区！');
				showTip();
			}else if(!config.address){
				$tipContent.text('请输入详细收货地址！');
				showTip();
			}
		});
	};
	
});
