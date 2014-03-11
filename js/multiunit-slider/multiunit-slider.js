/*-------------------------------------------*/
/*	Multi unit slider
/*	by Vektor,Inc.
/*-------------------------------------------*/
jQuery(document).ready(function(){

// 【０】 初期設定
/*-------------------------------------------*/
	// １画面で表示する数
	var itemInSetNumber = 4;
	// スライド移動間隔(1/1000秒)
	var intervalmicroSecond = 4000;
	// ユニット数を取得
	var itemUnitNumber = jQuery('.slideItemUnit').length;
	// スライドする画面数(切り上げ)
	var slideNumber = Math.ceil(itemUnitNumber/itemInSetNumber);
	// 位置識別用のカウンター(0で1画面目)
	var count = 0;
	// ナビマークの高さ(px)
	var navPositionHeightPlus = 40;

	// ★スライドエリアの横幅
	var innerWidth;
	// ★ユニットセットの横幅
	var itemUnitSetWidth;

	function slideSetting(){
		/*-------------------------------------------*/
		// 【１】 各パラメーター取得・計算
		/*-------------------------------------------*/
		// スライドエリアの横幅
		innerWidth = jQuery('.innerBox').width();
		// ユニットセットの横幅
		itemUnitSetWidth = innerWidth;
		/*-------------------------------------------*/
		// 【２】サイズを設定する
		/*-------------------------------------------*/
		// ユニットセットそれぞれに横幅を指定（数が少ない時に詰められるのを防止）
		jQuery('.slideItemSet').each(function(i){
			jQuery(this).css({"width": itemUnitSetWidth });
		});
		// スライド部分全体の横幅（スライド画面数*スライドエリアの横幅）を指定（指定しないと改行されてしまう為）
		jQuery('.slideItemSetOuter').css({"width": itemUnitSetWidth * (slideNumber+1) + "px"});

		/*-------------------------------------------*/
		// 【３】オブジェクトをセットする
		// 最後の画面の次に最初の画面が出てくるように複製して繋げる
		/*-------------------------------------------*/
		// リサイズの場合は複製されたアイテムを一度削除
		jQuery('.copiedSlideSet').remove('.copiedSlideSet');
		// 1画面目のアイテムセットのHTMLを取得
		var slideItemSet1Html = jQuery('.slideItemSet:first').html();
		// // ユニットセットの最後に最初のアイテムセットの複製を追加
		jQuery('.slideItemSet:last').after('<ul class="slideItemSet copiedSlideSet" style="width:' + itemUnitSetWidth + 'px">' + slideItemSet1Html + '</ul>');
		jQuery('.slideItemSetOuter').css({"display": "block"});

	} // slideSetting()

	/*-------------------------------------------*/
	// 【４】ナビゲーションをセットする
	/*-------------------------------------------*/
	// 画面数文のリストを作成
	var navItem = '';
	for ( var i=0 ; i<=(slideNumber-1) ; i++){
		navItem += "<li class='nav" + i + "'><a href='#'>" + i + "</a></li>\n";
	}
	var nav = "<ul id='slideNav'>\n"+navItem+"</ul>\n";
	jQuery('#slideItem').after(nav);

	var navPosition = 0;
	// ナビゲーションにアクティブクラスを追加
	function navActive(){
		// アクティブクラスを削除
		jQuery('#slideNav li').each(function(){
			jQuery(this).removeClass('navActive');
		});
		// 永久ループにする場合、最後に１つ追加のポジションが存在するため、最後のポジションの場合は0に戻す
		if (count == slideNumber) {
			navPosition = 0;
		} else {
			navPosition = count;
		}
		// アクティブのナビにクラスを追加
		active = '#slideNav li.nav' + navPosition;
		jQuery(active).addClass('navActive');
	}
	// ナビゲーションをクリックされた場合
	jQuery('#slideNav li a').click(function () {
		// 自動再生を一旦停止
		slideStop();
		// ポジション番号を取得して数値に変換
		count = Number(jQuery(this).text());
		// 動かす
  		slideMove();
  		// 自動再生再開
		slideRun();
	});
	function navPositionTopSet(){
		var outerHeight = jQuery('.multiunit-slider').height();
		jQuery('#slideNav').css({"top": outerHeight + navPositionHeightPlus + "px"});
	}
	/*-------------------------------------------*/
	// 【５】スライドを動かす
	/*-------------------------------------------*/
	// モーション
	function slideMove(){
		navActive();
		jQuery('.slideItemSetOuter').stop().animate( { left:'-' + ( (count)*itemUnitSetWidth) + 'px'},{ 
			duration : 800,
			easing : '',
			complete : function(){
				// 最後のスライドだった場合
				if ( count == slideNumber ) {
					count = 0;
					// ユニットセットを元の位置に戻す
					jQuery('.slideItemSetOuter').each(function(i){
						// ユニットのセットに横幅を指定
						jQuery(this).css({"left": 0 });
					});
				} // if ( count == slideNumber )
			} // complete
		}); // animate
	}

	// スライドの初期セットアップ
	var slideAction;
	jQuery('.slideItemSetOuter').css({"left": 0 });
	function slideRun(){
		// 一定間隔で動作
		slideAction = setInterval(function(){
			// カウントを追加
			count ++;
			// スライドアウターを動かす
			slideMove();
			// 画像の読み込みが遅いと高さが正しく取得出来ないので定期的にリロード
			navPositionTopSet();
		},intervalmicroSecond); // setInterval
	} // slideRun
	function slideStop(){
		clearInterval(slideAction);
	}

	slideSetting();
	navActive();
	navPositionTopSet();
	slideRun();

	jQuery(window).resize(function(){
		slideSetting();
		slideStop();
		navActive();
		navPositionTopSet();
		slideRun();
		// console.log("リサイズ" + itemUnitSetWidth);
	});
});