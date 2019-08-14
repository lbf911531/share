var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var saying = 'hello world';
// console.log(saying);
var no = 1.2;
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
var week;
(function (week) {
    week[week["Sun"] = 0] = "Sun";
    week[week["Mon"] = 1] = "Mon";
    week[week["Tue"] = 2] = "Tue";
    week[week["Wed"] = 3] = "Wed";
    week[week["Thu"] = 4] = "Thu";
    week[week["Fri"] = 5] = "Fri";
    week[week["Sat"] = 6] = "Sat";
})(week || (week = {}));
// console.log(week.Sun);
var days;
(function (days) {
    // Sun ="one",
    // Mon = true,
    days[days["Tue"] = null] = "Tue";
    // Wed = undefined,
    days[days["Thu"] = 3] = "Thu";
    days[days["Fri"] = 4] = "Fri";
    days[days["Sat"] = 3] = "Sat";
})(days || (days = {}));
// console.log(days,days.Tue,days.Wed,days.Thu,days.Fri);
// console.log(days);
var tempNpArr = [];
[1, 2, 4, 5, 6].map(function (item) { tempNpArr.push(item); });
console.log(tempNpArr);
function consoleName(firstName, lastName) {
    if (firstName === void 0) { firstName = 'tom'; }
    if (lastName === void 0) { lastName = 'cat'; }
    return firstName + " " + lastName;
}
function sayName(name) {
    if (name === void 0) { name = 'tom'; }
    console.log(name);
}
// console.log(consoleName('john'));
// sayName();
// function returnName(firstName:string,lastName:string) :string {
//   return firstName + " " + lastName;
// }
// returnName('1');
var myFavoriteNumber;
myFavoriteNumber = 'seven';
// console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
// console.log(myFavoriteNumber.length);
function knowLen(something) {
    return something.length;
}
// let a: x = "gg";
var a = "cat";
// console.log(a);
var Parent = /** @class */ (function () {
    function Parent(age) {
        this.theLastName = 'one';
        this.gender = 'male';
        this.like = ["sleep", 'play', 'read'];
        this.age = age;
    }
    Parent.prototype.sayHi = function () {
        return "hi, I am father";
    };
    Parent.prototype.sayLike = function () {
        console.log(this.like);
    };
    Parent.prototype.sayBye = function () {
        return "bye bye";
    };
    Parent.theFirstName = 'father';
    return Parent;
}());
var Son = /** @class */ (function (_super) {
    __extends(Son, _super);
    function Son(age) {
        return _super.call(this, age) || this;
    }
    Son.prototype.sayHello = function () {
        var str = _super.prototype.sayHi.call(this) + "  ~ son, " + this.age + " \u5C81 " + _super.prototype.sayBye.call(this);
        console.log(str);
        return true;
    }; // 通过super，子类只能访问父类的公共方法和protected修饰的方法
    return Son;
}(Parent));
var son = new Son(14);
// son.sayHello();
// new Parent(1).sayBye();
// console.log(Parent.theFirstName);
// console.log(Parent.like);
// console.log(new Parent(23).sayLike())
var Man = /** @class */ (function () {
    function Man() {
        this.gender = 'male';
    }
    return Man;
}());
var man = new Man();
// console.log(man.gender,'man~gender');
man.age = 23;
// console.log(man.age,"man~age");
// man.gender = 'female';
var Animals = /** @class */ (function () {
    function Animals(name, gender, age, area) {
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.area = area;
    }
    Animals.prototype.saySomething = function () {
        console.log("I am " + this.name + ", gender is " + this.gender + ", \n    and this year at the age of" + this.age);
    };
    return Animals;
}());
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.species = 'cat';
        return _this;
    }
    Cat.prototype.saySomething = function () {
        _super.prototype.saySomething.call(this);
        console.log('miao miao');
    };
    Cat.prototype.likeSomething = function () {
        console.log('find mouse');
    };
    Cat.prototype.live = function () {
        console.log("live " + this.area);
    };
    return Cat;
}(Animals));
var tom = new Cat('tom', 'male', 3, 'there');
var male = {
    gender: '男',
    interest: ["吃", "喝"],
    age: 12
};
var mySearch;
mySearch = function (source, subString) {
    var flag = source.search(subString);
    return (flag != -1);
};
// console.log(mySearch('高、富、帅、德','胖')) ;
