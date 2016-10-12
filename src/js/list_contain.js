define(['jquery','template'],function($,tpl){
	//切换渲染页面
	$(".list_ul").on("click","li",function(){
		$(this).addClass("list_bg").siblings().removeClass("list_bg");
	})
	$("#li_1").on("click",function(){
		fun();
	})
	$("#li_2").on("click",function(){
		fun1();
	})
	function fun(){
		$.ajax({
			url:"../data/hotelDetail.json",
			dataType:"json",
			success:function(e){
				var str="";
				str+="<li>酒店名称:"+e.result["name"]+"</li><li>星级:"+e.result["star"]+"</li><li>地址:"+e.result["addr"]+"</li><li>电话:"+e.result["tel"]+"</li>";
			
				$(".list_ol").html(str);
			}
			
		})
	}
	function fun1(){
		$.ajax({
			url:"../data/hotelDetail.json",
			dataType:"json",
			success:function(e){
				var str="";
				str+="<li>酒店介绍:"+e.result["desc"]+"</li><li>功能:"+e.result["facilities"]+"</li>";
			
				$(".list_ol").html(str);
			}
			
		})
	}
	$.ajax({
		url:"../data/hotelDetail.json",
		dataType:"json",
		success:function(e){
			var str="";
			var o=e.result.room_types;
			for(var i in o){
				var arr=o[i].goods;
				for(var j in arr){
					var guarantee=arr[j].guarantee;
					if(arr[j]["room_state"]==1){
						order="预定";
						
					}else if(arr[j]["room_state"]==0){
						order="已满";
					}

				}
				str+="<div>"+o[i].name+"<b>￥"+guarantee+"</b><span class = 'list_span'>"+order+"</span></div>";	
			}
			$(".list_yuding").html(str);

			$(".list_span").on("click",function(){
				if($(this).text()=="预定"){
					$(".dalist_bg").animate({"top":"0px"},300);
					$(".dalist_box").animate({"top":"44.5%"},300);
				}else if($(this).text()=="已满"){
					$(this).css({"border":"1px solid #ccc","color":"#ccc"})
				}
			})
		}
	})
	
	//下拉页面
	$(".list_btn").on("click",function(){
		if ($(this).text()=="展开剩余部分") {
			 $(this).text("收起");
			$(".list_yuding").animate({"height":"250px"},300);
		}else{
			 $(this).text("展开剩余部分");
			$(".list_yuding").animate({"height":"100px"},300);			 

		}
	})
	$(".dalist_X").on("click",function(){
		$(".dalist_bg").animate({"top":"100%"},300);
		$(".dalist_box").animate({"top":"144.5%"},300);
	})
	var hotelTpl = 
			"<%for(var i = 0; i<hotel_list.length; i++) { %>"+	
					"<div class='hotel_rows'>"+
						"<a href='#'>"+
							"<dl>"+
								"<dt>"+
									"<img src='../<%= hotel_list[i].image %>' alt=''>"+
								"</dt>"+
								"<dd>"+
									"<h2><%= hotel_list[i].name %></h2>"+
									"<ul>"+
										"<li class='pf'>4.5分</li>"+
										"<li>礼</li>"+
										"<li>促</li>"+
										"<li>返</li>"+
									"</ul><br/>"+
									"<p><%= hotel_list[i].stars %>级<img src='../img/icon-wifi.png'><img src='../img/icon-park.png'></p>"+
									"<address><%= hotel_list[i].addr %><span><%= hotel_list[i].distance %>km</span></address>"+
								"</dd>"+
							"</dl>"+
							"<p class='hotel_money'>￥<%= hotel_list[i].low_price %><b>起</b></p>"+
						"</a>"+
					"</div>"+
			"<% } %>";
	var render = tpl.compile(hotelTpl);
	$.when($.ajax('../data/hotel.json'))
	.then(function(data){
		//console.log(data.result);
		var html = render(data.result);
		$(".list_manu").html(html);
	}),function(err){
		console.log(err);
	};
	$(".list_btn1").on("click",function(){
		if ($(this).text()=="展开剩余部分") {
			 $(this).text("收起");
			$(".list_manu").animate({"height":"600px"},300);
		}else{
			 $(this).text("展开剩余部分");
			$(".list_manu").animate({"height":"200px"},300);			 

		}
	})
	$('.dalist_btn').on("click",function(){
         location.href= "dalist.html";
    })
})
