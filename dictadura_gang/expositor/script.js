const expositor = document.querySelector(".expositor")
let cards

fetch('./cards.json')
    .then((response) => response.json())
    .then((json) => {
        cards = json
        cards.forEach((card) => {
            const div = 
                `
                <div class="flip-card card-${card.id} turn">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img src="./Cards/${card.img}" alt="Avatar" style="width:100%;height:100%;" draggable="false">
                        </div>
                        <div class="flip-card-back">
                            <img src="./Cards/Back.png" alt="Back" style="width:100%;height:100%;" draggable="false">
                        </div>
                    </div>
                </div>
                `
            $('.expositor').append(div)

            const cardEl = document.querySelector(".card-"+card.id)
            cardEl.addEventListener("click", () => {
                cardEl.classList.toggle("turn")
            })

            var timeout_id = 0,
                hold_time = 1000

            $(".card-"+card.id).mousedown(function() {
                timeout_id = setTimeout(menu_toggle, hold_time);
                
            }).bind('mouseup mouseleave', function() {
                clearTimeout(timeout_id);
            });

            function menu_toggle() {
                console.log("holded")
            }
        })
        
    })



