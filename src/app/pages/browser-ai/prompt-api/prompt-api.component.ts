import {Component, Input} from '@angular/core';
import {MediaInformationInterface} from './media-information.interface';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-prompt-api',
  templateUrl: './prompt-api.component.html',
  standalone: false,
  styleUrl: './prompt-api.component.scss'
})
export class PromptApiComponent {
  medias: MediaInformationInterface[] = [
  ];

  drop(event: CdkDragDrop<any[]>) {
    // Update your data based on the drop event
    moveItemInArray(this.medias, event.previousIndex, event.currentIndex);
  }

  deleteMedia(index: number) {
    this.medias.splice(index, 1);
  }

  getImageSrc(media: MediaInformationInterface) {
    return URL.createObjectURL(media.content);
  }

  getAudioSrc(media: MediaInformationInterface) {
    return URL.createObjectURL(media.content);
  }

  onFileSystemHandlesDropped(fileSystemHandles: FileSystemHandle[]) {
    fileSystemHandles.forEach(async (fileSystemHandle) => {
      if(fileSystemHandle.kind === "directory") {
        return;
      }

      const fileSystemFileHandle = fileSystemHandle as FileSystemFileHandle;
      const file = await fileSystemFileHandle.getFile()

      if(file.type.startsWith("image")) {
        this.medias.push({
          type: 'image',
          content: file,
          filename: file.name,
          includeInPrompt: true,
          fileSystemFileHandle,
        });
      }
      else if(file.type.startsWith("audio")) {
        this.medias.push({
          type: 'audio',
          content: file,
          filename: file.name,
          includeInPrompt: true,
          fileSystemFileHandle,
        });
      }
    })
  }
}
