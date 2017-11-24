import { Component } from '@angular/core';
import { environment } from './../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = environment.title;
  uid = environment.apiUid;
  url = environment.apiUrl;
  uname = '';
  uphone = '';
  uemail = '';
  udescr = '';
  totalBooks = 0;
  totalPrice = 0;
  loading = true;
  state = 0;
  showInfo = false;
  db = [];
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get(this.url+'api/db/'+this.uid).subscribe(data => {
      this.loading = false;
      this.db = Object.values(data);
      this.db.forEach(function(v, i, arr) {
        arr[i].books.forEach(function(v, i, arr) {
          arr[i].box = '';
          arr[i].byone = '';
        });
      });
    });
  }
  RecountTotal() {
    var totalBooks = 0;
    var totalPrice = 0;
    this.db.forEach(function (item, i, arr) {
      item.books.forEach(function (item, i, arr) {
        totalBooks += (item.box * item.pack) + (item.byone * 1);
        totalPrice += item.price * ((item.box * item.pack) + (item.byone * 1));
      });
    });
    this.totalBooks = totalBooks;
    this.totalPrice = totalPrice;
  }
  Order() {
    this.state = 2;
    var order = [];
    this.db.forEach(function (item, i, arr) {
      item.books.forEach(function (item, i, arr) {
        if((item.box * item.pack) + (item.byone * 1) > 0) {
          order.push(item);
        }
      });
    });
    var o = {
      uid: this.uid,
      name: this.uname,
      phone: this.uphone,
      email: this.uemail,
      descr: this.udescr,
      order: order
    };
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json; charset=utf-8');
    this.http.post(this.url+'api/order', JSON.stringify(o), {
      headers: headers
    }).subscribe(data => { this.state = 3; });
  }
}
