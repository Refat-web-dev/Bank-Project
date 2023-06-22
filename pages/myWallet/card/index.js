import axios from "axios";
import { header } from "../../../modules/header";
import { getData } from "../../../modules/http.requests";
import { getRandomColors, reloadEmptyTransactions, reloadTransactions } from "../../../modules/reload";

header()

let card_id = location.search.split("=").at(-1)

let cnt = document.querySelector("#inner")
let tbody = document.querySelector("tbody")

let b = document.querySelector(".balance p")


let convert = document.querySelector(".convert")


getData("/cards/" + card_id)
    .then(res => {
        console.log(res.data);
        let balance = res.data.balance
        let valuta = res.data.valuta

        b.innerHTML = balance + ' ' + valuta

        personalCard(res.data)

        axios.get(`https://api.apilayer.com/fixer/convert?to=UZS&from=${valuta}&amount=` + balance, {
            headers: {
                apiKey: import.meta.env.VITE_API_KEY
            }
        })
            .then(res => {
                convert.onclick = () => {
                    if (!b.innerHTML.includes("UZS")) {

                        convert.innerHTML = "Convert to " + valuta
                        b.innerHTML = res.data.result.toLocaleString("uz-UZ") + " UZS"
                    } else {
                        convert.innerHTML = "Convert to UZS"
                        b.innerHTML = balance + ' ' + valuta
                    }
                }
            })

    })

var container = document.getElementById('container');
var inner = document.getElementById('inner');

var onMouseEnterHandler = function (event) {
    update(event);
};
var onMouseLeaveHandler = function () {
    inner.style = "";
};
var onMouseMoveHandler = function (event) {
    if (isTimeToUpdate()) {
        update(event);
    }
};

container.onmouseenter = onMouseEnterHandler;
container.onmouseleave = onMouseLeaveHandler;
container.onmousemove = onMouseMoveHandler;

var counter = 0;
var updateRate = 10;
var isTimeToUpdate = function () {
    return counter++ % updateRate === 0;
};

// Init
var container = document.getElementById('container');
var inner = document.getElementById('inner');
// Mouse 
var mouse = {
    _x: 0,
    _y: 0,
    x: 0,
    y: 0,
    updatePosition: function (event) {
        var e = event || window.event;
        this.x = e.clientX - this._x;
        this.y = (e.clientY - this._y) * -1;
    },
    setOrigin: function (e) {
        this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
        this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
    },
    show: function () { return '(' + this.x + ', ' + this.y + ')'; }
}
// Track the mouse position relative to the center of the container.
mouse.setOrigin(container);

var update = function (event) {
    mouse.updatePosition(event);
    updateTransformStyle(
        (mouse.y / inner.offsetHeight / 2).toFixed(2),
        (mouse.x / inner.offsetWidth / 2).toFixed(2)
    );
};

var updateTransformStyle = function (x, y) {
    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    inner.style.transform = style;
    inner.style.webkitTransform = style;
    inner.style.mozTransform = style;
    inner.style.msTransform = style;
    inner.style.oTransform = style;
};

function personalCard(arr) {
    cnt.innerHTML = ""

    let card = document.createElement("div")
    let h3 = document.createElement("h3")
    let p = document.createElement("p")

    card.classList.add("selected")
    h3.innerHTML = arr.name
    p.innerHTML = arr.valuta

    card.style.background = getRandomColors()


    card.append(h3, p)
    cnt.append(card)


}

getData('/transactions?name.id=' + card_id)
    .then(res => {
        if (res.status === 200 || res.status === 201) {
            if (res.data.length) {
                reloadTransactionss(res.data, tbody)
            }
            else {
                reloadEmptyTransactions(tbody)
            }

        }
    })

export function reloadTransactionss(arr, place) {

    for (let item of arr) {
        let tr = document.createElement("tr")
        let id = document.createElement("td")
        let title = document.createElement("td")
        let category = document.createElement("td")
        let amount = document.createElement("td")
        let date = document.createElement("td")

        id.innerHTML = (Math.random() + 9999).toFixed(8).slice(5, 10)
        title.innerHTML = item.name.name
        category.innerHTML = item.category
        amount.innerHTML = item.sum.toLocaleString("uz-UZ")
        date.innerHTML = item.date

        tr.append(id, title, category, amount, date)
        place.append(tr)
    }
}
