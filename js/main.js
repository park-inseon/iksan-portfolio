let platform = null;

const body = document.body,
      doc = document.documentElement,
      section = document.querySelectorAll('main > section');
let scrollTimer = 0;

const scrollMenu = document.getElementById('scrollMenu'),
      scrollMenuBar = scrollMenu.getElementsByTagName('li'),
      header = document.getElementById('header'),
      gnb = document.getElementById('pcMenu'),
      gnbMenu = gnb.getElementsByClassName('gnb__item'),
      lnb = gnb.getElementsByClassName('.lnb');

const hamburgerBtn = document.getElementById('hamburger'),
      mobileMenu = document.getElementById('mobileMenu'),
      mobile1DBtn = mobileMenu.getElementsByClassName('mobile-menu__btn-1d'),
      mobile1DList = mobileMenu.getElementsByClassName('mobile-menu__list-1d'),
      mobile2DBtn = mobileMenu.getElementsByClassName('mobile-menu__btn-2d'),
      mobile2DList = mobileMenu.getElementsByClassName('mobile-menu__list-2d');
let active1DBtn = null,
    active2DBtn = null;

const calMonth = document.getElementById('thisMonth'),
      calBody = document.getElementById('calBody');
let currentDate = new Date(),
    currentYear = currentDate.getFullYear(),
    currentMonth = currentDate.getMonth()+1, //0부터 시작
    firstDate = new Date(currentYear, currentMonth-1, 1),
    lastDate = new Date(currentYear, currentMonth, 0),
    firstDay = firstDate.getDay(), //요일 0:일요일
    holiday = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30];

let windowBeforeWidth = window.innerWidth;
let mainSlide = {
    slideShow: document.getElementById('mainSlide'),
    slider: document.getElementById('mainSlider'),
    slides: document.getElementsByClassName('main-slide__item'),
    pager: document.getElementById('mainPager'),
    pagerBtn: 0,
    controlBtn: document.getElementById('mainControls'),
    slideCount: document.querySelectorAll('#mainSlider li').length, //원본 슬라이드 개수
    currentSlide: 0, //현재 슬라이드 인덱스
    startCount: 0, //원본 슬라이드 시작 인덱스
    endCount: document.querySelectorAll('#mainSlider li').length-1, //원본 슬라이드 마지막 인덱스
    showNum: 1,
    timer: 0
};

let subSlide = {
    slideShow: document.getElementById('subSlide'),
    slider: document.getElementById('subSlider'),
    slides: document.querySelectorAll('#subSlider li')
};

let exSlide = {
    slideShow: document.getElementById('collectSlide'),
    slider: document.getElementById('collectSlider'),
    slides: document.querySelectorAll('#collectSlider li'),
    pager: document.getElementById('collectPager'),
    pagerBtn: 0,
    controlBtn: document.getElementById('collectControls'),
    moveBtn: document.getElementById('collectMove'),
    slideCount: document.querySelectorAll('#collectSlider li').length,
    currentSlide: 0,
    startCount: 0,
    endCount: document.querySelectorAll('#collectSlider li').length-1,
    showNum: 4,
    timer: 0
};

init();

function init(){    
    checkPlatform();
    
    window.addEventListener('scroll', handleScrollPage);
    [].forEach.call(scrollMenuBar, function(elem, idx){
        elem.addEventListener('click', function(event){
           event.preventDefault();
           moveToSection(idx);
        });
    });
    
    //PC 메뉴
    [].forEach.call(gnbMenu, function(elem){
        elem.addEventListener('mouseover', showMenu);
    });  
    
    //메인 슬라이드
    cloneFirstSlide(mainSlide);
    setSliderHeight(mainSlide);
    createSlidePager(mainSlide);
    handleSlideControlBtn(mainSlide);
    autoSlideTimer(mainSlide);
    
    //서브 슬라이드
    setSliderHeight(subSlide);
    
    //전시 슬라이드
    cloneLastSlide(exSlide);
    cloneFirstSlide(exSlide);
    setSliderHeight(exSlide);
    createSlidePager(exSlide);
    handleSlideControlBtn(exSlide);
    handleSlideMoveBtn(exSlide);
    autoSlideTimer(exSlide);
    
    window.addEventListener('resize', handleWindowResize);
    
    setCalendar();
}

