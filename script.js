console.log('show me what you got');

const PLAYER_INDEX = 0;
const CHARACTER_INDEX = 1;
const LINK_INDEX = 2;
const TIME_INDEX = 3;
const DATE_INDEX = 4;
const NEW_INDEX = 5;
const FRAMES_INDEX = 6;
const EOW_INDEX = 7;
const CURRENT_BEST_INDEX = 8
const BOUNTY_INDEX = 9
const POINT_INDEX = 10;

const CHARACTER_KEYS = Object.freeze({
    Dr_Mario: 'doc',
    Mario: 'mario',
    Luigi: 'luigi',
    Bowser: 'bowser',
    Peach: 'peach',
    Yoshi: 'yoshi',
    DK: 'dk',
    Falcon: 'falcon',
    Ganon: 'ganon',
    Falco: 'falco',
    Fox: 'fox',
    Ness: 'ness',
    Popo: 'popo',
    Kirby: 'kirby',
    Samus: 'samus',
    Sheik: 'sheik',
    Link: 'link',
    YL: 'yl',
    Pichu: 'pichu',
    Pikachu: 'pika',
    Puff: 'puff',
    M2: 'm2',
    GnW: 'gnw',
    Marth: 'marth',
    Roy: 'roy',
    // Bonus Chars
    Giga: 'giga',
    MWF: 'mwf',
    FWF: 'fwf',
    ICs: 'ics',
    Zelda: 'zelda',
});

const characterStrings = {
    [CHARACTER_KEYS.Dr_Mario]: 'Dr. Mario',
    [CHARACTER_KEYS.Mario]: 'Mario',
    [CHARACTER_KEYS.Luigi]: 'Luigi',
    [CHARACTER_KEYS.Bowser]: 'Bowser',
    [CHARACTER_KEYS.Peach]: 'Peach',
    [CHARACTER_KEYS.Yoshi]: 'Yoshi',
    [CHARACTER_KEYS.DK]: 'Donkey Kong',
    [CHARACTER_KEYS.Falcon]: 'Falcon',
    [CHARACTER_KEYS.Ganon]: 'Ganondorf',
    [CHARACTER_KEYS.Falco]: 'Falco',
    [CHARACTER_KEYS.Fox]: 'Fox',
    [CHARACTER_KEYS.Ness]: 'Ness',
    [CHARACTER_KEYS.Popo]: 'Popo',
    [CHARACTER_KEYS.Kirby]: 'Kirby',
    [CHARACTER_KEYS.Samus]: 'Samus',
    [CHARACTER_KEYS.Sheik]: 'Sheik',
    [CHARACTER_KEYS.Link]: 'Link',
    [CHARACTER_KEYS.YL]: 'Young Link',
    [CHARACTER_KEYS.Pichu]: 'Pichu',
    [CHARACTER_KEYS.Pikachu]: 'Pikachu',
    [CHARACTER_KEYS.Puff]: 'Jigglypuff',
    [CHARACTER_KEYS.M2]: 'Mewtwo',
    [CHARACTER_KEYS.GnW]: 'Mr. Game & Watch',
    [CHARACTER_KEYS.Marth]: 'Marth',
    [CHARACTER_KEYS.Roy]: 'Roy',
    // Bonus Chars
    [CHARACTER_KEYS.Giga]: 'Giga Bowser',
    [CHARACTER_KEYS.MWF]: 'Male Wire Frame',
    [CHARACTER_KEYS.FWF]: 'Female Wire Frame',
    [CHARACTER_KEYS.ICs]: 'Ice Climbers',
    [CHARACTER_KEYS.Zelda]: 'Zelda'
};

RES_DIR = './res';
RUNS_DIR = 'data';
IMG_DIR = 'img';
STOCK_ICON_DIR = 'icons';

CURRENT_CHAR = CHARACTER_KEYS.Falco;
STAGE_RUN_EXTENSION = '.csv'
STOCK_ICON_EXTENSION = '.png'
    


fetch(`${RES_DIR}/${RUNS_DIR}/${CURRENT_CHAR}${STAGE_RUN_EXTENSION}`)
    .then(response => response.text())
    .then(data => displayStageData(data))


function displayStageData(data) {
    const rows = data.split('\n');
    const parsed = rows.map(row => row.split('\t'));

    for (let i = parsed.length - 1; i >= 0; i--) {
        addRow(parsed[i]);
    }

    displayBountyInfo(parsed)

    // Display the bounty stuff
}

