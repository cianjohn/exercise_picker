class Workout {
    constructor(id, exercise, date, reps){
        this.id = id;
        this.exercise = exercise;
        this.date = this.changeDateFormat(date);
        this.reps = reps;
        this.average = reps.reduce((a,b)=>parseInt(a)+parseInt(b))/reps.length;
    };
    changeDateFormat(date){
        if (!date) {return date}
        let arraydate = date.split("-")
        return `${arraydate[2]}/${arraydate[1]}/${arraydate[0]}`
    };
};

class formManager {
    constructor(){
        this.identifyer = 0
        this.workouts =  {};
        this.setNumber = ["First","Second","Third","fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
    };
    updateLocalStorage(){
        localStorage.setItem("workouts", JSON.stringify(this.workouts));
        localStorage.setItem("identifyer", JSON.stringify(this.identifyer));
    };
    updateFromLocalStorage(){
        this.workouts = JSON.parse(localStorage.getItem("workouts")) || {};
        this.identifyer = JSON.parse(localStorage.getItem("identifyer")) || 0;
    };
    storeFormData(){
        let nodeList = document.querySelectorAll("#repsGroupForArray .form-control");
        let reps = [];
        nodeList.forEach(e => reps.push(e.value))
        let exercise = document.querySelector("#exercise").value;
        let date = document.querySelector("#datePicker").value;
        let id = this.identifyer

        let workout = new Workout(id, exercise, date, reps)
        this.workouts[id] = workout
        this.identifyer++

        this.updateLocalStorage()
        document.getElementById("myform").reset()
        document.getElementById('datePicker').valueAsDate = new Date();
        this.renderData(exercise)
        return n=2
    };
    addSetInput(n){
        if(n>10){
            return n
        }
        
        let InputHtml = `<div id="${n}input"class="mb-3">
        <label for="set${n}">${this.setNumber[n-1]} set:</label><br>
        <input required min="1" max="100" type="number" id="set${n}" name="${this.setNumber[n-1]} set" placeholder="reps" class="form-control">
        </div>
        <div id="nextinput">
        </div>`
        document.getElementById("nextinput").outerHTML=InputHtml;
        n++
            return n
    }
    removeSetInput(n){
        if (n<3){
            return nReps
        }
        document.getElementById(`${n-1}input`).outerHTML = "";
        n--
        return n
    }
    renderData(exercise){
        let dataToRender=[];
        let max = 0;
        for (let key in this.workouts){
            if(this.workouts[key].exercise == exercise){
                dataToRender.push([this.workouts[key].date,this.workouts[key].reps,this.workouts[key].average])
                if (this.workouts[key].reps.length>max){
                    max = this.workouts[key].reps.length;
                    
                };
            };
        };
        document.getElementById("dataSetTitle").innerText = exercise;
        document.getElementById("setTitle").colSpan=max
        let headerhtml = new DocumentFragment
        for (let i = 0; i < max; i++){
            let html = document.createElement("th");
            html.scope = "col";
            html.classList += "reset"
            html.innerText = this.setNumber[i]+" Set";
            headerhtml.append(html);
 
        }
        let bodyhtml = new DocumentFragment;
        dataToRender.forEach((e)=>{
            let row = document.createElement("tr")
            let rowheader = document.createElement("th")
            rowheader.scope="row"
            rowheader.innerText=e[0]
            row.appendChild(rowheader)
            e[1].forEach((rep, id, array)=>{
                let cell = document.createElement("td")
                if ((id+1==array.length)&&(array.length!=max)){
                    cell.colSpan=max-array.length+1;
                }
                cell.innerText=rep
                row.appendChild(cell)
            })
            let cell = document.createElement("td")
            cell.innerText=Math.floor(e[2])
            row.appendChild(cell)

            bodyhtml.append(row)
        })
        document.querySelectorAll(".reset").forEach((e)=>{e.outerHTML=""})
        let headerSpace = document.getElementById("appendAfter")
        headerSpace.after(headerhtml)
        let bodySpace = document.getElementById("bodySpace");
        bodySpace.innerHTML=""
        bodySpace.appendChild(bodyhtml)
    }
}
let start = new formManager
start.updateFromLocalStorage();
start.updateLocalStorage()
document.getElementById('datePicker').valueAsDate = new Date();
// start.displayAll()

let form = document.querySelector("#myform")
form.addEventListener('input', function (event) {
    form.classList.add('was-validated')
      }, false)

form.addEventListener("submit", (e) =>{
    if (form.checkValidity()){
        start.storeFormData()}
    e.preventDefault()
})

start.renderData("Push Ups")
let n = 2
let addSetBtn = document.getElementById('addSetBtn')
let removeSetBtn = document.getElementById('removeSetBtn')
addSetBtn.addEventListener('click', (e)=>{n = start.addSetInput(n)});
removeSetBtn.addEventListener('click', (e)=>{n = start.removeSetInput(n)});