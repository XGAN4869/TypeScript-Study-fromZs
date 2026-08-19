"use strict";
let canvas = document.querySelector('canvas');
//获取页面上的 <canvas> DOM 画布元素。拿到 canvas2D 绘图上下文，所有画线、写字、填色都靠ctx对象。
let ctx = canvas.getContext('2d');
//设置画布宽高；
canvas.width = screen.availWidth;
canvas.height = screen.availHeight;
let str = 'XMZSWZS010101'.split('');

let Arr = Array(Math.ceil(canvas.width / 10)).fill(0);
console.log(Arr);
const rain = () => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    Arr.forEach((item, index) => {
        ctx.fillText(str[Math.floor(Math.random() * str.length)], index * 10, item + 10);
        Arr[index] = item > canvas.height || item > 5000 * Math.random() ? 0 : item + 10;
    });
};
setInterval(rain, 40);
