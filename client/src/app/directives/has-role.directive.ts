import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]', //*appHasRole
  standalone: true,
})
export class HasRoleDirective {
  @Input() appHasRole: string[] = [];
  authService = inject(AuthService);
  viewContinerRef = inject(ViewContainerRef);
  templateRef = inject(TemplateRef);

  ngOnInit() {
    if (
      this.authService.roles()?.some((role) => this.appHasRole.includes(role))
    ) {
      this.viewContinerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContinerRef.clear();
    }
  }
}
