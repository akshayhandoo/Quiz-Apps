import { Component, OnInit } from '@angular/core';
// import { Http } from '@angular/http';
import { Request } from './request/promise.request';
// import { setInterval } from 'timers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Request]
})

export class AppComponent {
  
  questions: any;
  options: {};
  curr: any;
  ar= [];
  array1:any;
  index = 0;
  issubmit = false;
  timer : any;
  json : string;
  // id: any;
  
  constructor(private request: Request) {}

  getKey(obj) : String {
    return Object.keys(obj)[0];    
  }

  next () {
    this.load(++this.index);
  }

  previous () {
    this.load(--this.index);
  }

  load(index) {
    if(index < 0) { index = 0; this.index = index; }
    if(index > this.questions.length - 1) { this.index = this.questions.length-1; return; }
    this.curr = this.questions[index];
    this.curr.selected = false;
    this.curr.time = this.curr.time || 0;
  }

  onChange(obj, v) {
    obj.selected = v;
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.startTimer();
    }, 1000);
    if(this.curr) {
      console.log("updated");
      this.curr.time = this.curr.time+1;
    }
  }

  ngOnInit(): void{
      this.request.get('https://api.myjson.com/bins/blxqf').then(response=>{
        console.log("got response",response);
        this.questions = response.questions;
        this.index = 0;
        this.load(this.index);
        this.startTimer();
      })
  }

  onSubmit(): void { 
    this.issubmit = true;
    let obj = Object.create({});
    obj.answers = [];
    window.clearTimeout(this.timer);
    // this.timer.clearTimeout();

    for(var op in this.questions) {
      if(!this.questions[op]["selected"]) {
        continue;
      }
      let o = {};
      o["id"] = this.questions[op]["id"];
      o["timeTaken"] = this.questions[op]["time"];
      o["option"] = this.getKey(this.questions[op]["selected"]);
      obj.answers.push(o);
    }
    this.json = JSON.stringify(obj);
    console.log("you submitted:", obj);
  }
}
