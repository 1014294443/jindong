/*
* @Author: Administrator
* @Date:   2017-06-22 14:59:08
* @Last Modified by:   Administrator
* @Last Modified time: 2017-06-23 11:40:10
*/

'use strict';
window.onload = function(){
	//轮播效果
	banner();
	//搜索栏变色
	search();
	//倒计时
	var jsq = setInterval(time,500)
}

/*移动端轮播图*/
	function banner(){
		/*1.自动滚动起来(定时器+过渡transition+位移 transform:translate)*/
		//1)先获取.jd_banner
		var banner = document.querySelector(".jd_banner");
		//2)在获取banner的 可见 宽度
		var w = banner.offsetWidth;
		//3)再获取banner下的第一个ul 保存在imageBox中
		var imageBox = banner.children[0];
		//4)在获取banner下的第二个ul 保存在pointBox中
		var pointBox = banner.children[1];
		//5)再获取pointBox下的所有li 保存在 points 中	
		var points = pointBox.querySelectorAll("li");

		/*添加过渡方法*/
		var addTransition = function(){
			imageBox.style.transition = "all 0.2s";
			imageBox.style.webkitTransition = "all 0.2s";//兼容
		}
		/*删除过渡方法*/
		var removeTransition = function(){
			imageBox.style.transition = "none";
			imageBox.style.webkitTransition = "none";
		}
		/*添加x轴方向位移方法*/ 
		var setTranslate = function(translateX){
			imageBox.style.transform = "translateX("+translateX+"px)";
			imageBox.style.webkitTransform = "translateX("+translateX+"px)";
		}
		/*添加定时器 自动滚动起来*/
		var index = 1 ;//记录滚动次数
		//定义定时器
		var timer = setInterval(function(){
			//滚动次数+1
			index++
			/*调用之前顶一个过渡和位移方法*/ 
			addTransition();//过渡
			setTranslate(-index*w);//位移
		},3000)
		//绑定一个过渡结束事件
		itcast.transitionEnd(imageBox,function(){
			if(index>=9){
				index=1;
				//删除过渡  为了实现无缝
				removeTransition();
				//调用位移方法
				setTranslate(-index*w);
			}else if(index<=0){
				index=8;
				//删除过渡 为了实现无缝
				removeTransition();
				//调用位移方法
				setTranslate(-index*w);
			}
			setPoint();
		})
		/*点随之滚动起来(改变当前元素li的样式)*/
		function setPoint(){
			//把所有的点的样式清掉
			for(var i = 0;i<points.length;i++){
				points[i].className = "";
			}
			points[index-1].className = "now";
		}
		/*图片滑动事件*/
		var startX = 0;//当前触摸时 x轴坐标
		var moveX = 0;//手移动时,X轴 实时坐标
		var distanceX = 0;//moveX - startX 的值  滑动距离
		var ismove = false;//表示是否正在移动

		imageBox.addEventListener("touchstart",start);
		imageBox.addEventListener("touchmove",move);
		imageBox.addEventListener("touchend",end);
		function start(e){
			//关闭计时器
			clearInterval(timer);
			//获得当前触摸的 x轴的坐标
			startX = e.touches[0].clientX
		};
		function move(e){
			//正在移动改为true
			ismove = true;
			//移动时 X轴的实时坐标
			moveX = e.touches[0].clientX;
			// 获取滑动距离
			distanceX = moveX - startX;//右滑动 正  左滑动 负
			/*要去计算 在滑动时图片滚动的实际距离 currX*/
			var currX = -index*w+distanceX
			/*删除过渡事件*/
			removeTransition();
			/*调用位移事件*/
			setTranslate(currX);
		};
		function end(e){
			/*
				Math.abs();获取绝对值
				当滑动距离超过1/3的屏幕宽度 就换到下一张或上一张
			 */
			if(ismove && Math.abs(distanceX) > w/3){
				//如果移动的距离是正 - 向右
				if(distanceX > 0){
					index--;//向右滑动 上一张
				}else{
					index++;//向左滑动 下一张
				}
				console.log(index)
				addTransition();//添加过渡事件
				setTranslate(-index*w);
			}else{//滑动距离小于三分之一 ,图片被吸附回去
				addTransition();
				setTranslate(-index*w)
			}
			//重置初始变量
			startX = 0;
			moveX = 0;
			distanceX = 0;
			ismove = false;
			//重启计时器
			clearInterval(timer);
			timer = setInterval(function(){
				index++;
				addTransition();
				setTranslate(-index*w);

			}, 3000)

		}

	}

/*搜索区域颜色变化*/
	function search(){
		/*
		1.透明度随着页面的滚动 逐渐变不透明
		2.当滚动的距离超过轮播图的高度时,透明度就保持不变了
		*/ 
		//获取.jd_header_box 保存在 searchBox
		var searchBox = document.querySelector(".jd_header_box");
		//获取.jd_banner的可见高度 保存在h 中
		var h = document.querySelector(".jd_banner").offsetHeight;
		/*监听window的滚动事件*/
		window.onscroll = function(){
			/*不断地获取 scrollTop  向上滚动的距离*/
			var top = document.body.scrollTop;
			//设置透明度
			var opacity = 0
			//如果滚动的距离 top<h
			if(top<h){
				//透明度随着页面的滚动降低
				opacity = top/h
			}else{
				//表示已经滚出轮播图高度
				opacity = 0.9;
			}
			//把opacity设置上去
			searchBox.style.backgroundColor = "rgba(255,0,0,"+opacity+")";
		}
	}
/*秒杀倒计时*/
	function time(){
		var timeBox = document.querySelector(".sk_time");		
			var time1 =parseInt((new Date("2017/6/23 21:00:00").getTime()- new Date().getTime())/1000);
			var H = parseInt(time1/3600);
			var M = parseInt((time1/60)%60);
			var S = time1%60;
			var span = timeBox.querySelectorAll("span");
			span[0].innerHTML = parseInt(H/10);
			span[1].innerHTML = H%10;
			span[3].innerHTML = parseInt(M/10);
			span[4].innerHTML = M%10;
			span[6].innerHTML = parseInt(S/10);
			span[7].innerHTML = S%10;
	//----老师版本
		//设置需要倒计时的时间
		// var time = 2*60*60
		// //初始化定时器
		// var timer = null;
		// //	找到 .sk_time 下的所有span
		// var spans = document.querySelectorAll(".sk_time span");
		// //设置定时器
		// timer = setInterval(function(){
		// 	if(time <=0){
		// 		clearInterval(timer);
		// 		return false;
		// 	}
		// 	time--;
		// 	//体力活
		// 	var h = parseInt(time/3600)
		// 	var m = parseInt(time%3600/60)
		// 	var s = parseInt(time%60)
		// 	span[0].innerHTML = parseInt(time/3600)
		// 	span[1].innerHTML = H%10;

		// 	span[3].innerHTML = parseInt(M/10);
		// 	span[4].innerHTML = M%10;

		// 	span[6].innerHTML = parseInt(S/10);
		// 	span[7].innerHTML = S%10;
		// },1000)
	}