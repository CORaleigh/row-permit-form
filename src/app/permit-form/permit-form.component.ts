import {
  Component,
  OnInit,
  ElementRef,
  ViewChild
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
  MatSnackBar, DateAdapter, MatButton
} from '@angular/material';

@Component({
  selector: 'app-permit-form',
  templateUrl: './permit-form.component.html',
  styleUrls: ['./permit-form.component.css']
})
export class PermitFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('resetButton') resetButton: MatButton;

  @ViewChild(EsriMapComponent) map;

  public featureLayer: any;
  public file: any;
  public fields: Array < any > = [];
  public location: any = null;
  public minDate: Date = new Date();
  public minEndDate: Date = new Date();
  public submitTouched: boolean = false;
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
      'ENTITY_TYPE': new FormControl(null, Validators.compose([Validators.required])),
      'COMPANY_NAME': new FormControl(null, Validators.compose([Validators.required])),
      'COMPANY_OTHER': new FormControl({
        value: null,
        disabled: true
      }, Validators.compose([Validators.required])),
      'CONTACT_NAME': new FormControl(null, Validators.compose([Validators.required])),
      'CONTACT_PHONE': new FormControl(null, Validators.compose([Validators.required, Validators.pattern(/\d{3}-\d{3}-\d{4}/g)])),
      'WORK_TYPE': new FormControl(null, Validators.compose([Validators.required])),
      'WORK_TYPE_OTHER': new FormControl({
        value: null,
        disabled: true
      }, Validators.compose([Validators.required])),      
      'STARTDATE': new FormControl(null, Validators.compose([Validators.required])),
      'ENDDATE': new FormControl(null, Validators.compose([Validators.required])),
      'REQUESTED_TIME': this.fb.group({
        'DAY_WORK': new FormControl(false, Validators.compose([])),
        'NIGHT_WORK': new FormControl(false, Validators.compose([])),
        'WEEKEND_WORK': new FormControl(false, Validators.compose([]))
      }, {validator: timeRequestedValidator}),
      'LANE_CLOSURE': this.fb.group({
        'FULL_CLOSURE': new FormControl(false, Validators.compose([])),
        'PARTIAL_CLOSURE': new FormControl(false, Validators.compose([])),
      }, {validator: laneClosureValidator}),      
      'OTHER_CLOSURE': this.fb.group({
        'SIDEWALK_CLOSURE': new FormControl(false, Validators.compose([])),
        'PARKING_CLOSURE': new FormControl(false, Validators.compose([])),
      }),      
      'PARKING_SPACES': new FormControl(
        {value: null,
        disabled: true
       }, Validators.compose([])),  
      'DETAILS': new FormControl(null, Validators.compose([])),
      'CONTACT_EMAIL': new FormControl(null, Validators.compose([Validators.required, emailOrEmpty])),
      'SECONDARY_EMAIL': new FormControl(null, emailOrEmpty),
      'SIGNATURE': new FormControl(null, Validators.compose([Validators.required])),
      'AGREED': new FormControl(false,  Validators.compose([Validators.requiredTrue])),
      'SIGNED_DATE': new FormControl(null,  Validators.compose([Validators.required])),      
    });

    this.permitForm.controls.STARTDATE.valueChanges.subscribe(e=> {
      if (e === '') {
        this.minEndDate = new Date();
      } else {
        this.minEndDate = e;
      }
    });
    function emailOrEmpty(control: AbstractControl): ValidationErrors | null {
      return control.value === '' || !control.value ? null : Validators.email(control);
    }
  
    function laneClosureValidator(group: FormGroup): ValidationErrors | null {
      let value = (group.controls.FULL_CLOSURE.value === true || group.controls.PARTIAL_CLOSURE.value === true);
      let error =  null
      if (value !== true) {
        error = Validators.email(group);
      }
      return error;
     // return control.value === '' ? null : Validators.email(control);
    }
    function timeRequestedValidator(group: FormGroup): ValidationErrors | null {
      let value = (group.controls.DAY_WORK.value === true || group.controls.NIGHT_WORK.value === true || group.controls.WEEKEND_WORK.value === true);
      let error =  null
      if (value !== true) {
        error = Validators.email(group);
      }
      return error;
     // return control.value === '' ? null : Validators.email(control);
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
    let group: FormGroup = this.permitForm.controls.OTHER_CLOSURE as FormGroup;
    group.controls.PARKING_CLOSURE.valueChanges.subscribe(e => {
      if (e) {
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
      this.clearAttachment();
    }
  }
  clearAttachment() {
    this.file = null;
    this.fileInput.nativeElement.value = '';
  }
  submitForm() {
    this.submitTouched = true;
    if (this.permitForm.valid && this.location) {
    return loadModules(['esri/Graphic'])
      .then(([Graphic]) => {
        let graphic = new Graphic();
        graphic.attributes = {};
        Object.keys(this.permitForm.value).forEach(key => {
          let value = this.permitForm.value[key];
          if (value instanceof Object && !(value !instanceof Date)) {
            Object.keys(value).forEach(key1 => {
              let value1 = value[key1];
              if (value1 === true) {
                graphic.attributes[key1] = 'Yes';
              } else if (value1 === false) {
                graphic.attributes[key1] = 'No';
              } else {
                graphic.attributes[key] = value1;
              }
            });
          } else {
            if (value === true) {
              graphic.attributes[key] = 'Yes';
            }  else if (value === false) {
                graphic.attributes[key] = 'No';
            } else {
              graphic.attributes[key] = value;
            }
          }
        });      
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
            if (this.file) {
              let attachUrl = this.featureLayer.url + '/0/' + results.addFeatureResults[0].objectId + '/addAttachment';            
              this.attachment.attachFile(attachUrl, this.file).then(result => {
                this.snackBar.open('File has successfully been uploaded.', 'Success', {
                  duration: 3000
                });
              });
            }
            this.resetButton._elementRef.nativeElement.click();
          }
        });
      });
    }
  }

  clearForm() {
    this.submitTouched = false;
    this.file = null;
    this.map.search.clear();
    this.location = null;
    window.scrollTo(0, 0);

  }

  locationSet(event) {
    this.location = event.results[0].feature;
  }

  ngOnInit() {
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
                  if (['AGREED', 'DAY_WORK', 'NIGHT_WORK', 'WEEKEND_WORK', 'FULL_CLOSURE', 'PARTIAL_CLOSURE', 'SIDEWALK_CLOSURE', 'PARKING_CLOSURE'].indexOf(field.name) > -1) {
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

