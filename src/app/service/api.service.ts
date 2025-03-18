import { Injectable } from '@angular/core';
import { HttpService } from '../helpers/http.service';
import { API_PATH } from '../shared/constant/route.constant';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpService) { }

  login(data: any) {
    return this.http.post(API_PATH.AUTH + 'login', data)
  }

  signup(data: any) {
    return this.http.post(API_PATH.AUTH + 'register', data)
  }

  createCategory(data: any) {
    return this.http.post(API_PATH.CATEGORY, data)
  }

  getCategory() {
    return this.http.get(API_PATH.CATEGORY)
  }

  updateCategory(id: number, data: any) {
    return this.http.put(API_PATH.CATEGORY, id, data)
  }

  deleteCategory(id: number) {
    return this.http.delete(API_PATH.CATEGORY, id)
  }
}
