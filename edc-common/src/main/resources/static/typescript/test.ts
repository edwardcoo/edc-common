/*
* http://usejsdoc.org/
*/

/**
 *  测试类
 */
class Test{
    name:string;
    id:string; 
    constructor(id1:string,name1:string){
        this.name = name1;
        this.id = id1;
    }
    
} 

let t = new Test('111','222');
console.log(t);
console.log(t.name);
alert(t.name);    
console.log(t.id);

