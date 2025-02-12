import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { Member } from '../../../models/member';
import { AuthService } from '../../../services/auth.service';
import { MembersService } from '../../../services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, CommonModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent {
  @ViewChild('editForm') editForm?: NgForm;
  //ask you to save change before leave this site
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  member?: Member;
  private authService = inject(AuthService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.authService.currentUser();
    if (!user) return;
    this.memberService.getMember(user.username).subscribe({
      next: (member) => (this.member = member),
    });
  }
  updateMember() {
    console.log(this.member);
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        this.toastr.success('Profile updated succesfully');
        this.editForm?.reset(this.member);
      },
    });
  }
  onMemberChange(event: Member) {
    this.member = event;
  }
}
