/**
 *  测试
 */
interface Person {
    setName(name: string): void;
    getName(): any;
}
declare class Student implements Person {
    firstName: string;
    setName(name: string): void;
    getName(): string;
}
declare function testPerson(person: Person): any;
declare function testMultiType(name: string | number, id: number | string, success: boolean | string): string;
