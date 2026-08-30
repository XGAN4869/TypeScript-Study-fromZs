"use strict";
/**
 * TODO JS中的内置类型有-- ECMAScript (Boolean、Number、String、RegExp、Date、Error
    还有 DOM 和 BOM (Document, HTMLElement, Event, NodeList )
*/
Object.defineProperty(exports, "__esModule", { value: true });
//1.dom querySelect MouseEvent
//2.ecma Number Date RegExp Error XMLHttprequest
//3.bom promise localstorage location cookie
//4.案例
let num = new Number(1);
let date = new Date();
let reg = new RegExp(/\w/);
let error = new Error('错了');
let xhr = new XMLHttpRequest();
//HTML(元素名称)Element HTMLElement Element 这三种都可以
let div1 = document.querySelector('footer');
let div2 = document.querySelector('footer');
const elements = document.querySelectorAll('div, footer');
// Storage：浏览器本地存储对象类型，对应 localStorage / sessionStorage
let local = localStorage;
// Location：浏览器地址栏对象类型，对应 window.location
let lo = location;
// Promise<string>：泛型Promise，尖括号代表成功resolve出来的值类型是string
let promise = new Promise((r) => r('小满'));
// document.cookie 返回的就是字符串类型
let cookie = document.cookie;
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = screen.availWidth;
canvas.height = screen.availHeight;
//# sourceMappingURL=%E5%86%85%E7%BD%AE%E5%AF%B9%E8%B1%A1.js.map