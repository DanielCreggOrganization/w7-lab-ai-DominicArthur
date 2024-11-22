import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, 
         IonGrid, IonRow, IonCol, IonCard, IonCardContent, 
         IonCardHeader, IonCardTitle, IonItem, IonLabel, 
         IonButton, IonIcon, IonProgressBar, IonText,
         IonRadioGroup, IonRadio, IonImg, IonTextarea,
         IonRippleEffect } from '@ionic/angular/standalone';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonProgressBar,
    IonText,
    IonRadioGroup,
    IonRadio,
    IonImg,
    IonTextarea,
    IonRippleEffect,
  ]
})
export class HomePage {
  prompt = "Provide a recipe for these baked goods"; 
  output = '';
  isLoading = false;

  availableImages = [
    { url: 'assets/images/baked_goods_1.jpg', label: 'Baked Good 1' },
    { url: 'assets/images/baked_goods_2.jpg', label: 'Baked Good 2' },
    { url: 'assets/images/baked_goods_3.jpg', label: 'Baked Good 3' }
  ];

  selectedImage = this.availableImages[0].url;

  get formattedOutput() {
    return this.output.replace(/\n/g, '<br>');
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }

  async onSubmit() {
    if (this.isLoading) return;
    this.isLoading = true;
  
    try {
      // Fetching the selected image and converting it to base64
      const response = await fetch(this.selectedImage);
      const blob = await response.blob();
      const base64data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      const base64String = base64data.split(',')[1];
  
      // AI Integration making the AI Client and generating the content
      const genAI = new GoogleGenerativeAI(environment.apiKey);
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: 'gemini' });
      // Call the generateContent method
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64String
              }
            },
            {
              text: this.prompt
            }
          ]
        }]
      });
      
      // Update the output with the response
      this.output = result.response.text();
  
    } catch (e) {
      this.output = `Error: ${e instanceof Error ? e.message : 'Unknown error'}`;
    }
  
    this.isLoading = false;
  }
}