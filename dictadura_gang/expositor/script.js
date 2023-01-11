const global = document.querySelector(".global");
const expositor = document.querySelector(".expositor")

const mobileQuery = 600

let cards

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
                            <h3>${card.name}</h3>
                            <h3>${card.type}</h3>
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

            

            gsap.fromTo(".flip-card", {
                y: 50,
                opacity: 0,
              }, {
                y: 0,
                opacity: 1,
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

    const offsetTopSelected = (window.innerHeight / 2) + document.documentElement.scrollTop - 200
    const offsetLeftSelected = (window.innerWidth / 2) - 600

    mover.style.top = offsetTopSelected+"px"
    mover.style.left = offsetLeftSelected+"px"

    // Set description background
    /* const descCont = mover.querySelector(".flip-card-desc-cnt ")
    descCont.style.top = document.documentElement.scrollTop+"px"
    descCont.style.left = "0px" */

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
        cardMoverSelected.style.zIndex = "unset"
    }, 600);
    cardMoverSelected.classList.remove("selected")
    expositor.classList.remove("blur-cards")

    // Resume scrolling
    document.body.style.overflow = "inherit"
}, false);