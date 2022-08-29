const images = document.querySelectorAll('.slide-image')

const dots = document.querySelectorAll('.dots div')
const array_dots = Array.from(dots)
const default_activeDot = document.querySelector('.dot-active')

const sliderLine = document.querySelector('.slider-line')
const sliderLine_gap = +(window.getComputedStyle(document.querySelector('.slider-line')).gap.replace('px', ''))

const arrowLeft = document.querySelector('.arrow-to-left')
const arrowRight = document.querySelector('.arrow-to-right')

let offsetLeft = 0

function returnCurrentSlideWidth(){
    return +(window.getComputedStyle(document.querySelector('.slide-image')).width.replace('px', ''))
}
function returnOffset_byDirection(direction){
    return direction === 'right'? offsetLeft : -offsetLeft
}
function returnActiveDot_index(){
    const active_dot = document.querySelector('.dot-active')
    return array_dots.indexOf(active_dot)
}
function returnNextDotBy(activeDot_index, direction){
    let nextDot_index
    if(direction === 'right'){
        nextDot_index = activeDot_index+1
    } else {
        nextDot_index = activeDot_index-1
    }

    return array_dots[nextDot_index]
}

function isWidthSwapBiggerThenFreePlace(direction){
    return returnOffset_byDirection(direction) > (returnCurrentSlideWidth()*images.length)/2
}
function isLastOrFirstDot(nextDot) {
    const isLastDot = array_dots.indexOf(nextDot) === array_dots.length - 1
    const isFirstDot = array_dots.indexOf(nextDot) === 0

    if(isLastDot){
        arrowLeft.style.position = 'static'
    } else if(isFirstDot){
        arrowRight.style.position = 'static'
    }

    return isLastDot || isFirstDot
}
function removeActiveFromDots(){
    array_dots.forEach(dot => dot.classList.remove('dot-active'))
}

function setOffset(direction){
    if(direction === 'right'){
        offsetLeft = offsetLeft + returnCurrentSlideWidth()+sliderLine_gap
    } else {
        offsetLeft = offsetLeft - returnCurrentSlideWidth()-sliderLine_gap
    }
}
function setDefaultDot(){
    removeActiveFromDots()
    default_activeDot.classList.add('dot-active')
}
function setDefaultSlide(){
    sliderLine.style.left = 0
    offsetLeft = 0
}


function swapDot(next_dot){
    const active_dot = document.querySelector('.dot-active')
    active_dot.classList.remove('dot-active')

    if(next_dot) next_dot.classList.add('dot-active')
}
function swapSlideTo(direction){
    const nextDot = returnNextDotBy(returnActiveDot_index(), direction)

    setOffset(direction)
        
    if(isWidthSwapBiggerThenFreePlace(direction)) {
        setDefaultSlide()
        setDefaultDot()
        moveArrowsByDefault()
    } else swapDot(nextDot)
    
    sliderLine.style.left = -offsetLeft + 'px'
 
    isLastOrFirstDot(nextDot) ? moveArrowsCloser(direction) : moveArrowsByDefault()
}
function swapSlideTo_byDot(width, direction){
    const active_dot = document.querySelector('.dot-active')

    if(direction ==='right'){
        offsetLeft = offsetLeft + width  
    } else {
        offsetLeft = offsetLeft - width
    }

    sliderLine.style.left = -offsetLeft + 'px'

    isLastOrFirstDot(active_dot) ? moveArrowsCloser(direction) : moveArrowsByDefault()
}

function howMuchSlidesListed(baseIndex, clickedIndex){
    if(baseIndex === clickedIndex) return 0

    return Math.abs(clickedIndex - baseIndex)
}

function moveArrowsByDefault(){
    arrowRight.style.position = 'static'
    arrowLeft.style.position = 'static'
}
function moveArrowsCloser(direction){
    let width
    if(direction === 'right'){
        width = - returnCurrentSlideWidth() - sliderLine_gap
        arrowRight.style.position = 'relative'
        arrowRight.style.left = width + 'px'
    } else {
        width = returnCurrentSlideWidth() + sliderLine_gap
        arrowLeft.style.position = 'relative'
        arrowLeft.style.left = width + 'px'
    }
}

document.querySelector('.dots').addEventListener('click', () => {
    if(!event.target.classList.contains('dot')) return

    const idexOfClickedDot = array_dots.indexOf(event.target)
    const active_dot = document.querySelector('.dot-active')
    
    const countOfSlides = howMuchSlidesListed(array_dots.indexOf(active_dot), idexOfClickedDot)
    const direction = idexOfClickedDot > array_dots.indexOf(active_dot) ? 'right' : 'left'
    removeActiveFromDots()
    event.target.classList.add('dot-active')
    
    const width = (returnCurrentSlideWidth() + sliderLine_gap) * countOfSlides

    swapSlideTo_byDot(width, direction)
})

document.querySelector('.arrow-to-right').addEventListener('click', () => swapSlideTo('right') )
document.querySelector('.arrow-to-left').addEventListener('click', () => swapSlideTo('left') )

window.addEventListener('resize', () => {
    removeActiveFromDots()
    setDefaultDot()
    setDefaultSlide()
    moveArrowsByDefault()
})