let result;
let view = 8
let more_view = 2;
let comments = document.querySelector('.comments');
let input = document.querySelectorAll('.input');
let all = document.querySelector('.all');
let pupils = document.querySelector('.pupils');
let parents = document.querySelector('.parents');
let graduate = document.querySelector('.graduate');
let ratting = document.querySelector('.ratting');
let rating = document.getElementById("rating");
let comment = null; // document.querySelectorAll('.comment');


async function main() {
    result = await fetch('/api/comments/').then(res => res.json());
    console.log(result);
    build_comm(result.slice(0, view))
};

function build_comm(info) {
    for (let CommBs of info) {
        comments.innerHTML += `
        <div class="comment stars${CommBs.mark}">
            <div class='user_info'>
                <img src='${CommBs.image}' class='image'>
                <div class="info_wrapper">
                    <p class="user_name">${CommBs.first_name} ${CommBs.second_name}</p>
                    <p class="permission">${CommBs.permission}</p>
                </div>
                <div class="stars"> 
                    <p class='ball'>${CommBs.mark}/</p>
                    <button class="one star"></button>
                    <button class="two star"></button>
                    <button class="three star"></button>
                    <button class="four star"></button>
                    <button class="five star"></button>
                </div>
            </div>
            <div class="comm_text">
                <p>${CommBs.comment}</p>
            </div>
        </div>
        `
    }
    comment = document.querySelectorAll('.comment');
}




// rating filter
rating.addEventListener('change', () => {
    var r = rating.value;
    for (let i = 0; i < comment.length; i += 1) {
       if(comment[i].classList.contains("stars"+r)) {
        comment[i].style.display = 'flex';
       }
       else {
        comment[i].style.display = 'none';
       }
    }
});

let button = document.querySelector('.button');

button.addEventListener('click', () => {
    build_comm(result.slice(view, view + more_view));
    view += more_view;
});
main();


// filters for all kind of user's permission

let parent;
let p;

pupils.addEventListener('click', () => {
    //comment.style.display = 'none';
    p = document.querySelectorAll('.permission');
    for (var i = 0; i < p.length; i += 1) {
        if (p[i].innerText == "Учень" || p[i].innerText == "Учениця") {
            console.log(p[i])
            p[i].parentElement.parentElement.parentElement.style.display = "flex";
        } else {
            p[i].parentElement.parentElement.parentElement.style.display = "none"
        }
    }
});

all.addEventListener('click', () => {
    //comment.style.display = 'none';
    for (let i = 0; i < p.length; i += 1) {
        p[i].parentElement.parentElement.parentElement.style.display = "flex";
    }
});

graduate.addEventListener('click', () => {
    //comment.style.display = 'none';
    p = document.querySelectorAll('.permission');
    for (var i = 0; i < p.length; i += 1) {
        if (p[i].innerText == "Випускник" || p[i].innerText == "Випускниця") {
            console.log(p[i])
            p[i].parentElement.parentElement.parentElement.style.display = "flex";
        } else {
            p[i].parentElement.parentElement.parentElement.style.display = "none"
        }
    }
});

parents.addEventListener('click', () => {
    //comment.style.display = 'none';
    p = document.querySelectorAll('.permission');
    for (var i = 0; i < p.length; i += 1) {
        if (p[i].innerText == "Мама учня" || p[i].innerText == "Мама учениці" || p[i].innerText == "Батько учня" || p[i].innerText == "Батько учениці") {
            console.log(p[i])
            p[i].parentElement.parentElement.parentElement.style.display = "flex";
        } else {
            p[i].parentElement.parentElement.parentElement.style.display = "none"
        }
    }
});

let form = document.querySelector('.form');

document.querySelector('.create_comm').addEventListener('click', () => {
    form.style.display = 'block';
})

let reelForm = document.querySelector('form')

document.querySelector('.close').addEventListener('click', () => {
    form.style.display = 'none';
})