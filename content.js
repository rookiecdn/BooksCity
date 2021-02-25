$(function() {
	//取消自动换页
	$('#myCarousel').carousel({
		interval: null
	});
	//公开课
		var GkK = [
			["第一课:入市之前需要考虑的问题",
			"https://v.youku.com/v_show/id_XMzgzMjE2OTQ4MA==.html?spm=a2h0j.11185381.listitem_page1.5!7~A&&f=51863571", "MF"
			],
			["第二课:技术指标的划分", "https://v.qq.com/x/page/c31078xdgje.html", "MF"],
			["第三课:股价阶段的划分", "https://v.qq.com/x/page/h0747wrckdj.html", "MF"],
			["第四课:技术分析基础知识", "https://v.qq.com/x/page/b092470jkkk.html", "MF"],
			["第五课:K线和均线", "https://v.qq.com/x/page/q304563o9dk.html", "MF"],
			["第六课:跳空缺口的基础知识", "https://v.qq.com/x/page/k3150uuhgnp.html", "MF"],
			["第七课:横盘调整的实战运用", "https://v.qq.com/x/page/q3150scq7bk.html", "MF"],
			["第八课:成交量的实战运用", "https://v.qq.com/x/page/q07730dycii.html", "MF"],
			["第九课:筹码的实战运用", "https://v.qq.com/x/page/v0781l7wld0.html", "MF"],
			["第十课:财务分析的重要性", "https://v.qq.com/x/page/r0769t7d5w9.html", "MF"],
			["第十一课:资产负债表", "https://v.qq.com/x/page/p0769re58gc.html", "MF"],
			["第十二课:利润表", "https://v.qq.com/x/page/q0769eieu65.html", "MF"],
			["第十三课:财报综合分析", "https://v.qq.com/x/page/i07697vo8xf.html", "MF"],
			["第十四课:选股公式如何导入软件", "https://v.qq.com/x/page/d3150axwjav.html", "MF"],
			["第十五课:庄股走势和接盘揭秘", "https://v.qq.com/x/page/y31500bsmbn.html", "MF"],
			["第十六课:2019元旦礼物", "https://v.qq.com/x/page/m3025u2mcb7.html", "MF"],
			["第十七课:20190304中长线案例总结", "https://v.qq.com/x/page/p0882z1xus9.html", "MF"],
			["第十八课:体验课2020.02.29第一期录播", "https://v.qq.com/x/page/l3103qp38yn.html", "MF"]
		];
	// 付费课程：中长线分析方法
	var AnLi = [
		["第一课:庄家观念的养成", "https://v.qq.com/x/page/g31504jf5s6.html", "ST"],
		["第二课:主升浪开启之前共有的特征", "https://v.qq.com/x/page/u0786penho2.html", "ST"],
		["第三课:高级课程实操(干货)", "https://v.qq.com/x/page/m07808c9t9o.html", "ST"],
		["第四课:庄家建仓的深层次特征(上)", "https://v.youku.com/v_show/id_XMzgwMzIwMzk4MA", "FF"],
		["第五课:庄家建仓的深层次特征(中)","https://v.youku.com/v_show/id_XMzgwMzIwNDc5Ng==.html?spm=a2h0j.11185381.listitem_page1.5!5~A&&f=51877240", "FF"],
		["第六课:庄家建仓的深层次特征(下)","https://v.youku.com/v_show/id_XMzgwMzIyMzc4MA==.html?spm=a2h0j.11185381.listitem_page1.5!6~A&&f=51877240", "FF"],
		["第七课:买卖点的把握","https://v.youku.com/v_show/id_XMzgwNTAzMzk0MA==.html?spm=a2h0j.11185381.listitem_page1.5!7~A&&f=51877240", "FF"]
	];
	//付费课程：筹码高级课程
	var CMGJ = [
		["第一课:正确认使筹码", "https://v.qq.com/x/page/p0816aj14kh.html", "ST"],
		["第二课:筹码的稳定性和集中度", "https://v.qq.com/x/page/f0817u6l7mz.html", "ST"],
		["第三课:筹码获利比例", "https://v.qq.com/x/page/b08208uuh3w.html", "ST"],
		["第四课:筹码和成交量的关系", "https://v.qq.com/x/page/y08223omk10.html", "ST"],
		["第五课:强大的数据分析-上",
			"https://v.youku.com/v_show/id_XNDAwMjc4OTA3Mg==.html?spm=a2h0j.11185381.listitem_page1.5!6~A&&f=52006355", "FF"
		],
		["第六课:强大的数据分析-下",
			"https://v.youku.com/v_show/id_XNDAwMjc5MDIxNg==.html?spm=a2h0j.11185381.listitem_page1.5!8~A&&f=52006355", "FF"
		],
		["第七课:筹码结构分析-上",
			"https://v.youku.com/v_show/id_XNDAwMjc5MTMwNA==.html?spm=a2h0j.11185381.listitem_page1.5!7~A&&f=52006355", "FF"
		],
		["第八课:筹码结构分析-下",
			"https://v.youku.com/v_show/id_XNDAwMjc5MjM5Mg==.html?spm=a2h0j.11185381.listitem_page1.5!4~A&&f=52006355", "FF"
		],
		["第九课:公式结合筹码选股",
			"https://v.youku.com/v_show/id_XNDAwMjc5MzIyNA==.html?spm=a2h0j.11185381.listitem_page1.5!3~A&&f=52006355", "FF"
		],
		["第十课:如何判断洗盘和出货",
			"https://v.youku.com/v_show/id_XNDAwMjc5NDA0OA==.html?spm=a2h0j.11185381.listitem_page1.5!5~A&&f=52006355", "FF"
		]
	];
	// 付费课程：成交量高级课程
	var CJLGJ = [
		["第一课:成交量对于市场的意义", "https://v.qq.com/x/page/v08418ezig9.html", "ST"],
		["第二课:暴跌后的庄股机会", "http://v.youku.com/v_show/id_XNDA3NDY0NTI2MA==.html", "FF"],
		["第三课:分时分析量价技巧", "http://v.youku.com/v_show/id_XNDA3NDY0NTg0NA==.html", "FF"],
		["第四课:小白抓涨停深度解析", "http://v.youku.com/v_show/id_XNDA3NDY0NjM0NA==.html", "FF"],
		["第五课:建仓期间量价分析", "http://v.youku.com/v_show/id_XNDA3NDY0Njg0NA==.html", "FF"],
		["第六课:洗盘期间量价分析", "http://v.youku.com/v_show/id_XNDA3NDY0NzMxNg==.html", "FF"],
		["第七课:出货期间量价分析", "http://v.youku.com/v_show/id_XNDA3NDY0Nzg4MA==.html", "FF"],
		["第八课:量能平台实战运用", "http://v.youku.com/v_show/id_XNDA3NDY0ODMwOAs==.html", "FF"],
		["第九课:次量创新高战法解析", "http://v.youku.com/v_show/id_XNDA3NDY0ODcwOA==.html", "FF"],
	];
	// 付费课程：短线高级课程
	var DXGJ = [
		["第一课:熊市中的机会", "https://v.qq.com/x/page/x0702yhi1go.html", "ST"],
		["第二课:超级简单实用的短线分析方法第一讲", "https://v.qq.com/x/page/t0702660prr.html", "ST"],
		["第三课:神奇的盘口语言", "https://v.qq.com/x/page/m09100fnwhs.html", "ST"],
		["第四课:什么是集合竞价", "https://v.qq.com/x/page/c3150d567ya.html", "ST"],
		["第五课:超级简单实用的短线分析方法第二讲", "https://www.bilibili.com/video/av31623041", "ST"],
		["第六课:短线精讲第一讲",
			"https://v.youku.com/v_show/id_XMzgyMTA1ODMwNA==.html?spm=a2h0j.11185381.listitem_page1.5!6~A&&f=51895360", "FF"
		],
		["第七课:短线精讲第二讲",
			"https://v.youku.com/v_show/id_XMzgyMTMxOTI1Mg==.html?spm=a2h0j.11185381.listitem_page1.5!7~A&&f=51895360", "FF"
		],
		["第八课:超级简单实用的短线分析方法第三讲",
			"https://v.youku.com/v_show/id_XMzgzMzc5NjAzNg==.html?spm=a2h0j.11185381.listitem_page1.5!8~A&&f=51895360", "FF"
		],
		["第九课:小白抓涨停选股", "https://v.qq.com/x/page/e0755pe0og2.html", "ST"],
		["第十课:认识涨停板—上", "https://v.qq.com/x/page/e0808ow5f64.html", "ST"],
		["第十一课:认识涨停板—下", "https://v.qq.com/x/page/w0755al9dt5.html", "ST"],
		["第十二课:我们能抓住的涨停板机会有哪些?", "http://v.youku.com/v_show/id_XNDAwMzE3MTM1Mg==.html?spm=a2h3j.8428770.3416059.1", "FF"],
		["第十三课:如何分析和实盘选股",
			"https://v.youku.com/v_show/id_XMzk3ODg1NDM1Mg==.html?spm=a2h0j.11185381.listitem_page1.5!5~A&&f=52006354", "FF"
		],
		["第十四课:超强首阴战法",
			"https://v.youku.com/v_show/id_XMzk3ODk5Nzk0OA==.html?spm=a2h0j.11185381.listitem_page1.5!4~A&&f=52006354", "FF"
		]
	];
	var i;
	// 封装制造方法   数组  父节点的ID
	function Add_ke_fun(arr, id) {
		var id = document.getElementById(id);
		for (i = 0; i <= arr.length-1; i++) {
			console.log( arr[i][0] );
			var Div = document.createElement("div");
			Div.className = "fa_sd";
			var A = document.createElement("a");
			A.setAttribute('href',arr[i][1]);
			A.innerText = arr[i][0];
			if (arr[i][2] == "ST") {
				var P = document.createElement("p");
				P.className = "bq";
				var Ima = document.createElement("img");
				Ima.className = "bqqy";
				if (arr[i][2] == "ST") {
					Ima.src = "img/ST.png";
				}
				P.appendChild(Ima);
				Div.appendChild(P);
			}
			Div.appendChild(A);
			id.appendChild(Div);
		}
	}
		//循环执行区域
		Add_ke_fun(GkK, "AnLi_voie");
		Add_ke_fun(AnLi, "AnLi_ZCX");
		Add_ke_fun(CMGJ, "CMGJ");
		Add_ke_fun(CJLGJ, "CJLGJ");
		Add_ke_fun(DXGJ, "DXGJ");

		var face = document.getElementById("face");
		// 表情包加载
		for (var j = 1; j <= 50; j++) {
			var lis = document.createElement("li");
			var imgs = document.createElement("img");
			imgs.src = "qqimg/" + j + ".gif";
			lis.appendChild(imgs);
			face.appendChild(lis);
		}
})
