export interface FileUrlManager {
  getUrl: (file: File) => string;
  revokeAll: () => void;
}

export function createFileUrlManager(): FileUrlManager {
  const urlCache = new Map<File, string>();

  const getUrl = (file: File): string => {
    let url = urlCache.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      urlCache.set(file, url);
    }
    return url;
  };

  const revokeAll = (): void => {
    urlCache.forEach(url => URL.revokeObjectURL(url));
    urlCache.clear();
  };

  return {
    getUrl,
    revokeAll,
  };
}
