//翻面控制
function turn(elem){
	var cls = elem.className;
	var n = elem.id.split('_')[1];

	if( !/photo_center/.test(cls) ){
		return csort(n);
	}

	if(/photo_front/.test(cls)){
		cls=cls.replace(/photo_front/,'photo_back');
		g('#nav_'+n).className+=' i_back ';
	}else{
		cls=cls.replace(/photo_back/,'photo_front');
		g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
	}
	return elem.className=cls;
}

//通用函数，不论是查询id还是classname都可通过该函数返回结果
function g(selector){
	var method = selector.substr(0,1)=='.'?'getElementsByClassName':'getElementById';
	return document[method](selector.substr(1));
}


//输出所有的海报
var data = data;
function addPhotos(){
	var template = g('#wrap').innerHTML;
	var html=[];
	var nav = [];	//下方导航条

	for(var s in data){
		var _html = template.replace('{{index}}',s)
		.replace('{{img}}',data[s].img)
		.replace('{{caption}}',data[s].caption)
		.replace('{{desc}}',data[s].desc);
		html.push(_html);

		nav.push('<span id="nav_'+s+'" class="i" onclick="turn(g(\'#photo_'+s+'\') )"></span>');
	}
	html.push('<div class="nav">'+nav.join('')+'</div>');
	g('#wrap').innerHTML = html.join('');
	csort(random([0,data.length-1]));
}
addPhotos();


//排序海报，选取某一个作为当前需要显示的海报，即居中显示
function csort(n){
	var _photo = g('.photo');		//js中下划线表示临时变量
	//这个_photo并不是一个真正的数组，只有_photo.length但是没有_photo.sort,所以应该将其转换为真正的数组
	var photos = [];
	for(var t=0; t < _photo.length; t++){			//去掉所有photo中的photo_center样式
		_photo[t].className = _photo[t].className.replace(/\s*photo_center\s*/,' ');
		_photo[t].className = _photo[t].className.replace(/\s*photo_front\s*/,' ');
		_photo[t].className = _photo[t].className.replace(/\s*photo_back\s*/,' ');
		_photo[t].style.left= '';
		_photo[t].style.top = '';
		_photo[t].className+=' photo_front ';
		_photo[t].style['transform']=_photo[t].style['-webkit-transform'] = 'rotate(360deg) scale(1.3)';
		photos.push( _photo[t] );	//这个photo才是一个真正的数组
	}
	

	//将被选中的photo设置photo_center样式，其余的Photo 设置分成左右两块区域
	var photo_center = g('#photo_'+n);
	photo_center.className +=' photo_center ';

	//首先需要减去被居中的元素，有两种方法
	//1、使用delete，但是这样会使数组中产生一个undefined的元素
	//2、使用splice(index,num)，这样会直接将该元素从数组中删除且返回该元素（以数组的形式）
	//使用第二种方法更方便

	photo_center = photos.splice(n,1)[0];	//虽然等于并没有什么意义

	//将海报分为左右两个部分
	var photos_left = photos.splice(0,Math.ceil(photos.length/2));
	var photos_right = photos;	//photos_left切走了一半，剩下的就都是给右半部分了

	for(var s in photos_left){
		var photo = photos_left[s];

		var ranges = range();

		//位置
		photo.style.left = random(ranges.left.x) + 'px';
		photo.style.top = random(ranges.left.y) + 'px';

		//旋转角度
		photo.style['transform'] = photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
	}	
	for(var s in photos_right){
		var photo = photos_right[s];

		var ranges = range();
		photo.style.left = random(ranges.right.x) + 'px';
		photo.style.top = random(ranges.right.y) + 'px';

		photo.style['transform'] =photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';
	}

	//控制按钮处理，让当前选中的按钮的nav变大
	var navs = g('.i');
	for(var s = 0; s < navs.length; s++){
		navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
		navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
	}
	g('#nav_'+n).className+=' i_current ';
}

//随机生成一个值,支持一个取值范围，参数为( [min ,max] ),使得返回的值在这之间
function random(range){
	var max = Math.max(range[0],range[1]);
	var min = Math.min(range[0],range[1]);
	var diff = max-min;	//差值
	var number = Math.ceil(Math.random()*diff + min);
	return number;
}

//计算左右分区的范围,返回一个对象range{left:{x:[min , max], y:[]} , right:{}}
function range(){
	var range = {left:{x:[], y:[]} , right:{x:[], y:[]}};

	var wrap = {
		w:g('#wrap').clientWidth,
		h:g('#wrap').clientHeight
	}
	var photo = {
		w:g('.photo')[0].clientWidth,
		h:g('.photo')[0].clientHeight
	}
	range.wrap = wrap;
	range.photo = photo;

	range.left.x = [0-photo.w , wrap.w/2 - photo.w];
	range.left.y = [0-photo.h , wrap.h];

	range.right.x = [wrap.w/2 + photo.w/2 , wrap.w ];
	range.right.y = [0-photo.h , wrap.h];
	
	return range;
}

