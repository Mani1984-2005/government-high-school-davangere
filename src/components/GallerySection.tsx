import React, { useState, useEffect } from 'react';
import { Language, GalleryPhoto } from '../types';
import { UI_STRINGS } from '../data/translations';
import { GALLERY_PHOTOS } from '../data/schoolData';

interface GallerySectionProps {
  lang: Language;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ lang }) => {
  const t = UI_STRINGS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxPhoto) {
        setLightboxPhoto(null);
      }
    };
    if (lightboxPhoto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxPhoto]);

  const categories = [
    { id: 'all', label: lang === 'kn' ? 'ಎಲ್ಲವೂ (All)' : 'All Photos' },
    { id: 'campus', label: lang === 'kn' ? 'ಶಾಲಾ ಆವರಣ' : 'Campus' },
    { id: 'academics', label: lang === 'kn' ? 'ಪ್ರಯೋಗಾಲಯ & ಬಿಸಿಯೂಟ' : 'Labs & Meals' },
    { id: 'sports', label: lang === 'kn' ? 'ಕ್ರೀಡೆ & ರಾಜ್ಯೋತ್ಸವ' : 'Sports & Culture' },
  ];

  const filteredPhotos = GALLERY_PHOTOS.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span>CAMPUS LIFE · PHOTO GALLERY</span>
            <span>·</span>
            <span>ಭಾವಚಿತ್ರಗಳ ಸಂಗ್ರಹ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#13325e]">
            {t.gallery_heading}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t.gallery_sub}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6" role="tablist">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#13325e] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setLightboxPhoto(photo)}
              className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer"
            >
              <div className="aspect-4/3 w-full overflow-hidden">
                <img
                  src={photo.image}
                  alt={lang === 'kn' ? photo.titleKn : photo.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3 bg-white">
                <h3 className="text-xs font-bold text-[#13325e] line-clamp-1">
                  {lang === 'kn' ? photo.titleKn : photo.titleEn}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {lang === 'kn' ? photo.captionKn : photo.captionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-3xl w-full shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 max-h-[70vh] bg-slate-900">
              <img
                src={lightboxPhoto.image}
                alt={lang === 'kn' ? lightboxPhoto.titleKn : lightboxPhoto.titleEn}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm cursor-pointer shadow-md"
                aria-label="Close photo"
              >
                ✕
              </button>
            </div>
            <div className="p-4 pt-0">
              <h3 className="text-base font-bold text-[#13325e]">
                {lang === 'kn' ? lightboxPhoto.titleKn : lightboxPhoto.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {lang === 'kn' ? lightboxPhoto.captionKn : lightboxPhoto.captionEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
