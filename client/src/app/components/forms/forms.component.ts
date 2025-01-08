import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

type FormAnswer = FormGroup<{
  text: FormControl<string>;
}>;

type FormQuestion = FormGroup<{
  questionName: FormControl<string>;
  answers: FormArray<FormAnswer>;
}>;

type Form = FormGroup<{
  questions: FormArray<FormQuestion>;
}>;

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css',
})
export class FormsComponent {
  fb = inject(NonNullableFormBuilder);
  form: Form = this.fb.group({
    questions: this.fb.array<FormQuestion>([this.generateQuestion()]),
  });
  questions: FormArray<FormQuestion> = this.form.get('questions') as FormArray<FormQuestion>;

  generateQuestion(): FormQuestion {
    return this.fb.group({
      questionName: '',
      answers: this.fb.array<FormAnswer>([]),
    });
  }

  submit() {
    console.log(this.form.getRawValue());
  }
  
  addQuestion(): void {
    this.questions.push(this.generateQuestion());
  }
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }
  addAnswer(questionIndex: number): void {
    const answer: FormAnswer = this.fb.group({
      text: '',
    });
    this.questions.at(questionIndex)?.controls?.answers?.push(answer);
  }

  removeAnswer(questionIndex: number): void {
    this.questions.removeAt(questionIndex);
}
}
