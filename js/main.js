// window.addEventListener("DOMContentLoaded", function () {});

// const heart = document.querySelector(".heart_btn");
const header = document.querySelector("#header");
const sidebox = document.querySelector(".side_box");

const variableWidth = document.querySelectorAll(".contents_box .contents");
const deligation = document.querySelector(".contents_box");

function deligationFunc(e) {
  let elem = e.target;

  while (!elem.getAttribute("data-name")) {
    elem = elem.parentNode;
    if (elem.nodeName === "BODY") {
      elem = null;
      return;
    }
  }

  let pk = elem.getAttribute("name");
  if (elem.matches('[data-name="heartbeat"]')) {
    $.ajax({
      Method: "POST",
      url: "data/like.json",
      data: { pk },
      dataType: "json",
      success: function (response) {
        let likeCount = document.querySelector("#like-count-37");
        likeCount.innerHTML = "좋아요" + response.like_count + "개";
      },
      error: function (request, status, error) {
        alert("로그인이 필요합니다");
        window.location.replace("https://www.naver.com");
      },
    });
  } else if (elem.matches('[data-name="bookmark"]')) {
    $.ajax({
      Method: "POST",
      url: "data/bookmark.json",
      data: { pk },
      dataType: "json",
      success: function (response) {
        let bookmarkCount = document.querySelector("#bookmark-count-37");
        bookmarkCount.innerHTML = "북마크" + response.bookmark_count + "개";
      },
      error: function (request, status, error) {
        alert("로그인이 필요합니다");
        window.location.replace("https://www.naver.com");
      },
    });
  } else if (elem.matches('[data-name="comment"]')) {
    let content = document.querySelector(
      "#add-comment-post37 > input[type=text]"
    ).value;

    if (content.length > 140) {
      alert(
        "댓글은 최대 140자 입력 가능합니다. 현재 글자수 : " + content.length
      );
      return;
    }
    $.ajax({
      Method: "POST",
      url: "./comment.html",
      data: {
        pk: { pk },
        content: content,
      },
      dataType: "html",
      success: function (data) {
        document
          .querySelector("#comment-list-ajax-post37")
          .insertAdjacentHTML("afterbegin", data);
      },
      error: function (request, status, error) {
        alert("문제가 발생했습니다");
      },
    });
    document.querySelector("#add-comment-post37 > input[type=text]").value = "";
  } else if (elem.matches('[data-name="comment_delete"]')) {
    $.ajax({
      Method: "POST",
      url: "data/delete.json",
      data: {
        pk: { pk },
      },
      dataType: "json",
      success: function (response) {
        if (response.status) {
          let comt = document.querySelector(".comment-detail");
          comt.remove();
        }
      },
      error: function (request, status, error) {
        alert("문제가 발생했습니다.");
        window.location.replace("https://www.naver.com");
      },
    });
  } else if (elem.matches('[data-name="follow"]')) {
    $.ajax({
      Method: "POST",
      url: "data/follow.json",
      data: {
        pk: { pk },
      },
      dataType: "json",
      success: function (response) {
        if (response.status) {
          document.querySelector("input.follow").value = "팔로잉";
        } else {
          document.querySelector("input.follow").value = "팔로워";
        }
      },
      error: function (request, status, error) {
        alert("문제가 발생했습니다.");
        window.location.replace("https://www.naver.com");
      },
    });
  } else if (elem.matches('[data-name="share"]')) {
  } else if (elem.matches('[data-name="more"]')) {
  }

  elem.classList.toggle("on");
}

// heart.addEventListener("click", function () {
//   heart.classList.toggle("on");
// });

function resizeFunc() {
  if (scrollY >= 10) {
    let calcWidth = window.innerWidth * 0.5 + 167;
    sidebox.style.left = calcWidth + "px";
  }

  if (matchMedia("screen and (max-width : 800px").matches) {
    for (let i = 0; i < variableWidth.length; i++) {
      variableWidth[i].style.width = window.innerWidth - 20 + "px";
    }
  } else {
    for (let i = 0; i < variableWidth.length; i++) {
      if (window.innerWidth > 600) variableWidth[i].removeAttribute("style");
    }
  }
}

function scrollFunc() {
  let scrollHeight = scrollY + window.innerHeight + 1;
  let documentHeight = document.body.scrollHeight;

  if (scrollY >= 10) {
    header.classList.add("on");
    if (sidebox) {
      sidebox.classList.add("on");
    }
    resizeFunc();
  } else {
    header.classList.remove("on");
    if (sidebox) {
      sidebox.classList.remove("on");
      sidebox.removeAttribute("style");
    }
  }
  console.log(scrollHeight, documentHeight);
  if (scrollHeight >= documentHeight) {
    let page = document.querySelector("#page").value;
    document.querySelector("#page").value = parseInt(page) + 1;

    callMorePostAjax(page);

    if (page > 5) {
      return;
    }
  }
}

function callMorePostAjax(page) {
  if (page > 5) {
    return;
  }

  $.ajax({
    Method: "POST",
    url: "./post.html",
    data: {
      page,
    },
    dataType: "html",
    success: addMorePostAjax,
    error: function (request, status, error) {
      alert("문제가 발생했습니다.");
      window.location.replace("https://www.naver.com");
    },
  });
}

function addMorePostAjax(data) {
  deligation.insertAdjacentHTML("beforeEnd", data);
}

setTimeout(function () {
  scrollTo(0, 0);
}, 500);

if (deligation) {
  deligation.addEventListener("click", deligationFunc);
}

window.addEventListener("resize", resizeFunc);
window.addEventListener("scroll", scrollFunc);
