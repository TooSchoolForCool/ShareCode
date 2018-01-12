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
    var form_elements = document.getElementsByTagName('form');
    var i = 0;

    while (i < form_elements.length) {
      if (form_elements.item(i).id === 'new_prob_form') {
        break;
      }
      i++;
    }

    var select_element = form_elements.item(i);
    if (select_element.checkValidity()) {
      this._addProblem();
    }
  }

  private _addProblem(): void {
    // Note: here is shallow copy,
    // therefore, we need to reassigned a new Problem object or make a deep copy
    this.data.addProblem( this.newProblem )
      .catch(error => console.log(error.body));

    // Reassigned a new DEFAULT_PROBLEM object
    // Note: once you change the content of this.newProblem. Content in the
    // input-label and textarea will change simultaneously.
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }
}
