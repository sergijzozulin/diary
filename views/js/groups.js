$('.button-filter').click(function () {
    $('.all-filters').toggleClass('active2');
    $('.arrow').toggleClass('down-arrow');
    $('.none').toggleClass('active');
});

$('.circle').click(function () {
    $('.menu').toggle('menu-active');
});

$('.X').click(function () {
    $('.menu').removeClass('active');
})