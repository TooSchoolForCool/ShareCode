import { Component, OnInit } from '@angular/core';
import { EDITOR_DEFAULT_CONTENT, EDITOR_MODE } from './editor.variables';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit {

  editor: any;

  public languages: string[] = ['C++', 'Java', 'Python'];
  public selected_language: string = 'C++';

  constructor() { }

  ngOnInit() {
    this.editor = ace.edit('editor');
    // set editor theme
    this.editor.setTheme('ace/theme/github');
    // hide vertical line in Ace editor
    this.editor.setShowPrintMargin(false);
    // initialize edtior
    this.resetEditor();
    // set infinite scrolling bar
    this.editor.$blockScrolling = Infinity;
  }

  // reset code editor
  public resetEditor(): void {
    let mode = EDITOR_MODE[this.selected_language];
    // reset highlight language mode
    this.editor.getSession().setMode(`ace/mode/${mode}`);
    // reset content according to selected language
    this.editor.setValue(EDITOR_DEFAULT_CONTENT[this.selected_language]);
  }

  // upload local source code to remote server
  public submit() {
    let user_code = this.editor.getValue();
    console.log(user_code);
  }
}
