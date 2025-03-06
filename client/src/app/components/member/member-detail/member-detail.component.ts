import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../../models/member';
import { CommonModule } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessagesComponent } from '../../member-messages/member-messages.component';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';

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
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  memberService = inject(MembersService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activateTab?: TabDirective;
  router = inject(Router);

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
    this.route.paramMap.subscribe({
      next: () => this.onRouteParamsChange(),
    });
  }

  selectTab(heading: string): void {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(
        (x) => x.heading === heading,
      );
      if (messageTab) messageTab.active = true;
    }
  }

  onRouteParamsChange() {
    const user = this.authService.currentUser();
    if (!user) return;
    if (
      this.messageService.hubConnection?.state ===
        HubConnectionState.Connected &&
      this.activateTab?.heading
    ) {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username);
      });
    }
  }

  onTabActivated(data: TabDirective) {
    this.activateTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.activateTab.heading },
      queryParamsHandling: 'merge',
    });
    if (this.activateTab.heading === 'Messages' && this.member) {
      const user = this.authService.currentUser();
      if (!user) return;
      this.messageService.createHubConnection(user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy() {
    this.messageService.stopHubConnection();
  }
}
