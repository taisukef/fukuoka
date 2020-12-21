import { CSV } from "https://code4sabae.github.io/js/CSV.js";

var getCallbackMethod = function(callback) {
	var scallback = "_cb_" + (Math.random() * 1000000 >> 0);
	window[scallback] = function(data) {
		window[scallback] = null;
		callback(data);
	};
	return scallback;
};
const jsonp = (url, callback) => {
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	if (callback) {
		if (url.indexOf("?") >= 0) {
			url += "&";
		} else {
			url += "?";
		}
		url += "callback=" + getCallbackMethod(callback);
	}
	script.setAttribute("src", url);
	script.setAttribute("type", "text/javascript");
//	script.setAttribute("id", 'jsonp');
	head.appendChild(script);
};
const getRawJSON = function(url, srcenc, callback) {
	var host = "fukuno.jig.jp";
	var cache = "no";
	var base = "https://" + host + "/proxy/ITqT5WkhCf2yn1s9?";
	var url2 = base + "cnv=json&srcenc=" + srcenc + "&cache="  + cache + "&callback=" + getCallbackMethod(callback) + "&url=" + encodeURIComponent(url);
	jsonp(url2);
};
const fetchViaProxy = async (url, enc) => {
	return new Promise(resolve => {
		getRawJSON(url, enc ? enc : "utf-8", function(data) {
			resolve(data)
		})
	})
};
const fetchDiseaseDataFukuoka = async () => {
	// 福岡市
	// 自治体コード,自治体名,地点名,年,月,週,（インフルエンザ）,（咽頭結膜熱）,（感染性胃腸炎）,（手足口病）
	const csvurl1 = 'https://ckan.open-governmentdata.org/dataset/32cc4331-2ab4-489b-92c5-8dd14afe65f8/resource/a08c4052-fb8a-46c7-8241-870d5c511b71/download/teiten4syu.csv'
	const fukuoka = CSV.decode(await fetchViaProxy(csvurl1, "SJIS"));
	const normalizeHeader = function(csv) {
		csv[0] = csv[0].map((e) => e.startsWith('（') ? e.substring(1, e.length - 1) : e)
	}
	normalizeHeader(fukuoka)
	//console.log(fukuoka)
	// const l2 = getLatest(fukuoka)
	//console.log(l2)
	return fukuoka;
};

export { fetchDiseaseDataFukuoka };
