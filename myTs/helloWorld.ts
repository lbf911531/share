let saying: string = 'hello world';
// console.log(saying);
let no: number = 1.2;
// console.log(no);
// let num: number = "i am no.1";
// console.log(num);

// let boolTrue: boolean = 1;
// console.log(boolTrue);

// let boolFalse: boolean = '';
// console.log(boolFalse);

// let boolObj: boolean = new Boolean(1);
// console.log(boolObj);
// console.log( typeof new Boolean(1)); // object

enum week {
  Sun, Mon, Tue, Wed, Thu, Fri, Sat
}
// console.log(week.Sun);

enum days {
  // Sun ="one",
  // Mon = true,
  Tue = null,
  // Wed = undefined,
  Thu = 3, 
  Fri , 
  Sat = 3
}
// console.log(days,days.Tue,days.Wed,days.Thu,days.Fri);
// console.log(days);
const tempNpArr = [];
[1,2,4,5,6].map((item): void => {tempNpArr.push(item)});
// console.log(tempNpArr);
// ---------------------
// any
function push(array: any[], ...items: number[]): void {
  items.forEach(function(item: number): void {
      array.push(item);
  });
}

const ass :string[] = [];
push(ass, 1, 2, 3);
// console.log(ass);
// ---------------------
function consoleName(firstName:string='tom',lastName:string='cat') :string {
  return firstName + " " + lastName;
}

// console.log(consoleName('john'));

// function returnName(firstName:string,lastName:string) :string {
//   return firstName + " " + lastName;
// }
// returnName('1');

let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
// console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
// console.log(myFavoriteNumber.length);
function  knowLen(something:string|number) {
  return (<string>something).length;
}  
// console.log(knowLen(7),'len');

// let tempArr :[number,string] = [1,2,'str'];
// console.log(tempArr);

type x = "cat" | "dog" | "mouse";
// let a: x = "gg";
let a: x = "cat";
// console.log(a);


class Parent {
  static theFirstName: string ='father';
  public theLastName: string = 'one';
  protected gender: string = 'male';
  private like: Array<string> = ["sleep",'play','read'];
  public age: number;
  constructor(age: number) {
    this.age = age;
  }
 
  sayHi(): string {
    return "hi, I am father";
  }
  sayLike(): void {
    console.log(this.like);
  }
  protected sayBye(): string {
    return "bye bye";
  }
}

class Son extends Parent {

  constructor(age: number) {
    super(age);
  }
  sayHello(): boolean {
    const str = `${super.sayHi()}  ~ son, ${this.age} 岁 ${super.sayBye()}`;
    console.log(str);
    return true;
  } // 通过super，子类只能访问父类的公共方法和protected修饰的方法
}

let son: Son = new Son(14);
// son.sayHi();
// son.sayHello();
// new Parent(1).sayBye();
// console.log(Parent.theFirstName);
// console.log(Parent.like);
// console.log(new Parent(23).sayLike())

class Man {
  public readonly gender: string = 'male';
  public age: Number;
}
const man: Man = new Man();
// console.log(man.gender,'man~gender');
man.age = 23;
// console.log(man.age,"man~age");
// man.gender = 'female';

class Animals {
  public name: string;
  public gender: string;
  public age: number;
  protected area: string;
  constructor(name: string, gender: string, age: number,area: string) {
    this.name = name;
    this.gender = gender;
    this.age = age;
    this.area = area;
  }

  public saySomething(): void {
    console.log(`I am ${this.name}, gender is ${this.gender}, 
    and this year at the age of${this.age}`);
  }
}

class Cat extends Animals {
  public species: string = 'cat';
  public saySomething(): void {
    super.saySomething();
    console.log('miao miao');
  }
  public likeSomething(): void {
    console.log('find mouse');
  }
  public live(): void {
    console.log(`live ${this.area}`)
  }
}

const tom: Cat = new Cat('tom','male',3,'there');
// tom.saySomething();
// tom.likeSomething();
// console.log(tom.area);
// tom.live();

interface Mans {
  gender: string
  interest: Array<string>
  age: number
  doing?:  Array<string>
}

const male:Mans = {
  gender: '男',
  interest: ["吃","喝"],
  age: 12
}

interface  SearchMan{
  (source:string,subString:string):boolean
}

let mySearch:SearchMan

mySearch = function(source:string,subString:string):boolean{
  let flag =source.search(subString)
  return (flag != -1)
} 

// console.log(mySearch('高、富、帅、德','胖')) ;