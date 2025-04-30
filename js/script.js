window.addEventListener("load", () => {
  // 로딩 창
  setTimeout(function () {
    document.documentElement.style.overflow = "auto"; // 스크롤 활성화
    document.querySelector(".loading").style.opacity = "0"; // 페이드아웃 효과

    setTimeout(function () {
      document.querySelector(".loading").style.display = "none"; // 완전히 숨김
    }, 500); // 페이드아웃 후 완전히 숨김
  }, 300); // 0.3초 후 로딩 제거

  //side-bar
  // resize change height - 화면 리사이즈시 높이 변수값 변경
  let screenHeight = window.innerHeight;
  let halfHeight = screenHeight / 2;

  window.addEventListener("resize", () => {
    screenHeight = window.innerHeight;
    halfHeight = screenHeight / 2;
  });

  // Scroll Down Event - 스크롤 다운 이벤트
  const sections = document.querySelectorAll(".section");
  const sectionArrReverse = Array.from(sections).reverse();
  const sideBar = document.querySelector("#sideBar");

  document.addEventListener("DOMContentLoaded", pageIndicate);
  document.addEventListener("scroll", pageIndicate);

  // current section indicate - 현재 섹션위치 추적 및 표시
  function pageIndicate() {
    let height = (window.scrollY || document.documentElement.scrollTop) + halfHeight;
    let currentNav = document.querySelector(".sideBar__link.active"); // 클래스 선택자 수정

    for (let i = 0; i < sectionArrReverse.length; i++) {
      let offsetTop = sectionArrReverse[i].getBoundingClientRect().top + window.scrollY;

      if (height > offsetTop) {
        let postNav = document.querySelector(
          `.sideBar__link[data-link="#${sectionArrReverse[i].id}"]`
        );

        if (!postNav) {
          currentNav?.classList.remove("active");
          return;
        }

        currentNav?.classList.remove("active");
        postNav.classList.add("active");
        break;
      }

      if (
        height <
        sectionArrReverse[sectionArrReverse.length - 1].getBoundingClientRect().top + window.scrollY
      ) {
        currentNav?.classList.remove("active");
      }
    }
  }

  // Scroll To Event (click) - 링크 클릭시 해당 위치로 스크롤 이동 이벤트
  const sideBarNav = document.querySelector(".sideBar__nav");

  sideBarNav.addEventListener("click", (event) => {
    event.preventDefault();
    const target = event.target.closest(".sideBar__link");
    if (!target) return;

    const link = target.dataset.link;
    scrollIntoView(link);
  });

  function scrollIntoView(selector) {
    const scrollInto = document.querySelector(selector);
    if (!scrollInto) return;

    scrollInto.scrollIntoView({
      behavior: "smooth",
      block: "start", // 상단 정렬로 이동 (가로 이동 방지)
    });
  }

  // toggle
  const toggleWrap = document.querySelector("#toggle-wrap");
  const toggleBody = document.querySelector(".toggle-body");
  let isToggle = false;
  const lightIcons = document.querySelectorAll(".toggle-body .light-mode");
  const darkIcons = document.querySelectorAll(".toggle-body .dark-mode");

  function updateTheme() {
    if (isToggle) {
      toggleWrap.classList.add("on");
      toggleBody.classList.add("on");
      document.documentElement.setAttribute("color-theme", "dark");

      darkIcons.forEach((icon) => (icon.style.display = "block"));
      lightIcons.forEach((icon) => (icon.style.display = "none"));

      // ✅ 현재 테마를 localStorage에 저장
      localStorage.setItem("theme", "dark");
    } else {
      toggleWrap.classList.remove("on");
      toggleBody.classList.remove("on");
      document.documentElement.setAttribute("color-theme", "light");

      darkIcons.forEach((icon) => (icon.style.display = "none"));
      lightIcons.forEach((icon) => (icon.style.display = "block"));

      // ✅ 현재 테마를 localStorage에 저장
      localStorage.setItem("theme", "light");
    }
  }

  // ✅ 로컬 저장소에서 'theme' 값을 가져와 초기 상태 설정
  const savedTheme = localStorage.getItem("theme");
  isToggle = savedTheme === "dark"; // 'dark'이면 true, 'light' 또는 없으면 false
  updateTheme();

  // 클릭 이벤트 리스너 추가
  toggleWrap.addEventListener("click", () => {
    isToggle = !isToggle;
    updateTheme();
  });

  // tag 선택시 해당 card만 보이게
  const tagLinks = document.querySelectorAll(".tag-list li a");
  const cards = document.querySelectorAll(".card");

  tagLinks.forEach((tag) => {
    tag.addEventListener("click", function (e) {
      e.preventDefault();
      const filter = this.textContent.trim();

      cards.forEach((card) => {
        const tags = Array.from(card.querySelectorAll(".card-tag .tag-list li a")).map((a) =>
          a.textContent.trim()
        );

        if (filter === "전체" || tags.includes(filter)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // 클릭할 모든 버튼 요소 변수에 저장
  const btns = document.querySelectorAll(".tag-list > li");

  const categoryDefaultBtn = document.querySelectorAll(".tag-list")[1]?.querySelector("li");
  if (categoryDefaultBtn) {
    categoryDefaultBtn.classList.add("on");
  }

  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // 모든 버튼의 클래스 "on" 제거
      btns.forEach((el) => el.classList.remove("on"));

      // 클릭한 번튼만 "on" 추가
      e.currentTarget.classList.add("on");
    });
  });

  // 페이지네이션
  let pagination = document.getElementById("pagination");
  let cardsPerPage = getCardsPerPage();
  let currentPage = 1;

  function getCardsPerPage() {
    const width = window.innerWidth;

    if (width <= 480) {
      return 4;
    } else if (width <= 768) {
      return 6;
    } else {
      return 12; // 기본 (1200px 이상일 때)
    }
  }

  function showPage(page) {
    let start = (page - 1) * cardsPerPage;
    let end = start + cardsPerPage;

    cards.forEach((card, index) => {
      card.style.display = index >= start && index < end ? "block" : "none";
    });

    document.querySelectorAll(".number a").forEach((btn) => btn.classList.remove("active"));
    const currentBtn = document.getElementById(`page-${page}`);
    currentBtn?.classList.add("active");
    // document.getElementById(`page-${page}`).classList.add("active");
  }

  function setupPagination() {
    pagination.innerHTML = "";
    let pageCount = Math.ceil(cards.length / cardsPerPage);
    for (let i = 1; i <= pageCount; i++) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.href = "#";
      a.id = `page-${i}`;
      a.innerText = i;
      a.addEventListener("click", function (event) {
        event.preventDefault();
        currentPage = i;
        showPage(currentPage);
      });
      li.appendChild(a);
      pagination.appendChild(li);
    }
  }
  // 초기 실행
  setupPagination();
  showPage(currentPage);

  // 화면 크기 변경 시 cardPerPage 재설정
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCardsPerPage = getCardsPerPage();
      if (newCardsPerPage !== cardsPerPage) {
        cardsPerPage = newCardsPerPage;

        const maxPage = Math.ceil(cards.length / cardsPerPage);
        if (currentPage > maxPage) {
          currentPage = 1;
        }
        setupPagination();
        showPage(currentPage); // 첫 페이지로 초기화 (선택사항)
      }
    }, 200);

    // img-slide
    const slideList = new Swiper(".slide-list", {
      speed: 1000,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    // swiper mouseover event
    const autoPlay = document.querySelector(".slide-list");
    autoPlay.addEventListener("mouseover", () => {
      slideList.autoplay.stop();
    });
    autoPlay.addEventListener("mouseout", () => {
      slideList.autoplay.start();
    });

    window.addEventListener("scroll", function () {
      scrollMotion();

      function scrollMotion() {
        const elements = document.querySelectorAll(".myinfo ul"); // querySelectorAll로 변경
        if (elements.length === 0) return; // 요소가 없을 경우 함수 종료

        const eleOffset = elements[0].getBoundingClientRect().top + window.scrollY - 700;

        if (window.scrollY > eleOffset) {
          elements.forEach((ele, idx) => {
            setTimeout(() => {
              ele.style.cssText = "opacity: 1; transform: translateY(0);"; // transform 수정
            }, 180 * idx);
          });
        } else {
          elements.forEach((ele, idx) => {
            setTimeout(() => {
              ele.style.cssText = "opacity: 0; transform: translateY(50px);"; // opacity, transform 수정
            }, 180 * idx);
          });
        }
      }
    });
  });
});
