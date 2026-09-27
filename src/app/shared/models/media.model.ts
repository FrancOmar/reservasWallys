export interface MediaItem {
  id: string;
  wallyId: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  category: 'GALLERY' | 'BANNER' | 'COURT' | 'FACILITY';
}
