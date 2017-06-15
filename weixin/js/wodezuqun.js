$(function(){
	var $coin = $('#js-coin'),
		$headImg = $('#js-headImg'),
		$nickname = $('#js-nickname'),
		$wodezuqunlist = $('#js-p-wodezuqun-list'),
		$triberename = $('#js-triberename'),
		$tipContent = $('#js-tipContent'),
		$newName = $('#js-newName'),
		$newNameTrue = $('#js-newNameTrue'),
		$wodezuqunchangeName = $('#js-p-wodezuqun-changeName');
	
	var config = {};
	//share
	share('24','','','');
	//关闭弹框
	hideTip();
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	$.ajax({
		type: "POST",
	    url: tribeinfo,
	    dataType:"json",
	    data:{"uuid":config.uuid},
	    async:false,
		success:function(data){
			if(data.code == 0){
//				header
				$coin.text(data.data.tribe.coin);
				$headImg.attr('src',data.data.tribe.headImg);
				$nickname.text(data.data.tribe.nickname);
//				族群成员列表
				for(var i=0;i<data.data.members.length;i++){
					$wodezuqunlist.append('<div class="list"><div class="touxiang"><img src="'+data.data.members[i].headImg+'" alt="" /></div><div class="con"><p class="top"><span class="name">'+data.data.members[i].nickname+'</span><span class="time">'+data.data.members[i].joinTime+'</span></p><p class="id">ID：'+data.data.members[i].id+'</p></div></div>');
				}
			}
		}
	});
	
	$triberename.click(function(){
		$wodezuqunchangeName.show();
	});
	$newNameTrue.click(function(){
		config.newName = $newName.val();
		$.ajax({
			type: "POST",
		    url: triberename,
		    dataType:"json",
		    data:{"uuid":config.uuid,"newName":config.newName},
		    async:false,
			success:function(data){
				if(data.code == 0){
					$wodezuqunchangeName.hide();
					$nickname.text(config.newName);
				}else{
					$tipContent.text(data.msg);
					showTip();
				}
			}
		});
	});
	
})
