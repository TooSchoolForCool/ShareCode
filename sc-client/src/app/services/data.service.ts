import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
// import { PROBLEMS } from '../mock-problems';
import { Http, Response, Headers } from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataService {
  // problemSource could be an observable object
  private problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) { }

  getProblems(): Observable<Problem[]> {
    this.http.get('/api/v1/problems')
      .toPromise()
      .then((res: Response) => {
        // res.json will return a Promise which contain a Problem[]
        this.problemSource.next(res.json());
      })
      .catch(this.handleError);

    return this.problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`/api/v1/problems/${id}`)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
  }

  addProblem(problem: Problem): Promise<Problem> {
    const headers = new Headers({'content-type': 'application/json'});

    return this.http.post('/api/v1/problems', problem, headers)
      .toPromise()
      .then((res: Response) => {
        // update problemSource
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.body || error);
  }
}
