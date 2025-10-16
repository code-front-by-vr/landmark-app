import { ref, computed } from 'vue';
import { FILE_UPLOAD_CONFIG } from '@/config/constants';

interface UseFileUploadOptions {
  maxFiles?: number;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxFiles = FILE_UPLOAD_CONFIG.MAX_FILES } = options;

  const files = ref<File[]>([]);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const fileIdMap = new Map<File, string>();

  const canAddMore = computed(() => files.value.length < maxFiles);

  function getFileId(file: File): string {
    let id = fileIdMap.get(file);
    if (!id) {
      id = crypto.randomUUID();
      fileIdMap.set(file, id);
    }
    return id;
  }

  function addFiles(newFiles: File[]) {
    if (!newFiles.length) return;
    if (!canAddMore.value) return;

    const filesToAdd = newFiles.slice(0, maxFiles - files.value.length);
    filesToAdd.forEach(file => fileIdMap.set(file, crypto.randomUUID()));

    files.value.push(...filesToAdd);
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const selected = Array.from(target.files || []);
    addFiles(selected);
    target.value = '';
  }

  function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer?.files || []);
    addFiles(dropped);
  }

  function removeFile(fileId: string) {
    const fileToRemove = files.value.find(file => getFileId(file) === fileId);
    if (fileToRemove) {
      files.value = files.value.filter(file => file !== fileToRemove);
      fileIdMap.delete(fileToRemove);
    }
  }

  function clearFiles() {
    files.value = [];
    fileIdMap.clear();
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }

  return {
    files,
    fileInputRef,
    canAddMore,
    getFileId,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
  };
}
