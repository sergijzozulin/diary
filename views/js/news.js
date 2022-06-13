let result;
let container = document.querySelector('.container');
let stated = 3;
let count_news = 5;

async function main() {
    result = await fetch('/api/news/').then(res => res.json());
    console.log(result)
    build_news(result.slice(0,stated));
}
function build_news(info) {
    for (let news of info) {
        container.innerHTML += `
        <div class="news">
            <p>${news.title}</p>
            <p>${news.info}</p>
        </div>
        `
    }
}
function OnScroll(event) {
    let bottom = document.body.scrollHeight - (document.body.scrollTop + document.body.clientHeight);
    if (bottom < 3 && document.querySelectorAll(".container .news").length < result.length) {
        build_news(result.slice(stated,stated + count_news));
        stated += count_news;
    }
}
window.addEventListener('scroll', OnScroll);
main();