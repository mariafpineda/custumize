import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plantillas',
  templateUrl: './plantillas.component.html',
  styleUrls: ['./plantillas.component.css']
})
export class PlantillasComponent  {
  
  editorPreview:any;
  editorOptions2 = {theme: 'vs-dark', language: 'html'};
  htmlEditor = (<HTMLInputElement>document.getElementById('html-part'));
  codeHTML: string= '';

  onInit(editor) {
    let line = editor.getPosition();
    console.log(line);
    monaco.editor.colorize(this.codeHTML, 'html', {})
  }

  update(){
    this.editorPreview = (<HTMLIFrameElement>document.getElementById('editorPreview')).contentWindow.document;
    this.editorPreview.open();
    this.editorPreview.write(this.codeHTML);
    this.editorPreview.close();
  }
  
  /*constructor() { }

  ngOnInit(): void {
  }*/

}
