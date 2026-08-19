/**
 * TODO JS中的内置类型有-- ECMAScript (Boolean、Number、String、RegExp、Date、Error
    还有 DOM 和 BOM (Document, HTMLElement, Event, NodeList )
*/

//1.dom querySelect MouseEvent
//2.ecma Number Date RegExp Error XMLHttprequest
//3.bom promise localstorage location cookie
//4.案例


let num:Number = new Number(1)
let date:Date = new Date()
let reg:RegExp = new RegExp(/\w/)
let error:Error = new Error('错了')
let xhr:XMLHttpRequest = new XMLHttpRequest()

//HTML(元素名称)Element HTMLElement Element 这三种都可以
let div1 = document.querySelector('footer')
let div2 = document.querySelector('footer') as Element
const elements: NodeListOf<HTMLDivElement | HTMLElement> = document.querySelectorAll('div, footer');

// Storage：浏览器本地存储对象类型，对应 localStorage / sessionStorage
let local: Storage = localStorage

// Location：浏览器地址栏对象类型，对应 window.location
let lo: Location = location

// Promise<string>：泛型Promise，尖括号代表成功resolve出来的值类型是string
let promise: Promise<string> = new Promise((r) => r('小满'))

// document.cookie 返回的就是字符串类型
let cookie: string = document.cookie

let canvas = document.querySelector<HTMLCanvasElement>('canvas')!
let ctx = canvas.getContext('2d')!
canvas.width = screen.availWidth
canvas.height = screen.availHeight