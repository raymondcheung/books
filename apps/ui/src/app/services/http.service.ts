import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../model/book.model';
import { Observable, map, tap } from 'rxjs';

const baseUrl = "http://localhost:4200/books";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(protected http: HttpClient) { }

  public getAllBoooks(): Observable<Book[]> {
    return this.http.get<any>(baseUrl);
  }

  public addBook(book: Book): Observable<boolean> {
    return this.http.post<boolean>(baseUrl, book);
  }

  public updateBook(book: Book): Observable<boolean> {
    const { book_id, ...fields } = book;
    return this.http.put<boolean>(`${baseUrl}/${book.book_id}`, fields);
  }
}
