import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Book } from './model/book.model';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpService } from './services/http.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public errorMsg: string;
  public books$: Observable<Book[]>;

  public bookForm = new FormGroup({
    book_id: new FormControl(''),
    title: new FormControl(''),
    author: new FormControl(''),
    publication_year: new FormControl(''),
  });

  public constructor(
    protected httpService: HttpService,
    protected changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    try {
      this.books$ = this.httpService.getAllBoooks();
    } catch (error) {
      if (typeof error === 'string') {
        this.errorMsg = error;
      } else if (error instanceof Error) {
        this.errorMsg = error.message;
      }
    }
  }

  submit(): void {
    this.errorMsg = "";
    const book: Book = {
      book_id: this.bookForm.get('book_id')?.value || '',
      title: this.bookForm.get('title')?.value as string,
      author: this.bookForm.get('author')?.value as string,
      publication_year: parseInt(this.bookForm.get('publication_year')?.value as string, 10),
    }
    let request;
    try {
      if (book.book_id) {
        request = this.httpService.updateBook(book);
      } else {
        request = this.httpService.addBook(book);
      }
      request.subscribe(() => {
        this.books$ = this.httpService.getAllBoooks();
      });
    } catch (error) {
      if (typeof error === 'string') {
        this.errorMsg = error;
      } else if (error instanceof Error) {
        this.errorMsg = error.message;
      }
    }
  }
}
