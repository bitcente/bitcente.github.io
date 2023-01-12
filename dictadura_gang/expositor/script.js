const global = document.querySelector(".global");
const expositor = document.querySelector(".expositor")

const mobileQuery = 600

let cards


const _keywords = [
    {
        slug: "provocar",
        name: "🛡️Provocar",
        desc: "Fuerza a los rivales a atacar a esta unidad primero."
    },
    {
        slug: "autista",
        name: "🥴Autista",
        desc: "Al recibir un golpe no letal de otra criatura, vuelve a la mano de su propietario."
    },
    {
        slug: "fiestero",
        name: "🥳Fiestero",
        desc: "Al entrar al campo de batalla, otorga +1|+0 al resto de aliados."
    }
]


fetch('./cards.json')
    .then((response) => response.json())
    .then((json) => {
        cards = json
        cards.forEach((card) => {

            // Flip up all already seen cards
            let turn = 'turn'
            
            var nameEQ = "card-" + card.id + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) {
                    turn = ''
                }
            }

            const div = 
                `
                <div class="flip-card-holder">
                    <div class="flip-card-mover">
                        <div class="flip-card-desc-cnt">
                            <h3 class="card-name"><b>${card.name}</b> <span class="card-type">- ${card.type}</span></h3>
                            <div class="flip-card-info"></div>
                        </div>
                        <div class="flip-card card-${card.id} ${turn}" data-card-id="${card.id}">
                            <div class="flip-card-inner">
                                <div class="flip-card-front">
                                    <img src="./Cards/${card.img}" alt="Avatar" style="width:100%;height:100%;" draggable="false">
                                </div>
                                <div class="flip-card-back">
                                    <img src="./Cards/Back.png" alt="Back" style="width:100%;height:100%;" draggable="false">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            $('.expositor').append(div)


            
            const cardEl = document.querySelector(".card-"+card.id)
            cardEl.addEventListener("click", () => {
                selectCard(cardEl)
            })

            if (card.type == "Criatura") checkCreature(card, cardEl.parentElement)
            if (card.type == "Territorio") checkTerritory(card, cardEl.parentElement)
            
            if (window.innerWidth < mobileQuery) {
                cardEl.addEventListener('click', function(ev) {
                    turnCard(cardEl)
                }, false);
            } else {
                cardEl.addEventListener('contextmenu', function(ev) {
                    ev.preventDefault();
                    turnCard(cardEl)
                    return false;
                }, false);
            }

            
            gsap.fromTo("h1 span", {
                y: (window.innerWidth < mobileQuery) ? 30 : 50,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: .8,
                stagger: 0.05,
                onComplete: function() {
                    document.querySelector("h1").classList.add("loaded")
                }
            })

            gsap.fromTo(".contenido-descripcion", {
                y: 20,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: .8,
                delay: .5
            })

            gsap.fromTo(".flip-card", {
                y: 50,
                autoAlpha: 0,
            }, {
                y: 0,
                autoAlpha: 1,
                duration: .4,
                stagger: 0.05,
            });

        })
        
    })

function isCardDownside(card){
    if (card.classList.contains("turn"))
        return true
    return false
}
function turnCard(card){
    card.classList.toggle("turn")
    const id = card.getAttribute('data-card-id');
    document.cookie = `card-${id}=up; expires=Thu, 1 Jan 2024 00:00:00 UTC; path=/`
}

function selectCard(card) {
    if (window.innerWidth < mobileQuery) return

    const mover = card.parentElement

    if (mover.classList.contains("selected")) return;
    mover.classList.add("selected")
    if (isCardDownside(card)) {
        turnCard(card)
    }

    // Center card
    mover.style.position = "absolute"
    mover.style.top = mover.offsetTop+"px"
    mover.style.left = mover.offsetLeft+"px"
    mover.style.zIndex = 1

    let leftOffset
    (window.innerWidth < 1441) ? leftOffset = 400 : leftOffset = 600
    const offsetTopSelected = (window.innerHeight / 2) + document.documentElement.scrollTop - 200
    const offsetLeftSelected = (window.innerWidth / 2) - leftOffset
    mover.style.top = offsetTopSelected+"px"
    mover.style.left = offsetLeftSelected+"px"

    // Prevent scrolling
    document.body.style.overflow = "hidden"

    // Blur the rest of cards
    expositor.classList.add("blur-cards")

    var except = document.getElementById('except');

    
    mover.addEventListener("click", function (ev) {
        ev.stopPropagation(); //this is important! If removed, you'll get both alerts
    }, false);
    
}


global.addEventListener("click", function () {
    if (!expositor.classList.contains("blur-cards")) return

    const cardMoverSelected = document.querySelector(".flip-card-mover.selected")
    cardMoverSelected.style.position = "absolute"
    cardMoverSelected.style.top = cardMoverSelected.parentElement.offsetTop+"px"
    cardMoverSelected.style.left = cardMoverSelected.parentElement.offsetLeft+"px"
    setTimeout(() => {
        if (!cardMoverSelected.classList.contains("selected")) cardMoverSelected.style.zIndex = "unset"
    }, 600);
    cardMoverSelected.classList.remove("selected")
    expositor.classList.remove("blur-cards")

    // Resume scrolling
    document.body.style.overflow = "inherit"
}, false);


// Check for creature values (dmg, hp, keywords)
function checkCreature(card, cardEl) {

    const cardInfo = cardEl.querySelector(".flip-card-info")

    card.dmg != null ? cardInfo.append( document.createElement('h4').innerHTML = "Daño: " + card.dmg ) : null
    cardInfo.append( document.createElement('br') )
    card.hp != null ? cardInfo.append( document.createElement('h4').innerHTML = "Vida: " + card.hp ) : null
    
    if (card.keywords) {
        const div = document.createElement('div')
        div.classList.add("keywords-cnt")

        let listKeywords = '<ul>'
        card.keywords.forEach((keyword) => {
            for (let i = 0; i < _keywords.length; i++) {
                if (_keywords[i].slug == keyword.slug) {
                    listKeywords += '<li>' + "<b>"+_keywords[i].name+"</b>" + ". <span class='keyword-desc'>" + _keywords[i].desc + '</span></li>'
                    break
                }
            }
        })
        listKeywords += '</ul>'
        const titleKeywords = '<h4>Palabras clave:</h4>'
        div.innerHTML = titleKeywords+listKeywords


        cardInfo.append(div)
    }

    return
}

// Check for creature values (description)
function checkTerritory(card, cardEl) {

    const cardInfo = cardEl.querySelector(".flip-card-info")
    
    if (card.desc) {
        const div = document.createElement('div')

        div.innerHTML = "<h4>Habilidad:</h4>" + card.desc


        cardInfo.append(div)
    }

    return
}

document.querySelectorAll("h1 span").forEach((span) => {
    span.addEventListener("click", function() {
        span.style.color = "#"+Math.floor(Math.random()*16777215).toString(16);
    })
})