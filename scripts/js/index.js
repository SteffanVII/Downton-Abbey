import * as els from './elements.js' ;

// Intersection Observers --------------------------------------------------------------------------------------------------
let ioHero = new IntersectionObserver( (entries) => {
    let entry = entries[0];
    if ( entry.isIntersecting ) {
        els.nav.classList.remove('show');
        els.navToggle.classList.remove('show');
        els.hero.classList.remove('hide');
    } else {
        els.nav.classList.add('show');
        els.navToggle.classList.add('show');
        els.hero.classList.add('hide');
    }
}, {
    threshold: 0.3
} ) 

let ioAboutWatchCharacter = new IntersectionObserver( (entries) => {
    entries.forEach( entry => {
        if ( entry.isIntersecting ) {
            if ( entry.intersectionRatio < 1 ) {
                if ( entry.target === els.aboutIO ) {
                    els.aboutContentWrapper.classList.remove('show');
                } 
                // else if ( entry.target === els.watch ) {
                //     if ( entry.intersectionRatio * els.watch.clientHeight < document.documentElement.clientHeight ) {
                //         els.watch.classList.remove('show');
                //     }
                // } else if ( entry.target === els.characters ) {
                //     if ( entry.intersectionRatio * els.characters.clientHeight < document.documentElement.clientHeight ) {
                //         els.characters.classList.remove('show');
                //     }
                // }
            } else if ( entry.intersectionRatio == 0 ) {
                if ( entry.target === els.aboutIO ) {
                    els.aboutContentWrapper.classList.remove('show');
                } else if ( entry.target === els.watchIO ) {
                    els.watchWrapper.classList.remove('show');
                } else if ( entry.target === els.charactersIO ) {
                    els.charactersWrapper.classList.remove('show');
                }
            }
            else {
                if ( entry.target === els.aboutIO ) {
                    els.aboutContentWrapper.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.remove('show');
                    } )
                    els.watchWrapper.classList.remove('show');
                    els.charactersWrapper.classList.remove('show');
                } else if ( entry.target === els.watchIO ) {
                    els.watchWrapper.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.add('show');
                    } )
                    Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
                        char.classList.remove('show');
                    } );
                    els.charactersWrapper.classList.remove('show');
                } else if ( entry.target === els.charactersIO ) {
                    els.charactersWrapper.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.remove('show');
                    } )
                    Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
                        char.classList.add('show');
                    } );
                    els.watchWrapper.classList.remove('show');
                } else if ( entry.target === els.movies ) {
                    Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
                        char.classList.remove('show');
                    } );
                }
            }
        }
    } )
}, {
    threshold: [0, 0.98, 1]
} )

ioHero.observe(els.hero);
ioAboutWatchCharacter.observe(els.about);
ioAboutWatchCharacter.observe(els.aboutIO);
ioAboutWatchCharacter.observe(els.watchIO);
ioAboutWatchCharacter.observe(els.charactersIO);
ioAboutWatchCharacter.observe(els.movies);

// Intersection Observers --------------------------------------------------------------------------------------------------

// Hero scroll arrow --------------------------------------------------------------------------------------------------

let length = 45;
let percent = 1;
let maxScroll = (els.main.scrollHeight - (els.main.scrollHeight - els.hero.clientHeight)) * 0.7;
let currentScroll;

function something() {
    currentScroll = els.main.scrollTop
    percent = (currentScroll / maxScroll);
    if ( percent > 1 ) percent = 1;
    els.scrollBody.style.setProperty("--offset", 45 * (1 - percent) );
    let scrollArrowPosY = els.scrollBody.getPointAtLength((length) * percent).y - 4.5;
    if ( scrollArrowPosY < 5 ) scrollArrowPosY = 5;
    els.scrollHead.setAttribute('transform', 'translate(0,' + scrollArrowPosY + ')');
}

// Hero scroll arrow --------------------------------------------------------------------------------------------------

// Season episodes changer --------------------------------------------------------------------------------------------------

