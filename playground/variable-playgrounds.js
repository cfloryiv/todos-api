var person = {
    name: "Curtis",
    age: 58
};

function updatePerson(obj) {
    obj={
        name: "Andrew",
        age: 21
    };
}
updatePerson(person);
console.log(person);

var array=[15, 37];
function updateArray(ary) {
    ary[0]=13;
    ary.push(33);
}
updateArray(array);
console.log(array);