function checkPlatform(){
    let filter = 'win16|win32|win64|mac|macintel';
    if(navigator.platform){
        if(filter.indexOf(navigator.platform.toLowerCase())<0){
            platform = 'mobile';
            addMobileMenuEvent(); //모바일 메뉴
            changeToMobileSlide(); //모바일 슬라이드
        } else {
            platform = 'pc';
            //모바일 메뉴
            if(window.innerWidth <= 768) {
                addMobileMenuEvent();
            }
        }
    }
}

function addMobileMenuEvent(){
    hamburgerBtn.addEventListener('click', showMobileMenu);
    [].forEach.call(mobile1DBtn, function(elem){
        elem.addEventListener('click', handle1DMenu);
    });
    [].forEach.call(mobile2DBtn, function(elem){
        elem.addEventListener('click', handle2DMenu);
    });
}

function removeMobileMenuEvent(){
    hamburgerBtn.removeEventListener('click', showMobileMenu);
}

function changeToMobileSlide(){
    let image;
    let slides = mainSlide.slideShow.getElementsByClassName('slideshow__slide');
    [].forEach.call(slides, function(elem){
        image = elem.querySelector('img'),
        image.src = image.src.replace('banner_','banner_mo_');
        image.style.width = '100%';
    });
    image.onload = function(){
       setSliderHeight(mainSlide);
    };
}

function handleWindowResize(event){
    if(window.innerWidth <= 768) {
        addMobileMenuEvent();
    } else{
        removeMobileMenuEvent();
    }
    
    if(window.innerWidth <= 768 || windowBeforeWidth <= 768){
        setSliderHeight(mainSlide);
        setSliderHeight(subSlide);
        windowBeforeWidth = window.innerWidth;
    }    
}

function handleScrollPage(event){
    event.preventDefault();
    handleScrollMenu(window.pageYOffset); //IE scrollY 미지원
}

function handleScrollMenu(scroll){
    [].forEach.call(section, function(elem, idx){
        let range = elem.offsetHeight/2;
        if(elem.offsetTop-range <= scroll){
           [].forEach.call(scrollMenuBar, function(elem){
               elem.classList.remove('active');
           })
           scrollMenuBar[idx].classList.add('active');
       }
    });
}

function moveToSection(idx){
    let targetPos = section[idx].offsetTop;
    let distance = Math.abs(section[idx].offsetTop-window.pageYOffset),
        time = 15,
        speed = distance / time;

    if(!scrollTimer){
        if(window.pageYOffset < targetPos){ //아래로 스크롤
            scrollTimer = setInterval(function(){
                window.scrollBy(0, speed);
                //목표 section에 도달했거나 최하단에 닿았을 때
                if(window.pageYOffset >= targetPos || doc.scrollHeight-doc.scrollTop === doc.clientHeight){
                    clearInterval(scrollTimer);
                    scrollTimer = 0;
                }
            }, time);
        } else if(window.pageYOffset > targetPos){ //위로 스크롤
            scrollTimer = setInterval(function(){
                window.scrollBy(0, -speed);
                if(window.pageYOffset <= targetPos){
                    clearInterval(scrollTimer);
                    scrollTimer = 0;
                }
            }, time);
        }
    }
}

function showMenu(event){
    let target = event.currentTarget;
    gnb.classList.add('show');
    [].forEach.call(gnbMenu, function(elem){
        elem.classList.remove('over');
    });
    target.classList.add('over');
}

function hideMenu(){
    gnb.classList.remove('show');
    [].forEach.call(gnbMenu, function(elem){
        elem.classList.remove('over');
    });
}

//모바일 메뉴
function showMobileMenu(event){
    event.preventDefault();
    
    if(mobileMenu.classList.contains('show')){
        resetActiveMenu();
        body.classList.remove('dimmed');
        mobileMenu.classList.remove('show');
    } else{
        let height = window.innerHeight - gnb.offsetHeight;        
        body.classList.add('dimmed');        
        mobileMenu.style.height = height+'px';
        mobileMenu.classList.add('show');
    }
}

