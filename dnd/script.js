let dataScript = null
$.getJSON("https://bitcente.github.io/dnd/script_01.json", function (data) {
    dataScript = data
})

var audioStart = new Audio('./sounds/click.mp3');

const animDuration = 1.2
const globalElement = document.querySelector(".global")
const fullScript = []
const answers = []

const startExperience = () => {
    gsap.to(".starter",{
        opacity: 0,
        display: "none",
        duration: animDuration,
        delay: .2
    })
    gsap.to(".start-text",{
        letterSpacing:70,
        duration: 2.5,
        ease: "power1.out"
    })
    gsap.fromTo("#char_picker",
    {
        display: "none"
    },
    {
        opacity: 1,
        display: "grid",
        duration: animDuration,
        delay: 3
    })

    
    var audioBackground = new Audio('./sounds/background.mp3');
    audioBackground.play();
    audioStart.play();

}

const run = (player) =>
{
    if (dataScript !== null) {
        gsap.to("#char_picker",{
            opacity: 0,
            display: "none",
            duration: animDuration
        })


        dataScript[player].forEach(line =>
        {
            fullScript.push(line)
        })

        setTimeout(() => {
            startScript(fullScript)
        }, 4000);
    }
}

let delayChain = 0
let iterator = 0

const startScript = (script) =>
{
    showLine()
}

const showLine = () =>
{

    const centerDiv = document.createElement("div")
    centerDiv.classList.add("center")
    centerDiv.style.opacity = 0

    if (fullScript[iterator])
    {

        if (fullScript[iterator].text != null)
        {
            const text = document.createTextNode(fullScript[iterator].text)
            centerDiv.appendChild(text)
            
            globalElement.appendChild(centerDiv)
    
            gsap.to(centerDiv, {
                opacity: 1,
                duration: animDuration,
            })
            gsap.to(centerDiv, {
                opacity: 0,
                duration: animDuration,
                delay: Number(fullScript[iterator].time),
                onComplete: () => {
                    nextLine()
                }
            })
        } 
        else if (fullScript[iterator].options != null)
        {
            const optionContainer = document.createElement("div")
            optionContainer.classList.add('option-container')
    
            fullScript[iterator].options.forEach(option => {
                
                const optionButton = document.createElement("div")
                optionButton.classList.add('btn')
    
                const text = document.createTextNode(option.name)
                optionButton.appendChild(text)
    
                optionContainer.appendChild(optionButton)
    
                optionButton.addEventListener("click", (e) => {
                    let iteratorOption = iterator
                    answers.push(e.target.innerHTML)
                    option.texts.forEach((option) => {
                        fullScript.splice(iteratorOption+1, 0, option);
                        iteratorOption++
                    })
                    gsap.to(centerDiv, {
                        opacity: 0,
                        duration: animDuration,
                        onComplete: () => {
                            nextLine()
                        }
                    })
                })
                
            });
    
            centerDiv.appendChild(optionContainer)
            globalElement.appendChild(centerDiv)
    
            gsap.to(centerDiv, {
                opacity: 1,
                duration: animDuration,
            })
        }

    }
    else
    {

        const text = document.createTextNode("Has respondido: "+answers.join(", "))
        centerDiv.appendChild(text)
        
        globalElement.appendChild(centerDiv)

        gsap.to(centerDiv, {
            opacity: 1,
            duration: animDuration,
        })

    }

}

const nextLine = () =>
{
    iterator++
    showLine()
}
