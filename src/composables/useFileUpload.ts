import { ref, computed } from 'vue';
import { FILE_UPLOAD_CONFIG } from '@/config/constants';

interface UseFileUploadOptions {
  maxFiles?: number;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { maxFiles = FILE_UPLOAD_CONFIG.MAX_FILES } = options;

  const files = ref<File[]>([]);
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const fileCount = computed(() => files.value.length);
  const canAddMore = computed(() => fileCount.value < maxFiles);

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    const selected = Array.from(target.files || []);

    if (!selected.length) return;
    if (!canAddMore.value) return;

    files.value.push(...selected.slice(0, maxFiles - fileCount.value));
  }

  function handleFileDrop(e: DragEvent) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer?.files || []);

    if (!dropped.length) return;
    if (!canAddMore.value) return;

    files.value.push(...dropped.slice(0, maxFiles - fileCount.value));
  }

  function removeFile(index: number) {
    files.value.splice(index, 1);
  }

  function clearFiles() {
    files.value = [];
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }

  return {
    files,
    fileInputRef,
    fileCount,
    canAddMore,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
  };
}