function displayBountyInfo(parsed) {
    const table = getBountyTable();

    const playerBountyMap = {}

    parsed.forEach((row) => {
        const player = row[PLAYER_INDEX];
        const bounty = parseInt(row[BOUNTY_INDEX].substring(1));
        const points = parseInt(row[POINT_INDEX]);

        let playerInfo = {
            'bounty': 0,
            'points': 0,
        };
        if (!playerBountyMap[player]) {
            playerBountyMap[player] = playerInfo;
        } else {
            playerInfo = playerBountyMap[player];
        }

        playerInfo.bounty += bounty;
        playerInfo.points += points;
    })

    const uniquePlayers = Object.keys(playerBountyMap);

    uniquePlayers.sort((a, b) => {
        const bountyCompare = playerBountyMap[b].bounty - playerBountyMap[a].bounty;
        if (bountyCompare === 0) {
            return playerBountyMap[b].points - playerBountyMap[a].points
        } else {
            return bountyCompare;
        }
        
    });

    for (index in uniquePlayers) {
        const player = uniquePlayers[index];
        const tableRow = document.createElement('tr');

        const playerName = document.createElement('td');
        playerName.innerText = player;
        tableRow.appendChild(playerName);

        const playerBounty = document.createElement('td');
        playerBounty.innerText = '$' + playerBountyMap[player].bounty;
        tableRow.appendChild(playerBounty);

        const playerPoints = document.createElement('td');
        playerPoints.innerText = playerBountyMap[player].points + 'BP';
        tableRow.appendChild(playerPoints);

        table.appendChild(tableRow);
    }
}

function addRow(row) {
    const table = getSubmissionTable();

    const tableRow = document.createElement('tr');
    const isBest = row[CURRENT_BEST_INDEX] === 'TRUE';
    tableRow.classList.add(isBest ? undefined : 'obsolete-record');

    // Add the character
    const character = document.createElement('td');
    character.classList.add('image-container');
    const characterIcon = document.createElement('img');
    characterIcon.setAttribute('src', getCharIconRef(row[1].toLowerCase()));
    characterIcon.classList.add('stock-icon', 'submission-icon');
    character.appendChild(characterIcon);
    tableRow.appendChild(character);

    // Add the time
    const time = document.createElement('td');
    time.innerText = row[TIME_INDEX];
    tableRow.appendChild(time);

    // Player
    const player = document.createElement('td')
    player.innerText = row[PLAYER_INDEX];
    tableRow.appendChild(player);

    // Link
    const link = document.createElement('td');
    const linkContent = document.createElement('a');
    linkContent.setAttribute('href', row[LINK_INDEX])
    linkContent.setAttribute('target', '_blank');
    linkContent.innerText = row[LINK_INDEX];
    link.appendChild(linkContent);
    tableRow.appendChild(link);

    // Date
    const date = document.createElement('td');
    date.innerText = row[DATE_INDEX];
    tableRow.appendChild(date);

    table.appendChild(tableRow);
}


function getCharIconRef(char) {
    return `${RES_DIR}/${IMG_DIR}/${STOCK_ICON_DIR}/${char}${STOCK_ICON_EXTENSION}`;
}

function getCurrentCharIcon() {
    return getCharIconRef(CURRENT_CHAR);
}

function initDisplayForChar(charKey) {
    document.getElementById('theme-stage-label').innerText = characterStrings[charKey];
    document.getElementById('header-stock').setAttribute('src', getCharIconRef(charKey));
}


function getTimeSpan() {
    return document.getElementById('time-span');
}

function getSubmissionTable() {
    return document.getElementById('submission-table');
}

function getBountyTable() {
    return document.getElementById('bounty-table');
}

function udpateCountdownColor(remainingTime) {
    const span = getTimeSpan();

    span.classList.remove('green-text', 'red-text', 'orange-text');
    if (remainingTime < (1000 * 60 * 60 * 12)) {
        span.classList.add('red-text');
    } else if (remainingTime < (1000 * 60 * 60 * 30)) {
        span.classList.add('orange-text');
    } else {
        span.classList.add('green-text');
    }
}

function updateCountdown() {
    const element = getTimeSpan();
    const now = new Date().getTime();
    const remainingTime = 1722729600000 - now;

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      element.textContent = 'Time is up!';
      return;
    }

    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

    element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    udpateCountdownColor(remainingTime);
}


initDisplayForChar(CURRENT_CHAR);
updateCountdown();
setInterval(() => {updateCountdown()}, 1000);





