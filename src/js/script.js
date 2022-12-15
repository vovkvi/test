var pg = getUrlParam('page', undefined);

$(document).ready(() => {
    Hyphenopoly.config({
        require: {
            "ru": "электротехнологический"
        },
        paths: {
            patterndir: "./src/libs/hyphenopoly/patterns/",
            maindir: "./src/libs/hyphenopoly/"
        },
        setup: {
            selectors: {
                ".content": {}
            }
        }
    });
    $('.footer').html('&copy; Vitalii Vovk, ' + new Date().getFullYear());
    $.getScript('./src/js/config.js', () => {
        if (pg != undefined) {
            $('div.content').before('\
                <div class="header">\
                    <label class="switch no-index" onclick="prevCard();">\
                        <svg class="ri-icn"><use xlink:href="#ri-arrow-left-fill"></use></svg>\
                    </label>\
                    <label class="switch active-chapter" onclick="location.href=\'.\';">\
                        <svg class="ri-icn"><use xlink:href="#ri-home-2-fill"></use></svg>\
                    </label>\
                    <label class="switch no-index" onclick="nextCard();">\
                        <svg class="ri-icn"><use xlink:href="#ri-arrow-right-fill"></use></svg>\
                    </label>\
                    <div class="empty-space"></div>\
                    <label class="switch" id="answer">\
                        <svg class="ri-icn"><use xlink:href="#ri-eye-fill"></use></svg>\
                        <input class="slider" type="checkbox" onclick="showAnswers();">\
                    </label>\
                    <label class="switch" id="theme">\
                        <svg class="ri-icn"><use xlink:href="#ri-moon-fill"></use></svg>\
                        <input class="slider" type="checkbox" onclick="changeTheme();">\
                    </label>\
                    <label class="switch" id="screen">\
			<svg class="ri-icn"><use xlink:href="#ri-fullscreen-fill"></use></svg>\
			<input class="slider" type="checkbox" onclick="fullScreen();">\
		    </label>\
                </div>'
            );
            getCard();
        } else {
            showIndexPage();
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
function changeTheme() {
    $('body').attr('dark', $('#theme>input').prop('checked')?'1':'0');
    $('#theme>svg>use').attr('xlink:href',$('body').attr('dark')=="1"?'#ri-sun-fill':'#ri-moon-fill');
    $('body').css('background',$('body').attr('dark') == '1'?'var(--black)':'var(--whitesmoke)');
    $('html').css('background',$('body').css('background'));
}
function showAnswers() {
    $('#answer>svg>use').attr('xlink:href',$('#answer>input').prop('checked')?'#ri-eye-off-fill':'#ri-eye-fill');
    $('details').attr('open',$('#answer>input').prop('checked')?true:false);
}
function renderTable(table, id, title) {
    $('div.content').append('\
        <h2 class="tbl-title">' + title + '</h2>\
            <div class="center">\
                <div class="tbl ' + id + '">\
                    <div class="row"></div>\
                </div>\
            </div>');
    $.each(table, (i) => {
        let col = Object.assign(document.createElement("div"),{className:'col'});
        $.each(table[i], (k,v) => {
            let elem = Object.assign(document.createElement("div"),{className:'elem'});
            elem.setAttribute('onclick','location.href=".?page=' + k + '";');
            var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            svg.setAttribute('class','ri-icn-card');
            var use = document.createElementNS('http://www.w3.org/2000/svg','use');
            use.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',v[2]);
            svg.appendChild(use);
            elem.append(
                svg,
                Object.assign(document.createElement("h2"),{innerHTML:v[0]}),
                Object.assign(document.createElement("p"),{innerHTML:v[1]})
            );
            col.append(elem);
        });
        $('.' + id + '>div.row').append(col);
    });
}
function showIndexPage() {
    $('.wrapper').css('padding-top','4px');
    $('label.no-index').css('display','none');
    $('div.content').empty();
    $('title').text('EXAM. Самоподготовка.');
    $('.active-chapter>svg>use').attr('xlink:href','#ri-home-2-fill');
    renderTable(qcard,'tbl-card','Билеты для подготовки к экзамену в ПДК ТЭЦ-14<br><br>');
    renderTable(qtest,'tbl-test','<br>Контрольные вопросы и инструкции<br><br>');
    changeTheme();
}
function nextCard() {
    $('body').attr('card', (currentCard < countCard) ? currentCard + 1 : countCard);
    getCard();
}
function prevCard() {
    $('body').attr('card', (currentCard >= 1) ? currentCard - 1 : 0);
    getCard(); 
}
function showChapter(chapter) {
    $('body').attr('card', 0);
    $('body').attr('chapter', chapter);
    getCard();
}
function getCard(){
    $('.wrapper').css('padding-top','32px');
    $('label.no-index').css('display', 'unset');
    currentCard = parseInt($('body').attr('card'));
    var tmp = qcard.find(e => e[pg]);
    tmp = tmp == undefined ? qtest.find(e => e[pg]) : tmp;
    var ch = tmp[pg];
    var ttl = ch[0];
    $('.active-chapter>svg>use').attr('xlink:href',ch[2]);
    $('title').text('ExaM. ' + ttl);
    $('#chapter-id').text(ttl);
    var jsUrls = ch[3];
    getScripts(jsUrls, './src/js/', () => {
        $('li > a').attr('class', '');
        $('div.content').empty();
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
        $('div.content').append(div);
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
                innerHTML: (Object.keys(DataA).length === 0) ? question['a'] : DataA[question['a']]
            }));
            let details = document.createElement("details");
            details.append(summary, div);
            $('div.content').append(details);
        });
        window.scrollTo(0,0);
        showAnswers();
        changeTheme();
    });
}
function fullScreen() {
    $('#screen>svg>use').attr('xlink:href',$('#screen>input').prop('checked')?'#ri-fullscreen-exit-fill':'#ri-fullscreen-fill');
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}
