var pg = getUrlParam('page', undefined);

$(document).ready(() => {
	Hyphenopoly.config({
    	require: {
        	"ru": "восьмидесятивосьмимиллиметровое"
    	},
    	paths: {
        	patterndir: "./src/third-party/hyphenopoly/patterns/",
        	maindir: "./src/third-party/hyphenopoly/"
   		},
    	setup: {
        	selectors: {
            	".content": {}
        	}
    	}
	});

	var currentYear = new Date().getFullYear();
	$('.footer').html('&copy; Vitalii Vovk, ' + ((currentYear===2022) ? '2022' : '2022 - ' + currentYear));

	$.getScript('https://vovkvi.github.io/exam/src/js/config.js', () => {
	
		var style = document.createElement('link');
    	style.href = (pg != undefined) ? './src/css/content.css' : './src/css/index.css';
    	style.type = 'text/css';
    	style.rel = 'stylesheet';
    	document.getElementsByTagName('head')[0].append(style);

		if (pg != undefined) {
			$('main.content').before('\
				<header class="header">\
					<label class="switch"><input id="prev-card" type="checkbox" onclick="prevCard();"><span class="slider"></span><i class="ri-arrow-left-fill prev"></i></label>\
					<label class="switch"><input type="checkbox" onclick="location.href=\'.\';"><span class="slider"></span><i class="ri-home-2-fill active-chapter-icon"></i></label>\
					<label class="switch"><input id="next-card" type="checkbox" onclick="nextCard();"><span class="slider"></span><i class="ri-arrow-right-fill next"></i></label>\
					<div class="active-chapter"></div>\
					<label class="switch"><input id="show-answ" type="checkbox" onclick="showAnsw();"><span class="slider"></span><i class="ri-eye-off-fill eye-close"></i><i class="ri-eye-fill eye"></i></label>\
					<label class="switch"><input id="change-theme" type="checkbox" onclick="changeTheme();"><span class="slider"></span><i class="ri-sun-fill sun"></i><i class="ri-moon-fill moon"></i></label>\
				</header>'
			);
			getCard();
		} else {
			setIndexContent();
		}
	});
});

function getScripts(scripts, path, callback) {
    var progress = 0;
    scripts.forEach(function(script) { 
        $.getScript((path||"") + script, function () {
            if (++progress == scripts.length) callback();
        }); 
    });
}
function getUrlParam(parameter, defaultvalue){
    var urlparam = (window.location.href.indexOf(parameter) >- 1) ? getUrlVars()[parameter] : defaultvalue;
    return (urlparam !== undefined) ? urlparam : defaultvalue;
}
function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function showAnsw() {
	$('details').attr('open', (document.getElementById('show-answ').checked) ? true : false);
}
function changeTheme() {
	var isNight = $('#change-theme').prop('checked');
	var bg = (isNight) ? '#000' : 'var(--background)';
    var dt = (isNight) ? 'var(--black)' : 'var(--white)';
    var sum = (isNight) ? '#fff' : '#000';
    var an = (isNight) ? 'var(--color-akcent)' : 'var(--answer-color)';
    var hdr = (isNight) ? dt : 'var(--color-akcent)';
    var achapt = (isNight) ? 'var(--color-akcent)' : 'var(--black)';
    $('body').css('background', bg);
    $('html').css('background', bg);
    $('.header').css('background', hdr);
    $('.footer').css('background', hdr);
    $('.footer').css('color', sum);
    $('.slider').css('background', achapt);
    $('details').css('background', dt);
    $('.elem').css('background', dt);
    $('summary').css('color', sum);
    $('.elem h2').css('color', sum);
    $('.answer').css('color', an);
    document.documentElement.style.setProperty('--a-hover-text', dt);
}
function nextCard() {
    $('body').attr('card', (currentCard < countCard) ? currentCard + 1 : countCard);
   	getCard();
}
function prevCard() {
    $('body').attr('card', (currentCard >= 1) ? currentCard - 1 : 0);
    getCard(); 
}
function setIndexContent() {
    $('title').text('EXAM. Самоподготовка.');
    $('main.content').before('<h2 id="index-title">Контрольные вопросы и билеты для подготовки к сдаче экзаменов в ПДК ТЭЦ-14</h2>');
    $('main.content').append('\
        <div id="center">\
            <div id="tbl">\
                <div class="row">\
                </div>\
            </div>\
        </div>');
    $.each(pages, (i) => {
        let col = document.createElement("div");
        col.setAttribute('class', 'col');
        $.each(pages[i], (k,v) => {
            let elem = document.createElement("div");
            elem.setAttribute('class', 'elem');
            let div = document.createElement("div");
            let a = document.createElement("a");
            a.setAttribute('class', v[2]);
            a.setAttribute('onclick', 'location.href="./index.html?page=' + k + '";');
            div.append(a);
            elem.append(div);
            let h2 = document.createElement('h2');
            h2.innerHTML = v[0];
            elem.append(h2);
            let p = document.createElement('p');
            p.innerHTML = v[1];
            elem.append(p);
            col.append(elem);
        });
        $('div.row').append(col);
    });
}
function getCard(){
	currentCard = parseInt($('body').attr('card'));
   	$.each(pages, (i) => {
   		$.each(pages[i], (k,v) => {
       	  	if (k === pg) {
           	   	ttl = v[0];
           		icn = v[2];
           		jsUrls = v[3];
       		}
    	});
   	});
	getScripts(jsUrls, 'https://vovkvi.github.io/exam/src/js/', () => {
   		$('title').text('ExaM. ' + ttl);
   		$('#chapter-id').text(ttl);
    	$('.active-chapter-icon').attr('class', icn + ' active-chapter-icon');
   		$('li > a').attr('class', '');
   		$('main.content').empty();
		if (parseInt($('body').attr('count')) === 0) {
       		countCard = DataQ.length -1;
       		$('body').attr('count', countCard);
   		}
   		$('main.content').append('<div class="card-hdr">\
       	    <h2 id="title">' + ttl + '</h2>\
       		<h2 id="card">' + (currentCard + 1) + '&nbsp;из&nbsp;' + (countCard+1) + '</h2>\
       		</div>'
       		);
    	$.each(DataQ[currentCard], (q) => {
        	question = DataQ[currentCard][q];;
        	let details = document.createElement("details");
        	let summary = document.createElement("summary");
        	summary.setAttribute('lang', 'ru');    
        	summary.innerHTML = question['q'];
        	let span = document.createElement("span");
        	span.setAttribute('class', 'ntd');
        	span.setAttribute('lang', 'ru');
        	span.innerHTML = '<br>' + question['n'];
        	summary.append(span);
        	details.append(summary);
        	let p = document.createElement('p');
        	p.setAttribute('lang', 'ru');
        	p.innerHTML = (DataA.length === 0) ? question['a'] : DataA[question['a']];
        	let div = document.createElement('div');
        	div.setAttribute('class', 'answer');
        	div.append(p);
        	details.append(div);
        	$('main.content').append(details);
    	});
    	window.scrollTo(0, 0);
    	showAnsw();
    	changeTheme();
	});
}