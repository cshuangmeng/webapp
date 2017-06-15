var addresses = "https://api.tangseng.shop/shop/";//http://demo.cwjia.cn/pet/
var getWXConfig = addresses+"wx/sign";
var dqUrl = location.href;
//二次分享
function sharePage(title,desc,imgUrl,link){
	var linkUrl = link != undefined ? link : dqUrl;//没有设置分享页面链接的时候，直接分享当前页面
	$.ajax({
		url:getWXConfig,
		type:"post",
		data:{"url":dqUrl},
		dataType:"json",
		success:function(data){
			wx.config({
				debug : false,
				appId : data.data.appId, // 必填，appID公众号的唯一标识
				timestamp : data.data.timestamp, // 必填，生成签名的时间戳
				nonceStr : data.data.nonceStr, // 必填，生成签名的随机串
				signature :data.data.signature,// 必填，签名，见附录1
				jsApiList : ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ']
			});	
			wx.ready(function() {
				var shareData = {
					title: title, // 分享标题
					desc: desc,
					link: linkUrl, 
					imgUrl: imgUrl, // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					success: function () { 
						
					},
					cancel: function () { 
	
					}
			    }
				wx.onMenuShareAppMessage(shareData);
				wx.onMenuShareTimeline(shareData);
				wx.onMenuShareQQ(shareData);
			});		
		}
	});
	
	
	
}
   