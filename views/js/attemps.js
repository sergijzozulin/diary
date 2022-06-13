var body = document.getElementsByTagName('body')[0];
let button_student = document.querySelector('.add_student');
let tbody = document.querySelector('.tbody');
let thead = document.querySelector('.thead');
let menu = document.querySelector('.menu');
let month = document.querySelector('.month');
let cell = document.querySelector('.cell')
let title = document.querySelector('.title');
let row = document.querySelector('row');
let save = document.querySelector('#save');
let months = [
	'Січень',
	'Лютий',
	'Березень',
	'Квітень',
	'Травень',
	'Червень',
	'Липень',
	'Серпень',
	'Вересень',
	'Жовтень',
	'Листопад',
	'Грудень',
];

let d = new Date();
let b = months[d.getMonth()];




const addEventListeners = (element, events, handler) => {
	events.forEach(e => element.addEventListener(e, handler, true));
}

addEventListeners(button_student, ['focus', 'blur'], (event) => {
	let {target, type} = event;
	if (target.classList.contains('mark')) {
		let parent = target.parentElement.parentElement;
		if (type === 'focus') {
			parent.classList.add('focus');
		} else {
			parent.classList.remove('focus');
		}
	}
});

save.addEventListener('click', async () => {
	let row = document.querySelectorAll('.row-student');
	
	let marks = {};
	let currentMonth = b;

	for (let r = 0; r < row.length; r++) {
		let user_id = row[r].querySelector('.title').getAttribute('data-id');
		if (!marks[user_id]){
			marks[user_id] = {};
		}
		marks[user_id][currentMonth] = {};

		let mark = row[r].querySelectorAll('.mark');
		for (let p = 0; p < mark.length; p++) {
			if (!marks[user_id][currentMonth][mark[p].getAttribute('data-day')]) {
				marks[user_id][currentMonth][mark[p].getAttribute('data-day')] = []
			}
			marks[user_id][currentMonth][mark[p].getAttribute('data-day')].unshift(mark[p].value)
		}
	}

	let response = await fetch('http://localhost:3000/api/attemps/2018-2/update', {
		method: 'POST',
		headers: {
			"Content-type": "application/json"
		},
		body: JSON.stringify(marks)
	}).then(res => res.json());

	if (response.status) {
		alert(response.message);
	} else {
		alert(response.message);
	}
});



document.querySelector('.add-student').addEventListener('click', function () {
	body.style="background: rgba(41, 41, 41, 0.3);";
	button_student.style='display: block';
});

document.querySelector('.close').addEventListener('click', function () {
	body.style="background: white;";
	button_student.style='display: none';
});

async function main() {
	let result = await fetch('/api/attemps/2018-2/users').then(res => res.json());
	let attemps = await fetch(`/api/attemps/2018-2/${b}`).then(res => res.json());	
	console.log('attemps',attemps)
	let days = Object.keys(attemps)
	console.log('date', days)
	
	for (let o = 0; o < days.length; o++) {
		console.log('here i am', days[o]);

		thead.innerHTML += `<div class="cell">${days[o]}</div>`;	
	}

	for (let j = 0; j < months.length; j++) {
		menu.innerHTML += `
			<div class="month">${months[j]}</div>
		`
	};

	for (let i = 0; i < result.length; i++) {
		// console.log(result[i].name)
		tbody.insertAdjacentHTML('afterbegin',`
			<div class="row row-student" id="row-${i}">
				<div class="title" id="title-${i}" data-id="${result[i]._id}">${result[i].second_name} ${result[i].second_name}</div>
			</div>
		`);
		var posn = document.getElementById(`title-${i}`);
		for (let day in days) {
			// console.log(result[i].marks.Травень);
			let value = result[i].marks.Травень[days[day]];
			let divid = `marks-${day}-${i}`;
			posn.insertAdjacentHTML("afterend", `<div class="cell" id="${divid}"></div>`);
			let div = document.getElementById(divid);
			div.innerHTML = `
			<input type="text" name="attemp2" data-day="${days[day]}" class="mark mark-class_work" value="${value[1]}">
			<input type="text" name="attemp1" data-day="${days[day]}" class="mark mark-home_work" value="${value[0]}">
			`;
			posn = div;
		}
	};
	
	
};
main()

