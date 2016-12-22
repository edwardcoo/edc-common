/*
* http://usejsdoc.org/
*/
/**
 *  测试类
 */
var Test = (function () {
    function Test(id1, name1) {
        this.name = name1;
        this.id = id1;
    }
    return Test;
}());
var t = new Test('111', '222');
console.log(t);
console.log(t.name);
alert(t.name);
console.log(t.id);