let currentSeason = 0;
let currentCharacters;

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
    els.seasonPoster.setAttribute('src', result["poster"]);
    els.seasonTextH.innerText = 'Season ' + season;
    els.seasonTextP.innerText = result["details"];

    while( els.seasonEpisodes.lastElementChild ) {
        els.seasonEpisodes.lastElementChild.remove();
    }

    result["episodes"].forEach( episode => {
        episodeNo += 1;
        makeEpisode(episodeNo, episode["thumbnail"], episode["episodeDetails"], initial);
    } );

    currentSeason = season;
}

function makeEpisode( episode, thumbnail, episodeDetail, initial) {
    let container = document.querySelector('.season-episodes');

    let init = initial ? "" : "show";

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

// Season episodes changer --------------------------------------------------------------------------------------------------

// Change character list --------------------------------------------------------------------------------------------------

let charactersData = getCharactersData();

function getCharactersData() {
    let xml = new XMLHttpRequest();

    xml.onreadystatechange = function() {
        if ( xml.readyState === 4 && xml.status === 200 ) {
            charactersData = JSON.parse(xml.response);
            changeCharacterSet("nobility", true);
        }
    }
    xml.open("GET", "characters.json");
    xml.send();
}

function changeCharacterSet( category, initial = false ) {
    if ( category !== currentCharacters ) {
        while ( els.charactersContainer.lastElementChild ) {
            els.charactersContainer.lastElementChild.remove();
        }
    
        let charactersList = charactersData[category];
    
        for ( let key in charactersList ) {
            var value = charactersList[key];
            
            let init = initial ? '' : 'show';

            let div = document.createElement('div');
            els.charactersContainer.appendChild(div);
            div = els.charactersContainer.lastElementChild;
            div.outerHTML = `<div class="character ${init}" data-name="${value['name']}">
                                <div class="character__portrait-container-wrapper">
                                    <div class="character__portrait-container-wrapper__container">
                                        <img src="${value['portrait']}" alt="${value['name']} portrait">
                                    </div>
                                </div>
                            </div>`
        }
    
        Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
            char.addEventListener('click', function() {
                els.portrait.setAttribute('src', charactersList[this.getAttribute('data-name')].portrait);
                els.portrait.setAttribute('alt', this.getAttribute('data-name') + 'portrait');
                els.characterName.innerText = this.getAttribute('data-name');
                Array.from(els.detailsContainer.querySelectorAll('p')).forEach( r => {
                    r.remove();
                } )
                charactersList[this.getAttribute('data-name')]['details'].forEach( d => {
                    let p = document.createElement('p');
                    p.innerText = d;
                    els.detailsContainer.appendChild(p);
                } )
                els.characterDetails.classList.add('show');
            })
        } );

        currentCharacters = category;
    }
}

// Change character list --------------------------------------------------------------------------------------------------

// Ripple Effect --------------------------------------------------------------------------------------------------

els.canvas.setAttribute('width', els.main.clientWidth);
els.canvas.setAttribute('height', window.innerHeight);

let ctx = els.canvas.getContext("2d");

let ripples = [];

function drawRipple() {
    ctx.clearRect(0, 0, els.canvas.clientWidth, els.canvas.clientHeight);
    for( let i = 0 ; i < ripples.length ; i++ ) {
        let layers = ripples[i]['layers'];
        let radius = ripples[i]['radius'];
        let position = ripples[i]['position'];
        for (let x = 0; x < layers.length; x++) {
            let layer = layers[x];
            if ( x > 0 ) {
                if ( layers[x - 1]['currentRadius'] > (radius * 0.08) ) {
                    layer['currentRadius'] += ripples[i]["speed"] * delta;
                    layer['currentWidth'] = ripples[i]['width'] * (1 - (layer['currentRadius'] / radius));
                }
            } else {
                layer['currentRadius'] += ripples[i]["speed"] * delta;
                layer['currentWidth'] = ripples[i]['width'] * (1 - (layer['currentRadius'] / radius));
            }
            if ( layer['currentRadius'] >= radius ) {
                layer['currentRadius'] = 10000;
            }
            ctx.beginPath();
            ctx.arc( position.x, position.y, layer['currentRadius'], 0, 2 * Math.PI);
            ctx.lineWidth = layer['currentWidth'];
            ctx.strokeStyle = "#fcf2d9";
            ctx.closePath();
            ctx.stroke();
        }
    }
    ripples.forEach(ripple => {
        if (ripple.layers[ripple.layers.length - 1].currentRadius >= ripple.radius) {
            ripples.splice(ripples.indexOf(ripple), 1);
        }
    });
}

