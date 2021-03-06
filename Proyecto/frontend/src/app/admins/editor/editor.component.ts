import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { faBars, faEye, faPlus, faTrashAlt, faEdit, faImages} from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImagenesService } from 'src/app/services/imagenes.service';
//import { read } from 'fs';
import { PlantillasService } from 'src/app/services/plantillas.service';

interface HtmlInputEvent extends Event{
  target : HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  public isMenuCollapsed=true;
  faBars=faBars;
  faImages=faImages;
  faEdit=faEdit;
  faEye=faEye;
  faPlus=faPlus;
  faTrashAlt=faTrashAlt;

  editorOptions=[
    {theme: 'vs-dark', language:'html'},
    {theme: 'vs-dark', language:'css'},
    {theme: 'vs-dark', language:'javascript'}];
  errorMessage:String='';
  errorBool:Boolean;
  successMessage:String='';
  successBool:Boolean;

  editorPreview:any;
  codeHTML: string;
  codeCSS: string;
  codeJS: string;
  idPlantilla:String;
  editTemplate:any;
  plantilla:any={
    tituloTema:'',
    descripcion:'',
    codigoHTML:'',
    codigoCSS:'',
    codigoJS:'',
    imagenes:[]
  }
  file:File;

  constructor(private modalService:NgbModal,
    private plantillasService:PlantillasService,
    private titleService:Title,
    private imagenesService:ImagenesService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Administración');  
  }

  agregarPlantilla(){
    this.plantilla.codigoHTML=this.codeHTML;
    this.plantilla.codigoCSS=this.codeCSS;
    this.plantilla.codigoJS=this.codeJS;
    if(this.plantilla.tituloTema == '' || this.plantilla.descripcion == ''){
      this.errorMessage="Todos los campos son obligatorios";
      this.errorBool=true;
    } else if(this.idPlantilla!=undefined){
      this.plantillasService.updateTemplate(this.idPlantilla, this.plantilla)
      .subscribe( res => {
          this.successMessage=res.message;
          this.successBool=true;
      }, error => {
          this.errorBool=error.error.message;
          this.errorBool=true;
      })
    }else{
      console.log(this.plantilla)
      this.plantillasService.addTemplate(this.plantilla)
      .subscribe(
        res=>{
          console.log(res);
          this.successMessage=res.message;
          this.successBool=true;
        }, error => {
          this.errorBool=error.error.message;
          this.errorBool=true;
        }
      )
    }
    setTimeout(() => {
      this.errorBool=false;
      this.successBool=false;
    }, 5000);
  }

  nuevaPlantilla(){
    this.idPlantilla='';
    this.plantilla={
      tituloTema:'',
      descripcion:'',
      codigoHTML:'',
      codigoCSS:'',
      codigoJS:'',
      imagenes:[]
    }
    this.codeHTML="";
    this.codeCSS="";
    this.codeJS="";
  }

  
  open(content) {
    this.modalService.open(content, { centered:true })
  }

  obtenerPlantilla(){
    this.plantillasService.getTemplate(this.idPlantilla)
    .subscribe(res => {
      this.modalService.dismissAll();
      this.codeHTML=res[0].codigoHTML;
      this.codeJS=res[0].codigoJS;
      this.codeCSS=res[0].codigoCSS;
      this.plantilla.tituloTema=res[0].tituloTema;
      this.plantilla.descripcion=res[0].descripcion;
      this.plantilla.imagenes=res[0].imagenes;
    }, error => {
      console.log(error);
    });
  }

  preview(){
    this.editorPreview = (<HTMLIFrameElement>document.getElementById('editorPreview')).contentWindow.document;
    this.editorPreview.open();
    this.editorPreview.write(`<style>${this.codeCSS}</style>`);
    this.editorPreview.write(this.codeHTML);
    this.editorPreview.write(`<script>${this.codeJS}</script>`);
    this.editorPreview.close();
    console.log((<HTMLIFrameElement>document.getElementById('editorPreview')).contentWindow.document.getElementById('prueba'));
  }

  onPhotoSelected(event: HtmlInputEvent):void{
    if(event.target.files && event.target.files[0]){
      this.file=<File>event.target.files[0];
    }
  }

  subirFoto(){
    this.imagenesService.addImage(this.file)
    .subscribe(result => {
      this.plantilla.imagenes.push(result);
      console.log(this.plantilla.imagenes);
    }, error => console.log(error))
  }

  eliminarImagen(id, index){
    this.imagenesService.deleteImage(id)
    .subscribe(res => {
      console.log(res);
    }, error => console.log(error));
    this.plantilla.imagenes.splice(index, 1);
  }
}
