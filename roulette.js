function render_rejected_nums_table(d, col_num=5) {
    const table = document.getElementById("rejected_nums");
    const new_tbody = document.createElement("tbody");
    let row = document.createElement("tr");
    new_tbody.appendChild(row);
    for (let i = 0; i < d.rejected_nums.length; i++) {
        const td = document.createElement("td");
        const num = d.rejected_nums[i];
        td.innerText = num;
        td.dataset.num = num;
        row.appendChild(td);
        if (((i+1) % col_num) === 0) {
            row = document.createElement("tr");
            new_tbody.appendChild(row);
        }
    }
    const old_tbody = table.querySelectorAll("tbody");
    if (old_tbody.length >= 1) {
        old_tbody[0].parentNode.removeChild(old_tbody[0]);
    }
    table.appendChild(new_tbody);
}

class Data {
    constructor(min_value, max_value) {
        if (min_value <= max_value) {
            this.min_value = min_value;
            this.max_value = max_value;
        }
        else {
            throw "min_value must be smaller or equal than max_value";
        }
        this.nums = [];
        for (let i = min_value; i <= max_value; i++) {
            this.nums.push(i);
        }
        this.rejected_nums = [];
    }
    choose() {
        if (this.nums.length <= 0) {
            return null;
        }
        const idx = Math.floor(Math.random() * ((this.nums.length-1) - 0 + 1)) + 0;
        const picked_value = this.nums[idx];
        this.nums.splice(idx, 1)
        this.rejected_nums.push(picked_value);
        return picked_value;
    }
    pickup(num) {
        if (this.nums.includes(num)) {
            const idx = this.nums.indexOf(num);
            this.nums.splice(idx, 1);
            this.rejected_nums.push(num);
            return num;
        }
        return null;
    }
    undo() {
        if (!confirm("ひとつ前の動作をもどしますが、よろしいですか?")) {
            return;
        }
        if (this.rejected_nums.length <= 0) {
            return null;
        }
        const idx = this.rejected_nums.length - 1;
        const picked_value = this.rejected_nums[idx];
        this.rejected_nums.splice(idx, 1);
        this.nums.push(picked_value);
        return picked_value;
    }
    back(num) {
        if (!this.rejected_nums.includes(num)) {
            return null;
        }
        const idx = this.rejected_nums.indexOf(num);
        this.rejected_nums.splice(idx, 1);
        this.nums.push(num);
        return num;
    }
}

let d = new Data(1, 75);
const rejected_num = 2;
const result = document.getElementById("result");
const exec_button = document.getElementById("start");
const undo_button = document.getElementById("undo");
const back_button = document.getElementById("back");
const pickup_button = document.getElementById("pickup");

undo_button.onclick = (e) => {
    const undo_num = d.undo();
    if (undo_num === null) {
        alert("これ以上戻せません");
        return;
    }
}

back_button.onclick = (e) => {
    let res = prompt("戻したい数字を入力してください(半角): " + String(d.min_value) + "-" + String(d.max_value));
    if (res === null) {
        return;
    }
    if (isNaN(parseInt(res)) || !isFinite(parseInt(res))) {
        alert("数値を入力してください");
        return;
    }
    const num = parseInt(res);
    const back_num = d.back(num);
    if (back_num === null) {
        alert(`${back_num}はまだ出ていません`);
        return;
    }
}

exec_button.onclick = (e) => {
    if (!e.target.exe) {
        e.target.exe = true;
        e.target.innerText = "Stop";
        (function f() {
            const num = Math.floor(Math.random() * (d.max_value - d.min_value + 1)) + d.min_value;
            result.innerText = num;
            timerId = setTimeout(f, 10);
        })();
    }
    else {
        clearTimeout(timerId);
        const num = d.choose();
        if (num === null) {
            alert("すべての数字がでました");
        }
        result.innerText = num;
        e.target.innerText = "Start";
        e.target.exe = false;
    }
}

pickup_button.onclick = (e) => {
    let res = prompt("出たことにしたい数字を入力してください(半角): " + String(d.min_value) + "-" + String(d.max_value));
    if (res === null) {
        return;
    }
    if (isNaN(parseInt(res)) || !isFinite(parseInt(res))) {
        alert("数値を入力してください");
        return;
    }
    const num = parseInt(res);
    const picked_num = d.pickup(num);
    if (back_num === null) {
        alert(`${picked_num}は既に出ています`);
        return;
    }
    alert(`${picked_num}を既に出したことにしました`);


}
