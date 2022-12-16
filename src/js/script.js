$(document).ready(() => {
    $('.footer').html('&copy; Vitalii Vovk, ' + new Date().getFullYear());
    document.addEventListener('fullscreenchange', (event) => {
        $('#screen>svg>use').attr('xlink:href',document.fullscreenElement?'#ri-fullscreen-exit-fill':'#ri-fullscreen-fill');
    });
    $('#screen').on('click', fullScreen);
    $('#answer').on('click', showAnswers);
    $('#theme').on('click', changeTheme);
    showIndexPage();
    $('.loading').css('display', 'none');
    $('.wrapper').css('display', 'flex');
});
function changeTheme() {
    $('body').attr('dark',$('#theme>input').prop('checked')?'1':'0');
    $('#theme>svg>use').attr('xlink:href',$('body').attr('dark')=="1"?'#ri-sun-fill':'#ri-moon-fill');
    $('body').css('background',$('body').attr('dark') == '1'?'var(--black)':'var(--whitesmoke)');
    $('html').css('background',$('body').css('background'));
}
function showAnswers() {
    $('#answer>svg>use').attr('xlink:href',$('#answer>input').prop('checked')?'#ri-eye-off-fill':'#ri-eye-fill');
    $('details').attr('open',$('#answer>input').prop('checked')?true:false);
}
function renderTable(table, id, title) {
    $('div.content').append('<h2 class="tbl-title">'+title+'</h2><div class="center"><div class="tbl '+id+'"><div class="row"></div></div></div>');
    $.each(table,(i) => {
        let col = Object.assign(document.createElement("div"),{className:'col'});
        $.each(table[i],(k,v) => {
            let elem = Object.assign(document.createElement("div"),{className:'elem'});
            var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            svg.setAttribute('class','ri-icn-card');
            svg.setAttribute('onclick','showChapter("'+k+'");');
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
        $('.'+id+'>div.row').append(col);
    });
}
function showIndexPage() {
    $('label.no-index').css('display','none');
    $('div.content').empty();
    $('title').text('EXAM. Самоподготовка.');
    $('.active-chapter>svg>use').attr('xlink:href','#ri-home-2-fill');
    renderTable(qcard,'tbl-card','<br>Экзаменационные билеты для аттестации в ПДК ТЭЦ-14<br><br>');
    renderTable(qtest,'tbl-test','<br>Контрольные вопросы и прочие документы<br><br>');
}
function nextCard() {
    $('body').attr('card',parseInt($('body').attr('card'))+1);
    getCard();
}
function prevCard() {
    $('body').attr('card',parseInt($('body').attr('card'))-1);
    getCard(); 
}
function showChapter(chapter) {
    $('body').attr('card',0);
    $('body').attr('chapter',chapter);
    getCard();
}
function getCard(){
    $('label.no-index').css('display','unset');
    chapter = $('body').attr('chapter');
    var tmp = qcard.find(e => e[chapter]);
    tmp = tmp == undefined ? qtest.find(e => e[chapter]) : tmp;
    var ch = tmp[chapter];
    var ttl = ch[0];
    $('.active-chapter>svg>use').attr('xlink:href',ch[2]);
    var DtQ = ch[3][0];
    var DtA = ch[3][1];
    var countCard = DtQ.length -1;
    var currentCard = parseInt($('body').attr('card'));
    currentCard = (currentCard < 0) ? 0 : currentCard;
    currentCard = (currentCard >= countCard) ? countCard : currentCard;
    $('body').attr('card', currentCard);
    $('title').text('ExaM. ' + ttl);
    $('#chapter-id').text(ttl);
    $('li>a').attr('class', '');
    $('div.content')
        .empty()
        .append(() => {
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
            return div;
        });
    $.each(DtQ[currentCard],(q) => {
        $('div.content').append(() => {
            let details = document.createElement("details");
            question = DtQ[currentCard][q];
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
                innerHTML: (Object.keys(DtA).length === 0) ? question['a'] : DtA[question['a']]
            }));
            details.append(summary, div);
            return details;
        });
    });
    window.scrollTo(0,0);
    showAnswers();
}
function fullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
}

