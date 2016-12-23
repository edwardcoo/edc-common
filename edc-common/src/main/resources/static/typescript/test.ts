/*
* http://usejsdoc.org/
*/

/**
 *  测试
 */
interface Person{
    setName(name:string):void;
    getName();
}

class  Student implements Person{
    firstName:string;
    setName(name:string){
        this.firstName = name;
    }
    getName(){
        return this.firstName;
    }
}
function testPerson(person:Person){
    let result = person.getName();
    console.log('testPerson:'+result);
    return result;
}

function testMultiType(name:string|number,id:number|string,success:boolean|string){
    let result = 'testMultiType:'+id+"-"+name+"-"+success;
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
    let result = testMultiType('11','山东',true);
    $("#tslabel").html(result);
});

