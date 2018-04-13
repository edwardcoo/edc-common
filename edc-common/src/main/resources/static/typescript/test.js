/*
* http://usejsdoc.org/
*/
var Student = (function () {
    function Student() {
    }
    Student.prototype.setName = function (name) {
        this.firstName = name;
    };
    Student.prototype.getName = function () {
        return this.firstName;
    };
    return Student;
}());
function testPerson(person) {
    var result = person.getName();
    console.log('testPerson:' + result);
    return result;
}
function testMultiType(name, id, success) {
    var result = 'testMultiType:' + id + "-" + name + "-" + success;
    console.log(result);
    return result;
}
$(document).ready(function () {
    /**
    let user = new Student();
    user.setName('1322lkj');
    let result = testPerson(user);
    $("#tslabel").html(result);
     */
    var result = testMultiType('11', '山东', true);
    $("#tslabel").html(result);
});
//# sourceMappingURL=test.js.map