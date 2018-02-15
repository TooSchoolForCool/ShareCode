import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EDITOR_DEFAULT_CONTENT, EDITOR_MODE, SUPPORT_LANGUAGES } from './editor.variables';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent implements OnInit {
  // declare editor
  editor: any;
  // support language list
  public support_languages: string[] = SUPPORT_LANGUAGES;
  // default selected language is C++
  public selected_language = 'C++';
  // define session_id
  // session id is used for socket_io, people is the same
  // session id will share same code content
  public session_id: string;

  constructor(@Inject('collaboration') private collaboration,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.session_id = params['id'];
      });
    //
    this.initEditor();
  }

  // init Ace editor
  private initEditor(): void {
    this.editor = ace.edit('editor');
    // set editor theme
    this.editor.setTheme('ace/theme/github');
    // hide vertical line in Ace editor
    this.editor.setShowPrintMargin(false);
    // initialize edtior
    this.resetEditor();
    // set infinite scrolling bar
    this.editor.$blockScrolling = Infinity;

    // focus on current textarea
    // document.getElementsByTagName('textarea')[0].focus();

    // init socket, upload current session_id & socket_id to remote server
    this.collaboration.init(this.editor, this.session_id);

    // When merge others code, only we only want to merged the changed part
    // this.editor.lastAppliedChange variable will record the last version
    // of local content. The variable will be updated automatically by Ace
    // when you type in in the editor
    this.editor.lastAppliedChange = null;

    // listening on editor change
    this.editor.on('change', (event) => {
      // if local content changed, upload to remote
      if (this.editor.lastAppliedChange !== event) {
        this.collaboration.uploadChange(JSON.stringify(event));
      }
    });

    this.editor.getSession().getSelection().on('changeCursor', () => {
      const cursor = this.editor.getSession().getSelection().getCursor();
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });

    this.collaboration.restoreBuffer();
  }

  // reset code editor
  public resetEditor(): void {
    const mode = EDITOR_MODE[this.selected_language];
    // reset highlight language mode
    this.editor.getSession().setMode(`ace/mode/${mode}`);
    // reset content according to selected language
    this.editor.setValue(EDITOR_DEFAULT_CONTENT[this.selected_language]);
  }

  // upload local source code to remote server
  public submit() {
    const user_code = this.editor.getValue();
    console.log(user_code);
  }
}
