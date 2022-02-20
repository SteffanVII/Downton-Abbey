const main = document.querySelector("main");
const nav = document.querySelector("nav");
const hero = document.querySelector("#hero");
const about = document.querySelector("#about");
    const aboutContentWrapper = about.querySelector('.aboutContentWrapper');
const watch = document.querySelector('#watch');
    const seasonsHeader = watch.querySelector('.seasonsHeader');
        const seasonDetails = seasonsHeader.querySelector('.seasonDetails');
            const seasonPoster = seasonDetails.querySelector('.poster img');
            const seasonText = seasonDetails.querySelector('.texts');
                const seasonTextH = seasonText.querySelector('h3');
                const seasonTextP = seasonText.querySelector('p');
        const seasonsDropdown = watch.querySelector('.seasonsDropdown');
    const seasonEpisodes = watch.querySelector('.seasonEpisodes');
const characters = document.querySelector('#characters');
    const charactersDropdown = characters.querySelector('.charactersDropdown');
        const charactersDropdownContents = charactersDropdown.querySelector('.charactersDropdownContent');
            const charactersDropdownbuttons = Array.from(charactersDropdownContents.querySelector('input'));
    const charactersContainer = characters.querySelector('.charactersContainer');
    const characterDetails = characters.querySelector('.characterDetails');
        const close = characterDetails.querySelector('button');

const scrollArrow = document.querySelector("#ScrollArrow");
const scrollBody = scrollArrow.querySelector(".Body");
const scrollHead = scrollArrow.querySelector(".Head");

const seasonButtons = Array.from(document.querySelectorAll(".seasonsDropdownContent input"));
const charactersButtons = Array.from(document.querySelectorAll(".charactersDropdownContent input"));

let ioHero = new IntersectionObserver( (entries) => {
    let entry = entries[0];
    if ( entry.isIntersecting ) {
        nav.classList.remove('show');
        hero.classList.remove('hide');
    } else {
        nav.classList.add('show');
        hero.classList.add('hide');
    }
}, {
    threshold: 0.3
} ) 

let ioAboutWatchCharacter = new IntersectionObserver( (entries) => {
    entries.forEach( entry => {
        if ( entry.isIntersecting ) {
            if ( entry.intersectionRatio < 1 ) {
                if ( entry.target === about ) {
                    aboutContentWrapper.classList.remove('show');
                } else if ( entry.target === watch ) {
                    watch.classList.remove('show');
                } else if ( entry.target === characters ) {
                    characters.classList.remove('show');
                }
            } else if ( entry.intersectionRatio == 0 ) {
                if ( entry.target === about ) {
                    aboutContentWrapper.classList.remove('show');
                } else if ( entry.target === watch ) {
                    watch.classList.remove('show');
                } else if ( entry.target === characters ) {
                    characters.classList.remove('show');
                }
            }
            else {
                if ( entry.target === about ) {
                    aboutContentWrapper.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.remove('show');
                    } )
                } else if ( entry.target === watch ) {
                    watch.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.add('show');
                    } )
                } else if ( entry.target === characters ) {
                    characters.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.remove('show');
                    } )

                }
            }
        }
    } )
}, {
    threshold: [0 ,0.98 ,1]
} )

ioHero.observe(hero);
ioAboutWatchCharacter.observe(about);
ioAboutWatchCharacter.observe(watch);
ioAboutWatchCharacter.observe(characters);

let length = 45;
let percent = 1;
let maxScroll = (main.scrollHeight - (main.scrollHeight - hero.clientHeight)) * 0.7;
let currentScroll;

function something() {
    currentScroll = main.scrollTop
    percent = (currentScroll / maxScroll);
    if ( percent > 1 ) percent = 1;
    scrollBody.style.setProperty("--offset", 45 * (1 - percent) );
    let scrollArrowPosY = scrollBody.getPointAtLength((length) * percent).y - 4.5;
    if ( scrollArrowPosY < 5 ) scrollArrowPosY = 5;
    scrollHead.setAttribute('transform', 'translate(0,' + scrollArrowPosY + ')');

    requestAnimationFrame(something);
}

something();

seasonsDropdown.addEventListener('click', function() {
    this.classList.toggle('opened');
});

charactersDropdown.addEventListener('click', function() {
    this.classList.toggle('opened');
});

let currentSeason = 0;

function getSeasonData( season = 1, callback, init = false ) {
    if ( season != currentSeason ) {
        var xml = new XMLHttpRequest();
        xml.open("GET", "seasons.json");
        xml.onreadystatechange = function() {
            if ( this.readyState === 4 && this.status === 200 ) {
                var result = JSON.parse(this.responseText);
                callback(season, result[season], );
            }
        }
        xml.send();
    }
}

getSeasonData( 1 , changeSeason, true);

function changeSeason(season, result, initial) {
    let episodeNo = 0;
    seasonPoster.setAttribute('src', result["poster"]);
    seasonTextH.innerText = 'Season ' + season;
    seasonTextP.innerText = result["details"];

    while( seasonEpisodes.lastElementChild ) {
        seasonEpisodes.lastElementChild.remove();
    }

    result["episodes"].forEach( episode => {
        episodeNo += 1;
        makeEpisode(episodeNo, episode["thumbnail"], episode["episodeDetails"], initial);
    } );

    currentSeason = season;
}

function makeEpisode( episode, thumbnail, episodeDetail, initial) {
    let container = document.querySelector('.seasonEpisodes');

    let init = initial ? "" : "show";
    console.log(init);

    let div = document.createElement('div');
    container.appendChild(div);
    div = container.lastElementChild;
    div.outerHTML = `<div class='episode ${init}'>
        <span>Episode ${episode}</span>
        <figure>
            <a href="">
                <span>Watch</span>
                <img src="${thumbnail}" alt="episode ${episode} thumbnail">
            </a>
            <figcaption>${episodeDetail}</figcaption>
        </figure>
    </div>`;

}

seasonButtons.forEach( button => {
    button.addEventListener('click', function() {
        getSeasonData( button.value, changeSeason);
    });
} )

charactersButtons.forEach( button => {
    button.addEventListener('click', function() {
        changeCharacterSet(button.value);
    })
} )

let charactersData = getCharactersData();

function getCharactersData() {
    let xml = new XMLHttpRequest();

    xml.onreadystatechange = function() {
        if ( xml.readyState === 4 && xml.status === 200 ) {
            charactersData = JSON.parse(xml.response);
            changeCharacterSet("nobility");
        }
    }
    xml.open("GET", "characters.json");
    xml.send();
}

function changeCharacterSet( category ) {
    while ( charactersContainer.lastElementChild ) {
        charactersContainer.lastElementChild.remove();
    }

    let charactersList = charactersData[category];

    for ( let key in charactersList ) {
        var value = charactersList[key];

        let div = document.createElement('div');
        charactersContainer.appendChild(div);
        div = charactersContainer.lastElementChild;
        div.outerHTML = `<div class="character">
        <div class="portraitContainer">
        <img src="${value['portrait']}" alt="${value['name']} portrait">
        </div>
        </div>`
    }

    Array.from(charactersContainer.querySelectorAll('.character')).forEach( char => {
        char.addEventListener('click', function() {
            characterDetails.classList.add('show');
        })
    } );
}

close.addEventListener('click', function() {
    characterDetails.classList.remove('show');
});