function handle1DMenu(event){
    let panel = this.nextElementSibling;
    
    if(this.classList.contains('active')){
        this.classList.remove('active');
        active1DBtn = null;
        panel.style.maxHeight = null;
    } else{
        resetActiveMenu();
        this.classList.add('active');
        active1DBtn = this;
        panel.style.maxHeight = panel.scrollHeight+'px';
    }
}

function handle2DMenu(event){
    let panel = this.nextElementSibling;
    let parentPanel = this.parentElement.parentElement;

    if(this.classList.contains('active')){
        this.classList.remove('active');
        active2DBtn = null;
        parentPanel.style.maxHeight = (parentPanel.scrollHeight-panel.scrollHeight)+'px';
        panel.style.maxHeight = null;
    } else{
        this.classList.add('active');
        active2DBtn = this;
        panel.style.maxHeight = panel.scrollHeight+'px';
        parentPanel.style.maxHeight = (parentPanel.scrollHeight+panel.scrollHeight)+'px';  
    }
}

//펼쳐진 메뉴 초기화
function resetActiveMenu(){
    if(active1DBtn){
        active1DBtn.classList.remove('active');
        active1DBtn.nextElementSibling.style.maxHeight = null;
        active1DBtn = null;
        if(active2DBtn){
            active2DBtn.classList.remove('active');
            active2DBtn.nextElementSibling.style.maxHeight = null;
            active2DBtn = null;
        }
    }
}

//첫 슬라이드 복제 생성
function cloneLastSlide(targetSlide){
    for(let i=0; i<targetSlide.showNum; i++){
        let lastClone = targetSlide.slides[targetSlide.endCount-i].cloneNode(true); 
        let targetSlider = targetSlide.slider,
            firstSlide = targetSlider.firstElementChild;
        
        targetSlide.slider.insertBefore(lastClone, firstSlide);
    }    
    targetSlide.currentSlide += targetSlide.showNum;
    targetSlide.startCount += targetSlide.showNum;
    targetSlide.endCount += targetSlide.showNum;
    
    //시작 위치 이동
    targetSlide.slider.style.left = -targetSlide.slideShow.offsetWidth + 'px';
}

//끝 슬라이드 복제 생성
function cloneFirstSlide(targetSlide){
    for(let i=0; i<targetSlide.showNum; i++){
        let firstClone = targetSlide.slides[i].cloneNode(true);
        targetSlide.slider.appendChild(firstClone);
    }
}

//슬라이드 높이 설정
function setSliderHeight(targetSlide){ 
    let height = 0;
    let display = window.getComputedStyle(targetSlide.slideShow).display;
    //forEach, Array.from() IE 지원
    [].forEach.call(targetSlide.slides, function(elem, idx){
        let image = elem.querySelector('img');
        if(!image.complete){
            image.onload = function() {
                setSliderHeight(targetSlide);
            };
        }
        if(display == 'none'){    
            //이미지를 렌더하지 않아 높이값 0을 반환하기 때문에 실제 이미지 크기를 얻어옴
            if(image.naturalHeight > height){
                height = image.naturalHeight;
            }
        } else{
            if(image.offsetHeight > height){
                height = image.offsetHeight
            }
        }
    });
    targetSlide.slideShow.style.height = height + 'px';
    targetSlide.slider.style.height = height + 'px';
}

//페이저 생성
function createSlidePager(targetSlide){
    let start = targetSlide.startCount;
    let count = targetSlide.endCount;
    for(let i=start; i<=count; i++){
        if(i%targetSlide.showNum == 0){
            let li = document.createElement('li');
            li.classList.add("slideshow__page");
            if(i==start){
                li.classList.add('active');
            }
            let btn = document.createElement('button');
            btn.classList.add('slideshow__page-btn');
            btn.setAttribute('data-idx', i);
            btn.addEventListener('click', function(event){
                handleSlidePager(targetSlide, this);
            });
            li.appendChild(btn);
            targetSlide.pager.appendChild(li);
        }
    }
    targetSlide.pagerBtn = targetSlide.pager.querySelectorAll('li');
}

//페이저 클릭 이벤트
function handleSlidePager(targetSlide, target){
    let idx = target.dataset.idx;
    moveSlide(targetSlide, idx);
}

