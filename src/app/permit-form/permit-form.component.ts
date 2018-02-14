import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {
  EsriMapComponent
} from '../esri-map/esri-map.component';
import {
  loadModules
} from 'esri-loader';
import {
  AttachmentsService
} from '../attachments.service';
import {
  MatSnackBar, DateAdapter
} from '@angular/material';

@Component({
  selector: 'app-permit-form',
  templateUrl: './permit-form.component.html',
  styleUrls: ['./permit-form.component.css']
})
export class PermitFormComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(EsriMapComponent) map;

  public featureLayer: any;
  public file: any;
  public fields: Array < any > = [];
  public location: any = null;
  public minDate: Date = new Date();
  public minEndDate: Date = new Date();
  public fieldOrder: Array < string > = ['ENTITY_TYPE',
'COMPANY_NAME',
'COMPANY_OTHER',
'WORK_TYPE',
'WORK_TYPE_OTHER',
'CONTACT_NAME',
'CONTACT_PHONE',
'CONTACT_EMAIL',
'SECONDARY_EMAIL',
'STARTDATE',
'ENDDATE',
'DAY_WORK',
'NIGHT_WORK',
'WEEKEND_WORK',
'FULL_CLOSURE',
'PARTIAL_CLOSURE',
'SIDEWALK_CLOSURE',
'PARKING_CLOSURE',
'PARKING_SPACES',
'DETAILS',
'AGREED',
'SIGNATURE',
'SIGNED_DATE'];
  public permitForm: FormGroup;

  constructor(public fb: FormBuilder, public attachment: AttachmentsService, public snackBar: MatSnackBar) {
    this.buildForm();
  }

  getMinDate(field) {
    if (field === 'ENDDATE') {
       return this.minEndDate;
    } else if (field === 'STARTDATE') {
      return this.minDate;
    }
  }

  buildForm() {
    this.permitForm = this.fb.group({
      'ENTITY_TYPE': new FormControl('', Validators.compose([Validators.required])),
      'COMPANY_NAME': new FormControl('', Validators.compose([Validators.required])),
      'COMPANY_OTHER': new FormControl({
        value: '',
        disabled: true
      }, Validators.compose([Validators.required])),
      'CONTACT_NAME': new FormControl('', Validators.compose([Validators.required])),
      'CONTACT_PHONE': new FormControl('', Validators.compose([Validators.required, Validators.pattern(/\d{3}-\d{3}-\d{4}/g)])),
      'WORK_TYPE': new FormControl('', Validators.compose([Validators.required])),
      'WORK_TYPE_OTHER': new FormControl({
        value: '',
        disabled: true
      }, Validators.compose([Validators.required])),      
      'STARTDATE': new FormControl('', Validators.compose([Validators.required])),
      'ENDDATE': new FormControl('', Validators.compose([Validators.required])),
      'DAY_WORK': new FormControl('', Validators.compose([])),
      'NIGHT_WORK': new FormControl('', Validators.compose([])),
      'WEEKEND_WORK': new FormControl('', Validators.compose([])),
      'FULL_CLOSURE': new FormControl('', Validators.compose([Validators.required])),
      'PARTIAL_CLOSURE': new FormControl('', Validators.compose([Validators.required])),
      'PARKING_CLOSURE': new FormControl('', Validators.compose([Validators.required])),
      'PARKING_SPACES': new FormControl(
        {value: '',
        disabled: true
       }, Validators.compose([Validators.required])),  
      'SIDEWALK_CLOSURE': new FormControl('', Validators.compose([Validators.required])),
      'DETAILS': new FormControl('', Validators.compose([Validators.required])),
      'CONTACT_EMAIL': new FormControl('', Validators.compose([Validators.required, emailOrEmpty])),
      'SECONDARY_EMAIL': new FormControl('', emailOrEmpty),
      'SIGNATURE': new FormControl('', Validators.compose([Validators.required])),
      'AGREED': new FormControl('',  Validators.compose([Validators.required])),
      'SIGNED_DATE': new FormControl('',  Validators.compose([Validators.required])),      
    });
    this.permitForm.controls.STARTDATE.valueChanges.subscribe(e=> {
      if (e === '') {
        this.minEndDate = new Date();
      } else {
        this.minEndDate = e;
      }
    });
    function emailOrEmpty(control: AbstractControl): ValidationErrors | null {
      return control.value === '' ? null : Validators.email(control);
    }


    this.permitForm.controls.COMPANY_NAME.valueChanges.subscribe(e => {
      if (e === 'Other') {
        this.permitForm.controls.COMPANY_OTHER.enable();
        this.permitForm.controls.COMPANY_OTHER.setValue('');
      } else {
        this.permitForm.controls.COMPANY_OTHER.disable();
      }
    });
    this.permitForm.controls.WORK_TYPE.valueChanges.subscribe(e => {
      if (e === 'Other') {
        this.permitForm.controls.WORK_TYPE_OTHER.enable();
        this.permitForm.controls.WORK_TYPE_OTHER.setValue('');
      } else {
        this.permitForm.controls.WORK_TYPE_OTHER.disable();
      }
    });    
    this.permitForm.controls.PARKING_CLOSURE.valueChanges.subscribe(e => {
      if (e === 'Yes') {
        this.permitForm.controls.PARKING_SPACES.enable();
      } else {
        this.permitForm.controls.PARKING_SPACES.disable();
      }
    });
  }

  setFieldVisible(name, visible) {
    this.fields.forEach(field => {
      if (field.name === name) {
        field.visible = visible;
        this.updateRequired(name, visible);
      }
    });
  }
  updateRequired(field, required) {
    if (required) {
      this.permitForm.get(field).enable();
    } else {
      this.permitForm.get(field).disable();
    }
  }

  fileAdded(event) {
    if (event.target.files[0].size <= 10000000) {
      this.file = event.target.files[0];
    } else {
      this.snackBar.open('File size must be under 10MB, this file is ' + (event.target.files[0].size / 1000000).toFixed(3) + 'MB', 'File Too Large', {
        duration: 3000
      });
    }
  }
  clearAttachment() {
    this.file = null;
    this.fileInput.nativeElement.value = '';
  }
  submitForm() {
    return loadModules(['esri/Graphic'])
      .then(([Graphic]) => {
        let graphic = new Graphic();
        graphic.attributes = this.permitForm.value;
        if (graphic.attributes.DAY_WORK === true) {
          graphic.attributes.DAY_WORK = 'Yes';
        } else {
          graphic.attributes.DAY_WORK = 'No';
        }
        if (graphic.attributes.NIGHT_WORK === true) {
          graphic.attributes.NIGHT_WORK = 'Yes';
        } else {
          graphic.attributes.NIGHT_WORK = 'No';
        }
        if (graphic.attributes.WEEKEND_WORK === true) {
          graphic.attributes.WEEKEND_WORK = 'Yes';
        } else {
          graphic.attributes.WEEKEND_WORK = 'No';
        }                
        if (graphic.attributes.AGREED === true) {
          graphic.attributes.AGREED = 'Yes';
        } else {
          graphic.attributes.AGREED = 'No';
        }               
        debugger
        graphic.attributes.APPROVE = 'No';
        graphic.attributes.ASSIGNED = 'No';
        graphic.attributes.FORM = 'Yes';
        graphic.attributes.ADDRESS = this.map.search.results[0].results[0].feature.attributes.Match_addr
        graphic.geometry = this.map.search.results[0].results[0].feature.geometry;
        let promise = this.featureLayer.applyEdits({
          addFeatures: [graphic]
        }).then(results => {
          if (results.addFeatureResults[0].objectId) {
            this.snackBar.open('Permit request has successfully been submitted', 'Success', {
              duration: 3000
            });
            let attachUrl = this.featureLayer.url + '/0/' + results.addFeatureResults[0].objectId + '/addAttachment';
            this.clearForm();
            this.attachment.attachFile(attachUrl, this.file).then(result => {
              this.snackBar.open('File has successfully been uploaded.', 'Success', {
                duration: 3000
              });
            });
          }
        });
      });
  }

  clearForm() {
    debugger
    this.permitForm.reset();
    this.permitForm.updateValueAndValidity()
    this.map.search.clear();
    this.location = null;
    window.scrollTo(0, 0);

  }

  locationSet(event) {
    this.location = event.results[0].feature;
  }

  ngAfterViewInit() {
    return loadModules(['esri/layers/FeatureLayer'])
      .then(([FeatureLayer]) => {
        this.featureLayer = new FeatureLayer("https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Right_Of_Way_Permit_Submittal/FeatureServer/0");
        this.featureLayer.load();
        this.featureLayer.when(layer => {
          layer.fields.sort((a, b) => {
            if (this.fieldOrder.indexOf(a.name) < this.fieldOrder.indexOf(b.name)) {
              return -1;
            }
            if (this.fieldOrder.indexOf(a.name) > this.fieldOrder.indexOf(b.name)) {
              return 1;
            }
            return 0;
          });
          layer.fields.forEach(field => {
    
           if (field.editable && this.fieldOrder.indexOf(field.name) > -1) {
              if (field.domain) {
                if (field.domain.name === 'YES_NO') {
                  if (['AGREED', 'DAY_WORK', 'NIGHT_WORK', 'WEEKEND_WORK'].indexOf(field.name) > -1) {
                    field.formType = 'checkbox';
                  } else {
                    field.formType = 'radio';
                  }
                } else {
                  field.formType = 'select';
                }
              } else {
                if (field.type === 'date') {
                  field.formType = 'date';
                } else if (field.name.indexOf('EMAIL') > -1) {
                  field.formType = 'email';
                } else if (field.length > 100) {
                  field.formType = 'textarea';
                } else {
                  field.formType = 'input';
                }
              }
              if (field.name.indexOf('PHONE') > -1) {
                field.length = 12;
              }
            }
          });
          this.fields = layer.fields;
        });
      })
  }
}

