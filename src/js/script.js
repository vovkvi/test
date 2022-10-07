var pg = getUrlParam('page', undefined);
Hyphenopoly.config({
        require: {
            "ru": "восьмидесятивосьмимиллиметровое",
            "en-us": "Supercalifragilisticexpialidocious"
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

$(document).ready(() => {
	var currentYear = new Date().getFullYear();
	$('.footer').html('&copy; Vitalii Vovk, ' + ((currentYear===2022) ? '2022' : '2022 - ' + currentYear));

	$.getScript('./src/js/config.js', () => {
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
                <div class="row"></div>\
            </div>\
        </div>');
    $.each(pages, (i) => {
        let col = Object.assign(document.createElement("div"),{
            className: 'col'
        });
        $.each(pages[i], (k,v) => {
            let elem = Object.assign(document.createElement("div"),{
                className: 'elem'
            });
            let div = document.createElement("div");
            let a = Object.assign(document.createElement("a"),{
                className: v[2]
            });
            a.setAttribute('onclick', 'location.href=".?page=' + k + '";');
            div.append(a);
            elem.append(
                div,
                Object.assign(document.createElement("h2"),{
                    innerHTML: v[0]
                }),
                Object.assign(document.createElement("p"),{
                    innerHTML: v[1]
                })
            );
            col.append(elem);
        });
        $('div.row').append(col);
    });
}
function getCard(){
	currentCard = parseInt($('body').attr('card'));
    var ch = pages.find(e => e[pg])[pg];
    var ttl = ch[0];
    $('#chapter-id').text(ttl);
    $('title').text('ExaM. ' + ttl);
    $('.active-chapter-icon').attr('class', ch[2] + ' active-chapter-icon');
    var jsUrls = ch[3];
	getScripts(jsUrls, './src/js/', () => {
   		$('li > a').attr('class', '');
   		$('main.content').empty();
		if (parseInt($('body').attr('count')) === 0) {
       		countCard = DataQ.length -1;
       		$('body').attr('count', countCard);
   		}
   		let div = Object.assign(document.createElement("div"),{
            className:'card-hdr'
        });
        div.append(
            Object.assign(document.createElement("h2"),{
                id: 'title',
                innerHTML: ttl
            }),
            Object.assign(document.createElement("h2"),{
                id: 'card',
                innerHTML: (currentCard+1) + '&nbsp;из&nbsp;' + (countCard+1)
            })
        );
        $('main.content').append(div);
    	$.each(DataQ[currentCard], (q) => {
            question = DataQ[currentCard][q];
            let summary = Object.assign(document.createElement("summary"),{
                lang: 'ru',
                innerHTML: question['q']
            });
            summary.append(Object.assign(document.createElement("span"),{
                className: 'ntd',
                lang: 'ru',
                innerHTML: '<br>' + question['n']
            }));
            let div = Object.assign(document.createElement('div'), {
                className: 'answer'
            });
            div.append(Object.assign(document.createElement('p'), {
                lang: 'ru',
                innerHTML: (DataA.length === 0) ? question['a'] : DataA[question['a']]
            }));
            let details = document.createElement("details");
            details.append(summary, div);
            $('main.content').append(details);
    	});
    	window.scrollTo(0, 0);
    	showAnsw();
    	changeTheme();
	});
}