//슬라이드 컨트롤 버튼 동작
function handleSlideControlBtn(targetSlide){
    targetSlide.controlBtn.addEventListener('click', function(event){
        let target = event.currentTarget;
        if(target.classList.contains('play')){   
            target.classList.remove('play');
            target.classList.add('pause');
            clearInterval(targetSlide.timer);
        } else{
            target.classList.remove('pause');
            target.classList.add('play');
            autoSlideTimer(targetSlide);
        }
    });
}

//슬라이드 좌우 이동 버튼
function handleSlideMoveBtn(targetSlide){
    let target = targetSlide.moveBtn;
    let prevBtn = target.querySelector('.slideshow__prev');
    let nextBtn = target.querySelector('.slideshow__next');
    
    prevBtn.addEventListener('click', function(){
        moveSlide(targetSlide, targetSlide.currentSlide-targetSlide.showNum);
    });    
    nextBtn.addEventListener('click', function(){
        moveSlide(targetSlide, targetSlide.currentSlide+targetSlide.showNum);
    });
}

//슬라이드 이동
function moveSlide(targetSlide, idx){
    let width = targetSlide.slideShow.offsetWidth/targetSlide.showNum;
    let currentIdx;
    
    targetSlide.slider.style.transition = 'left 0.3s';    
    if(idx > targetSlide.endCount){ //첫 슬라이드로 이동
        setTimeout(function(){
            targetSlide.slider.style.transition = '';
            targetSlide.slider.style.left = -targetSlide.startCount*width+'px';
        }, 300);
        targetSlide.slider.style.left = -idx*width+'px';
        currentIdx = targetSlide.startCount;
    } else if(idx < targetSlide.startCount){ //마지막 슬라이드로 이동
        //마지막 요소까지 포함하기 위해 +1 
        let lastSlideIdx = targetSlide.endCount-targetSlide.showNum+1;
        setTimeout(function(){
            targetSlide.slider.style.transition = '';
            targetSlide.slider.style.left = -lastSlideIdx*width+'px';
        }, 300);
        targetSlide.slider.style.left = 0;
        currentIdx = lastSlideIdx;
    } else{ //슬라이드 이동
        targetSlide.slider.style.left = -idx*width+'px';
        currentIdx = idx;
    }
    //현재 페이지 표시
    targetSlide.currentSlide = currentIdx;
    [].forEach.call(targetSlide.pagerBtn, function(elem){
        elem.classList.remove('active');
    });
    let num = (currentIdx-targetSlide.startCount)/targetSlide.showNum;
    targetSlide.pagerBtn[num].classList.add('active');
}

//자동 슬라이드
function autoSlideTimer(targetSlide){
    targetSlide.timer = setInterval(function(){
        let count = parseInt(targetSlide.currentSlide)+parseInt(targetSlide.showNum);
        moveSlide(targetSlide, count);
    }, 3000);
}

//캘린더 생성
function setCalendar(){
    //연도, 월 표시
    if(currentMonth < 10){
        calMonth.innerHTML = currentYear+'.0'+currentMonth;
    } else{
        calMonth.innerHTML = currentYear+'.'+currentMonth;
    }

    let week = Math.ceil((lastDate.getDate()+firstDay)/7), //n주
        last = lastDate.getDate(),
        count = 1,
        start = 0; //일요일부터 시작

    //날짜 출력
    for(let i=0; i<week; i++){
        if(i==0){ //첫번째 주
            let tableRow = document.createElement('tr');
            for(j=0; j<7; j++){
                if(start < firstDay){
                    setCalDate(tableRow, '');
                    start++;
                } else{
                    setCalDate(tableRow, count);
                    count++;
                }
            }
            calBody.appendChild(tableRow);
        } else{
            let tableRow = document.createElement('tr');
            for(j=0; j<7; j++){
                if(count <= last)
                    setCalDate(tableRow, count);
                    count++;
            }
            calBody.appendChild(tableRow);
        }
    }
}

//캘린더 날짜 생성
function setCalDate(tr, num){
    let tableCell = document.createElement('td'),
        cellTxt = document.createElement('span');
    tableCell.classList.add('calender__date');
    cellTxt.classList.add('calender__num');
    
    holiday.forEach(function(elem, idx){
        if(holiday[idx] == num){
            cellTxt.classList.add('calender__holiday');
        }
    });
    cellTxt.innerHTML = num;
    tableCell.appendChild(cellTxt);
    tr.appendChild(tableCell);
}
