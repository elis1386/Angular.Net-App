import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../models/member';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../../member-messages/member-messages.component';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    TabsModule,
    GalleryModule,
    TimeagoModule,
    MemberMessagesComponent,
  ],
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  memberService = inject(MembersService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activateTab?: TabDirective;
  messages: Message[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => {
        this.member = data['member'];
        this.member &&
          this.member.photos.map((p) => {
            this.images.push(new ImageItem({ src: p.url, thumb: p.url }));
          });
      },
    });
    this.route.queryParamMap.subscribe({
      next: (params) => {
        const tab = params.get('tab');
        if (tab) {
          this.selectTab(tab);
        }
      },
    });
  }
  onUpdateMessages(event: Message) {
    this.messages.push(event);
  }
  selectTab(heading: string): void {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(
        (x) => x.heading === heading,
      );
      if (messageTab) messageTab.active = true;
    }
  }
  onTabActivated(data: TabDirective) {
    this.activateTab = data;
    if (
      this.activateTab.heading === 'Messages' &&
      this.messages.length === 0 &&
      this.member
    ) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: (messages) => (this.messages = messages),
      });
    }
  }
}
