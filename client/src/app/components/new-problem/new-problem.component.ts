import {Component, Inject, OnInit} from '@angular/core';
import { DEFAULT_PROBLEM, Problem} from '../../models/problem.model';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})

export class NewProblemComponent implements OnInit {

  public difficulties = ['Easy', 'Medium', 'Hard', 'Super'];

  public newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);

  constructor(@Inject('data') private data) { }

  ngOnInit() {
  }

  public addProblem(): void {
    var selectEle = document.getElementsByTagName('form')[0];

    if(selectEle.checkValidity()) {
      this._addProblem();
    }
  }

  private _addProblem(): void {
    // Note: here is shallow copy,
    // therefore, we need to reassigned a new Problem object or make a deep copy
    this.data.addProblem( this.newProblem );
    // Reassigned a new DEFAULT_PROBLEM object
    // Note: once you change the content of this.newProblem. Content in the
    // input-label and textarea will change simultaneously.
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }

}
