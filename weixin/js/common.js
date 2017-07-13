//获取url带的参数值
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};
var configData = {};
configData.code = getUrlParam('code');
//通过提交截取到的code值到后台，获取用户的openid接口(OpenId)；
if(null!=configData.code){
	$.ajax({
	    type: "POST",
	    url: oa,
	    dataType:"json",
	    data:{"code":configData.code,"platform":"1"},
	    async:false,
	    success: function(data){
			configData.openid = data.data.openId;
			configData.unionId = data.data.unionId;
			if(configData.openid == undefined){
			    config();
			}else{
				Login();
			}
	    }
	});
}
//配置微信config
function config(){
	configData.timestamptest = null;
    configData.nonceStrtest = null;
    configData.signaturetest = null;
    configData.appidtest = null;
	$.ajax({
        type: "POST",
        url: sign,
        data:{"url":location.href},
        dataType:"json",
        async:false,
        success: function(data){
        	if(data.code == 0){
        		configData.timestamptest = data.data.timestamp;
            	configData.nonceStrtest = data.data.nonceStr;
            	configData.signaturetest = data.data.signature;
            	configData.appidtest = data.data.appId;
        	}else{
        		return false;
        	}          
        }
    });
	wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: configData.appidtest, // 必填，公众号的唯一标识
        timestamp: configData.timestamptest, // 必填，生成签名的时间戳
        nonceStr: configData.nonceStrtest, // 必填，生成签名的随机串
        signature: configData.signaturetest,// 必填，签名，见附录1
        jsApiList: ['openLocation','getLocation','scanQRCode','chooseWXPay']
    });
}
//login
function Login(){
	$.ajax({
	    type: "POST",
	    url: login,
	    data:{"unionId":configData.unionId,"platform":"1"},
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.code == 0){
	    		configData.uuid = data.data.uuid;
	    		configData.headImg = data.data.headImg;
	    		configData.coin = data.data.coin;
	    		configData.point = data.data.point;
	    		configData.nickname = data.data.nickname;
	    		if(data.data.extras.tribeCode){
	    			configData.ID = data.data.extras.tribeCode;
	    		}else{
	    			configData.ID = '马上获取';
	    		}
	    		configData.tribeCode = data.data.extras.tribeCode;
	    	}
	    }
	});
}
//追加请求头
$(document).ajaxSend(function(evt, request, settings) {
	request.setRequestHeader("openId",configData.openid);
	request.setRequestHeader("uuid",configData.uuid);
});

function share(page,uuid,goodsId,shopId){
	$.ajax({
        type: "POST",
        url: wxshare,
        data:{"action":page,"uuid":uuid,"goodsId":goodsId,"shopId":shopId},
        dataType:"json",
        async:false,
        success: function(data){
        	if(data.code == 0){
        		configData.title = data.data.title;
        		configData.desc = data.data.desc;
        		configData.imgUrl = data.data.imgUrl;
        		configData.link = data.data.link;
        		sharePage(configData.title,configData.desc,configData.imgUrl,configData.link);
        	}else{
        		return false;
        	}          
        }
    });
}

//显示提示框
function showTip(){
	$('#js-tipCon').show();
	$('#js-tip').css("margin-top",(window.screen.height/3)+"px");
}
//关闭提示框
function hideTip(){
	$('#js-tipBtn').click(function(){
		$('#js-tipCon').hide();
	});
}
