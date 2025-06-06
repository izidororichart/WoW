var expansion = 10;

var expansionMap = [
    'Vanilla',
    'TheBurningCrusade',
    'WrathOfTheLichKing',
    'Cataclysm',
    'MistsOfPandaria',
    'WarlordsOfDraenor',
    'Legion',
    'BattleForAzeroth',
    'Shadowlands',
    'Dragonflight',
    'WarWithin',
]

var audioPath = './assets/audio';
var videoPath = './assets/img/bg';
var logoPath = './assets/img/ui/logos';

var verMap = [
    'Versão 1.12.1 (5875) (Versão Final)',
    'Versão 2.4.3 (8606) (Versão Final)',
    'Versão 3.3.5 (12340) (Versão Final)',
    'Versão 4.3.4 (15595) (Versão Final x86)',
    'Versão 5.4.8 (18414) (Versão Final x86)',
    'Versão 6.2.0 (20173) (Versão Final x64)',
    'Versão 7.3.5 (26365) (Versão Final x64)',
    'Versão 8.3.7 (35662) (Versão Final x64)',
    'Versão 9.0.1 (35944) (Versão Final x64)',
    'Versão 10.0.2 (46658) (Versão Final x64)',
    'Versão 11.0.2'
];

var dateMap = [
    'Set 19 2006',
    'Jul 10 2008',
    'Jun 24 2010',
    'Fev 9 2011',
    'Jun 13 2014',
    'Jun 20 2015',
    'Abr 3 2018',
    'Ago 24 2020',
    'Out 13 2020',
    'Nov 28 2022',
    'Ago 26 2024'
];

var buttonColorMap = [
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];

var copyMap = [
    2006,
    2008,
    2010,
    2011,
    2014,
    2015,
    2018,
    2020,
    2020,
    2022,
    2024
];

var cursor;
var audio = new Audio();
var buttonAudio = new Audio();
var audioInitialPlayback = false;
var queuePos = null;
var disconnected = false;

function init()
{
    switchExpansion();
    window.addEventListener('click', waitForInteractionToPlayAudio);

    getPositionInQueue();
    setInterval(determineIfDisconnect, 8000);
}

function waitForInteractionToPlayAudio()
{
    if(!audioInitialPlayback)
    {
        buttonAudio.volume = 0.5;
        audio.volume = 0.5;
        audio.loop = true;
        audio.play();
        audioInitialPlayback = true;
    }
}

function determineIfDisconnect()
{
    if(!disconnected)
    {
        var rand = Math.random();
        if(rand < 0.75)
            getPositionInQueue();
    }
}

function getPositionInQueue()
{
    var number;
    if(queuePos === null)
    {    
        number = Math.floor(Math.random() * Math.floor(10000));
        queuePos = number;
    }
    else
    {
        number = Math.floor(queuePos - (Math.random() * Math.floor(15)));
        queuePos = number;

        if(queuePos < 3)
        {
            number = 0;
            queuePos = 0;
            doDisconnect();
        }
    }

    document.getElementById('queuePosition').innerHTML = 'Position in Queue: ' + number;
    getEstimatedTime(number)
}

function getEstimatedTime(qPos)
{
    var time = Math.floor(Math.floor(qPos*2*3*2 + ((qPos*2*3*3) - (qPos*2*3*2)) * Math.random()) * 0.01);
    document.getElementById('queueTime').innerHTML = 'Estimated time: ' + time + ' min';
}

function doDisconnect()
{
    hideQueue();
    showDisconnect();
    playButtonAudio(1);
    disconnected = true;
    console.log("DC'd")
}

function manualChangeExpac()
{
    console.log("Changing xpac to: ");
    expansion += 1;
    if(expansion > 10)
        expansion = 0;
    
    var bg = document.getElementById('background');
    bg.muted = false;
    switchExpansion();
}

function switchExpansion()
{
    if(disconnected)
    {
        disconnected = false;
        hideQueue();
        showDisconnect();
    }
    queuePos = null;
    getPositionInQueue();
    var bg = document.getElementById('background');
    var bgMp4 = bg.querySelector('source:nth-child(1)');
    var logo = document.getElementById('logo');
    var version = document.getElementById('buildVersion');
    var date = document.getElementById('buildDate');
    var copyright = document.getElementById('copyrightText');
    
    bg.pause();
    audio.pause();
    var expName = expansionMap[expansion];
    console.log(expName);
    audio.src = `${audioPath}/${expName}.ogg`;
    bgMp4.setAttribute('src', `${videoPath}/${expName}.mp4`)
    logo.style.background = `url(${logoPath}/${expName}.png)`;
    version.textContent = verMap[expansion];
    date.textContent = dateMap[expansion];
    copyright.textContent = `Copyright 2004-${copyMap[expansion]} Blizzard Entertainment. Todos os direitos reservados.`;
    setButtonColors(buttonColorMap[expansion]);
    
    bg.load();
    bg.play();
    audio.play();
    
}

function playButtonAudio(index)
{
    buttonAudio.pause();
    buttonAudio.time = 0;

    if(index === 0)
        buttonAudio.src = './assets/audio/ui/button_click.ogg';
    else
        buttonAudio.src = './assets/audio/ui/button_click_big.ogg';
    
    buttonAudio.play();
}

function hideQueue()
{
    var x = document.getElementById("queue");
    if(x.style.display === "none")
        x.style.display = "flex";
    else
        x.style.display = "none";
}

function showDisconnect()
{
    var x = document.getElementById("disconnectBox");
    if(x.style.display === "none")
        x.style.display = "flex";
    else
        x.style.display = "none";
}

function resetQueue()
{
    disconnected = false;
    showDisconnect();
    hideQueue();
}

function showSettings()
{
    var opt = document.getElementById("options");
    if(opt.style.display == "none")
    {
        opt.style.display = "flex";
    }
    else
    {
        opt.style.display = "none";
    }
}

function adjustVolume()
{
    var slider = document.getElementById("volumeSlider");
    var val = slider.value * 0.01;
    audio.volume = val;
    buttonAudio.volume = val;
    document.getElementById('background').volume = val;
}

function setButtonColors(index)
{
    var quitButton = document.getElementById("quitButton");
    var optButton = document.getElementById("optButton");
    var realmListButton = document.getElementById("realmListButton");
    var disconButton = document.getElementById("disconButton");
    switch(index)
    {
        case 0:
            quitButton.className = "button";
            optButton.className = "button";
            realmListButton.className = "button";
            disconButton.className = "button";
        break;

        case 1:
            quitButton.className = "button_b";
            optButton.className = "button_b";
            realmListButton.className = "button_b";
            disconButton.className = "button_b";
        break;
    }
}
