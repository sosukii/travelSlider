const images = document.querySelectorAll('.slider-line > .slide > img')

const dots = document.querySelectorAll('.dots div')
const array_dots = Array.from(dots)
const default_activeDot = document.querySelector('.dot-active')

const sliderLine = document.querySelector('.slider-line')
const sliderLine_gap = +(window.getComputedStyle(document.querySelector('.slider-line')).gap.replace('px', ''))

const arrowLeft = document.querySelector('.arrow-to-left')
const arrowRight = document.querySelector('.arrow-to-right')

let offsetLeft = 0

function isLastOrFirstDot(nextDot) {
    return array_dots.indexOf(nextDot) === array_dots.length - 1 || array_dots.indexOf(nextDot) === 0
}

function returnCurrentSlideWidth(){
    return +(window.getComputedStyle(document.querySelector('.slider-line > .slide > img')).width.replace('px', ''))
}
function setOffset(direction){
    offsetLeft = direction === 'right'
        ? offsetLeft + returnCurrentSlideWidth()+sliderLine_gap
        : offsetLeft - returnCurrentSlideWidth()-sliderLine_gap
}
function returnOffset_byDirection(direction){
    return direction === 'right'? offsetLeft : -offsetLeft
}
function isWidthSwapBiggerThenFreePlace(direction){
    return returnOffset_byDirection(direction) > (returnCurrentSlideWidth()*images.length)/2
}
function removeActiveFromDots(){
    array_dots.forEach(dot => dot.classList.remove('dot-active'))
}

function setDefaultDot(){
    default_activeDot.classList.add('dot-active')
}
function setDefaultSlide(){
    sliderLine.style.left = 0
    offsetLeft = 0
}



function swapSlideTo(direction){
    const active_dot = document.querySelector('.dot-active')

    // высчитываем оффсет
    setOffset(direction)
        
    if(isWidthSwapBiggerThenFreePlace(direction)) {
        setDefaultSlide()
        setDefaultDot()
        moveArrowsByDefault()
    }

    // двигаем слайдерлайн
    sliderLine.style.left = -offsetLeft + 'px'
    
    // получаем индекс эктив дот, двигаем дот
    const active_dot_index = array_dots.indexOf(active_dot)
    active_dot.classList.remove('dot-active')
    const nextDot_index = direction === 'right'
        ?  active_dot_index+1 
        :  active_dot_index-1 
    const nextDot = array_dots[nextDot_index]

    if(nextDot) nextDot.classList.add('dot-active')
 
    // двигаем стрелки
    isLastOrFirstDot(nextDot)
        ? moveArrowsCloser(direction)
        : moveArrowsByDefault()
}
function swapSlideTo_byDot(width, direction){
    const active_dot = document.querySelector('.dot-active')

    offsetLeft = direction ==='right'
    ? offsetLeft + width
    : offsetLeft - width

    sliderLine.style.left = -offsetLeft + 'px'

    isLastOrFirstDot(active_dot)
        ? moveArrowsCloser(direction)
        : moveArrowsByDefault()
}

function howMuchSlidesListed(baseIndex, clickedIndex){
    if(baseIndex === clickedIndex) return 0
    return clickedIndex > baseIndex ? clickedIndex - baseIndex : baseIndex - clickedIndex
}
function moveArrowsByDefault(){
    arrowRight.style.position = 'static'
    arrowLeft.style.position = 'static'
}
function moveArrowsCloser(direction){
    const width = direction === 'right'
        ? - returnCurrentSlideWidth() - sliderLine_gap
        : returnCurrentSlideWidth() + sliderLine_gap

    if(direction === 'right'){
        arrowRight.style.position = 'relative'
        arrowRight.style.left = width + 'px'
    } else{
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
})