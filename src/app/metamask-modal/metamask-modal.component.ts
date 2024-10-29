import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-metamask-modal',
  templateUrl: './metamask-modal.component.html',
  styleUrls: ['./metamask-modal.component.css']
})
export class MetamaskModalComponent implements OnInit {

  // @ViewChild('myModel',{static: false}) myModel: ModalDirective;
  @ViewChild('content') content: any;
	// modalRef: BsModalRef;
  
  // constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  public open() {
    if(!true){
      // Dont open the modal
    } else {
       // Open the modal
       this.content.open();
    }

  }

}
