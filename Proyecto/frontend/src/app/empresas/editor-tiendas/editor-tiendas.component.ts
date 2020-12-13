import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBars, faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faEdit as farEdit, faTrashAlt as farTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlantillasService } from 'src/app/services/plantillas.service';

interface HtmlInputEvent extends Event{
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-editor-tiendas',
  templateUrl: './editor-tiendas.component.html',
  styleUrls: ['./editor-tiendas.component.css']
})
export class EditorTiendasComponent implements OnInit {
  public isMenuCollapsed=true;
  public isSidebarCollapsed=true;
  public isCollapsed=true;
  public isCollapsed2=true;
  public isCollapsed3=true;
  disabled = false;
  faBars=faBars;
  faChevronDown=faChevronDown;
  faPlus=faPlus;
  farEdit=farEdit;
  farTrashAlt=farTrashAlt;

  plantillas:any=[];
 
  /*Monaco Editor*/
  editorOptions=[{theme:'vs-dark', language:'html'},
  {theme:'vs-dark', language:'css'}]
  codeHTML:String=""
  codeCSS:String;
 
  /*Froala Editor*/
  editorContent:String;

  bloqueSeleccionado:number;
  active=1;
  bloques:any=[];
  adaptabilidad={
    xl:'',
    lg:'',
    md:'',
    sm:'',
    xs:'',
    height:''
  };
  bloqueContenido:any;
  
  archivo:File;
  plantillaSeleccionada:any;

  constructor(private route:ActivatedRoute,
    private modalService:NgbModal,
    private plantillasService:PlantillasService) { 
    }

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('idPage'));
    console.log(this.route.snapshot.paramMap.get('idCompany'));
  
    this.plantillasService.getTemplates()
    .subscribe(res => {
      this.plantillas=res;
      console.log(this.plantillas)
    }, error => {
      console.log(error);
    })

    this.prueba();
    this.bloqueContenido=(<HTMLIFrameElement>document.getElementById('content')).contentWindow.document;
    this.bloqueContenido.open();
    this.bloqueContenido.write(`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">`);
    this.bloqueContenido.write('<div class="container-fluid"><div class="row" id="contenido"></div> </div>')
  }

  open(content, id){
    this.modalService.open(content, {centered:true});
    this.bloqueSeleccionado=id;
  }

  
  openTemplate(content, id){
    this.modalService.open(content, {centered:true});
    this.bloqueSeleccionado=id;
  }

  agregarBloque(){
    console.log(this.adaptabilidad);
    this.bloques.push({
      editorFroala:"",
      codeHTML:"",
      codeCSS:"",
      "adaptabilidad":this.adaptabilidad});
    console.log(this.bloqueContenido.getElementById('contenido'));
    var bloque=`
      <div id="${this.bloques.length}" class="col-xl-${this.adaptabilidad.xl}
      col-lg-${this.adaptabilidad.lg}
      col-md-${this.adaptabilidad.md}
      col-sm-${this.adaptabilidad.sm} 
      col-${this.adaptabilidad.xs}" style="background-color: red; height:${this.adaptabilidad.height}px">
      </div>
    `
    this.bloqueContenido.getElementById('contenido').innerHTML+=(bloque);
  }

  editarBloque(index){
    console.log(this.codeCSS);
    console.log(this.codeHTML)
  }

  eliminarBloque(){
    var bloque = this.bloqueContenido.getElementById(`${this.bloqueSeleccionado}`);
    bloque.remove();
    this.bloques.splice(this.bloqueSeleccionado-1, 1);
    this.modalService.dismissAll();
  }

  onFileSelected(event: HtmlInputEvent):void{
    if(event.target.files && event.target.files[0]){
      this.archivo=<File>event.target.files[0];
    }

    console.log(this.archivo);
  }

  actualizarContenido(){
    var contenido =this.bloqueContenido.getElementById(`${this.bloqueSeleccionado}`);
    contenido.innerHTML='';
    contenido.removeAttribute("class");
    contenido.removeAttribute("style");
    contenido.style.height=`${this.bloques[this.bloqueSeleccionado-1].adaptabilidad.height}px`;
    contenido.classList.add(`col-xl-${this.bloques[this.bloqueSeleccionado-1].adaptabilidad.xl}`,
    `col-lg-${this.bloques[this.bloqueSeleccionado-1].adaptabilidad.lg}`,
    `col-md-${this.bloques[this.bloqueSeleccionado-1].adaptabilidad.md}`,
    `col-sm-${this.bloques[this.bloqueSeleccionado-1].adaptabilidad.sm}`,
    `col-${this.bloques[this.bloqueSeleccionado-1].adaptabilidad.xs}`);
    console.log(contenido);
    if(this.codeHTML==undefined){
      this.codeHTML="";
    }
    if(this.codeCSS==undefined){
      this.codeCSS="";
    }
    if(this.editorContent==undefined){
      this.editorContent="";
    }
    this.bloques[this.bloqueSeleccionado-1]={
      adaptabilidad:this.adaptabilidad,
      editorFroala: this.editorContent,
      codeHTML:this.codeHTML,
      codeCSS:this.codeCSS
    }
    console.log(this.bloques);
    this.bloqueContenido.write(`<style>${this.codeCSS}</style>`);
    this.bloqueContenido.getElementById(this.bloqueSeleccionado).innerHTML+=this.editorContent;
    this.bloqueContenido.getElementById(this.bloqueSeleccionado).innerHTML+=this.codeHTML;
  }

  prueba(){
    var prueba="Probando"
    var codigo="Hola, ${prueba}"
    console.log(codigo);
    var res = codigo.replace("${prueba}", `${prueba}`)
    console.log(res);
  }

  guardarPagina(){
    console.log(<HTMLDivElement>document.getElementById('content'))
  }

  usarPlantilla(plantilla){
    console.log(plantilla)
    this.plantillaSeleccionada=plantilla;
    
    this.bloqueContenido.write(`<style>${plantilla.codigoCSS}</style>`)
    this.bloqueContenido.getElementById('contenido').innerHTML=plantilla.codigoHTML;
    this.bloqueContenido.write(`<script>${plantilla.codigoJS}</script>`)
  }
}
