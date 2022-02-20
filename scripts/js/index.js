import * as els from './elements.js' ;

// Intersection Observers --------------------------------------------------------------------------------------------------
let ioHero = new IntersectionObserver( (entries) => {
    let entry = entries[0];
    if ( entry.isIntersecting ) {
        els.nav.classList.remove('show');
        els.hero.classList.remove('hide');
    } else {
        els.nav.classList.add('show');
        els.hero.classList.add('hide');
    }
}, {
    threshold: 0.3
} ) 

let ioAboutWatchCharacter = new IntersectionObserver( (entries) => {
    entries.forEach( entry => {
        if ( entry.isIntersecting ) {
            if ( entry.intersectionRatio < 1 ) {
                if ( entry.target === els.about ) {
                    els.aboutContentWrapper.classList.remove('show');
                } else if ( entry.target === els.watch ) {
                    els.watch.classList.remove('show');
                } else if ( entry.target === els.characters ) {
                    els.characters.classList.remove('show');
                }
            } else if ( entry.intersectionRatio == 0 ) {
                if ( entry.target === els.about ) {
                    els.aboutContentWrapper.classList.remove('show');
                } else if ( entry.target === els.watch ) {
                    els.watch.classList.remove('show');
                } else if ( entry.target === els.characters ) {
                    els.characters.classList.remove('show');
                }
            }
            else {
                if ( entry.target === els.about ) {
                    els.aboutContentWrapper.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.remove('show');
                    } )
                } else if ( entry.target === els.watch ) {
                    els.watch.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.add('show');
                    } )
                    Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
                        char.classList.remove('show');
                    } );
                } else if ( entry.target === els.characters ) {
                    els.characters.classList.add('show');
                    Array.from(document.querySelectorAll('.episode')).forEach( ep => {
                        ep.classList.remove('show');
                    } )
                    Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
                        char.classList.add('show');
                    } );
                } else if ( entry.target === els.movies ) {
                    Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
                        char.classList.remove('show');
                    } );
                }
            }
        }
    } )
}, {
    threshold: [0 ,0.98 ,1]
} )

ioHero.observe(els.hero);
ioAboutWatchCharacter.observe(els.about);
ioAboutWatchCharacter.observe(els.watch);
ioAboutWatchCharacter.observe(els.characters);
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
                                <div class="portraitContainerWrapper">
                                    <div class="portraitContainer">
                                        <img src="${value['portrait']}" alt="${value['name']} portrait">
                                    </div>
                                </div>
                            </div>`
        }
    
        Array.from(els.charactersContainer.querySelectorAll('.character')).forEach( char => {
            char.addEventListener('click', function() {
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

document.querySelector('.heroLogo hr').addEventListener('animationend', function() {
    createRipple( 50, 30 );
});

// Event Listeners --------------------------------------------------------------------------------------------------