function createRipple( width = 50, speed = 50, radius = els.canvas.clientWidth / 2, position = { x : els.canvas.clientWidth/2, y : els.canvas.clientHeight/2 } ) {
    ripples.push( {
        "width" : width,
        "speed" : speed,
        "radius" : radius,
        "position" : position,
        "layers" : [
            {
                "currentRadius" : 0,
                "currentWidth" : width
            },
            {
                "currentRadius" : 0,
                "currentWidth" : width
            },
            {
                "currentRadius" : 0,
                "currentWidth" : width
            }
        ]
    } );
}

// Ripple Effect --------------------------------------------------------------------------------------------------

// Scale Hero Logo --------------------------------------------------------------------------------------------------

function scaleHeroLogo() {
    const abbey = document.querySelector('#ABBEY');
    const downton = document.querySelector('#DOWNTON');
    const castle = document.querySelector('#HIGHCLERECASTLE');

    abbey.style.height = abbey.querySelector('path').getBBox().height + 'px';
    abbey.setAttribute('style', 'height: ' + abbey.querySelector('path').getBoundingClientRect().height + 'px' );
    downton.style.height = downton.querySelector('path').getBBox().height + 'px';
    downton.setAttribute('style', 'height: ' + downton.querySelector('path').getBoundingClientRect().height + 'px' );
    castle.style.height = castle.querySelector('path').getBBox().height + 'px';
    castle.setAttribute('style', 'height: ' + castle.querySelector('path').getBoundingClientRect().height + 'px' );
}

scaleHeroLogo();

// Scale Hero Logo --------------------------------------------------------------------------------------------------

// Animation Frame --------------------------------------------------------------------------------------------------

let lt = 0;
let delta = 0;

function frame(time) {
    if (time) delta = (time - lt) * 0.01;
    something();
    drawRipple();

    if ( time ) lt = time;
    requestAnimationFrame(frame);
}

frame();

// Animation Frame --------------------------------------------------------------------------------------------------

// Event Listeners --------------------------------------------------------------------------------------------------

document.documentElement.addEventListener('click', function(e) {
    createRipple(10, 15, 100, { x: e.clientX, y: e.clientY });
})

window.addEventListener('resize', function() {
    els.canvas.setAttribute('width', els.main.clientWidth);
    els.canvas.setAttribute('height', window.innerHeight);

    ctx.beginPath();
    ctx.arc(50, 50, 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();

    scaleHeroLogo();
});

els.seasonsDropdown.addEventListener('click', function() {
    this.classList.toggle('opened');
});

els.charactersDropdown.addEventListener('click', function() {
    this.classList.toggle('opened');
});

els.seasonButtons.forEach( button => {
    button.addEventListener('click', function() {
        getSeasonData( button.value, changeSeason);
    });
} )

els.charactersButtons.forEach( button => {
    button.addEventListener('click', function() {
        els.charactersDropdown.querySelector('span').innerText = button.value
        changeCharacterSet(button.value);
    })
} )

els.close.addEventListener('click', function() {
    els.characterDetails.classList.remove('show');
});

document.querySelector('.hero-logo hr').addEventListener('animationend', function() {
    if ( document.documentElement.clientWidth < 920 ) {
        createRipple(22, 12, els.canvas.clientHeight /2);
    } else {
        createRipple( 50, 30 );
    }
});

els.navToggle.addEventListener('click', function() {
    els.nav.classList.toggle('toggle');
});

// Event Listeners --------------------------------------------------------------------------------------------------