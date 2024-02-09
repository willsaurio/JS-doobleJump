document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div')
    let isGameOver = false;
    let platformCount = 5
    let platforms = []
    let score = 0
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerButtonSpace = 150
    let isJumping = true
    let upTimerId
    let downTimerId
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId

    class Platform {
        constructor(newPlantBottom) {
            this.left = Math.random() * 315
            this.bottom = newPlantBottom
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }

    }
    
     function createPlatform() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatGap = 100 +   i * platGap
            let newPlatform = new Platform(newPlatGap)
            platforms.push(newPlatform)
            console.log(platforms)
        }
     }   
     
      function movePlatforms() {
          if (doodlerButtonSpace > 200) {
              platforms.forEach(platforms => {
                  platforms.bottom -= 4
                  let visual = platforms.visual
                      visual.style.bottom = platforms.bottom + 'px'

                  if(platforms.bottom<10){
                      let firstPlatform = platforms [0].visual
                      firstPlatform.classList.remove('platform')
                      platforms.shift()
                      score++
                      let newPlatform = new Platform(600)
                      platforms.push(newPlatform)
                  }
              })
          }
      }

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerButtonSpace + 'px'
    }
    
    function fall() {
        isJumping = false
        clearTimeout(upTimerId)
        downTimerId = setTimeout(() => {
            doodlerButtonSpace -= 5
            doodler.style.bottom = doodlerButtonSpace + 'px'
            if (doodlerButtonSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerButtonSpace >= platform.bottom) &&
                    (doodlerButtonSpace <= (platform.left + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left)&&
                    (doodlerLeftSpace <=(platform.left + 85)) &&
                    !isJumping
                ){
                    startPoint = doodlerButtonSpace
                    jump()
                    console.log('startPoint'. startPoint)
                }
            })
        }, 20)
    }
    fall()

    function jump(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setTimeout(() => {
            doodlerButtonSpace += 20
            doodler.style.bottom = doodlerButtonSpace + 'px'
            if(doodlerButtonSpace > startPoint + 200){
                fall()
                isJumping = false
            }
        }, 30)
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() =>{
            if(doodlerLeftSpace >= 0){
                console.log('going left')
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }else moveRight()
        }, 20)
    }

    function moveRight() {
        if(isGoingRight){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingLeft = true
        rightTimerId = setInterval(() =>{
           if(doodlerLeftSpace <= 313){
               console.log('going right')
               doodlerLeftSpace +=5
               doodler.style.left = doodlerLeftSpace + 'px'
           }else moveLeft()
        }, 20)
    }


    function moveStraight (){
        isGoingLeft = false
        isGoingRight = true
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control (e){
        doodler.style.bottom = doodlerButtonSpace + 'px'
        if(e.key === 'ArrowLeft'){
            moveLeft()
        }else if (e.key === 'ArrowRight'){
            moveRight()
        }else if(e.key === 'ArrowUp'){
            moveRight()
        }
    }
    
    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
           grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(downTimerId)
        clearTimeout(upTimerId)
        clearTimeout(leftTimerId)
        clearTimeout(rightTimerId)
    }
    function start() {
        if(!isGameOver){
            createPlatform()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()
})