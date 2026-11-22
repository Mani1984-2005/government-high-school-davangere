import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GALLERY_PHOTOS } from '../data/schoolData';
import { GalleryPhoto } from '../types';
import { Button, Modal, SafeImage, SectionHeading, Tabs, TabItem } from './ui';

type GalleryCategory = 'all' | GalleryPhoto['category'];

export const GallerySection: React.FC = () => {
  const { lang, t, pick } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories: TabItem<GalleryCategory>[] = [
    { id: 'all', label: lang === 'kn' ? 'ಎಲ್ಲವೂ (All)' : 'All Photos' },
    { id: 'campus', label: lang === 'kn' ? 'ಶಾಲಾ ಆವರಣ' : 'Campus' },
    { id: 'academics', label: lang === 'kn' ? 'ಪ್ರಯೋಗಾಲಯ & ಬಿಸಿಯೂಟ' : 'Labs & Meals' },
    { id: 'sports', label: lang === 'kn' ? 'ಕ್ರೀಡೆ & ರಾಜ್ಯೋತ್ಸವ' : 'Sports & Culture' },
  ];

  const filteredPhotos = GALLERY_PHOTOS.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const activePhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  const handlePrev = useCallback(() => {
    setLightboxIndex((idx) => {
      if (idx === null || filteredPhotos.length === 0) return null;
      return (idx - 1 + filteredPhotos.length) % filteredPhotos.length;
    });
  }, [filteredPhotos.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((idx) => {
      if (idx === null || filteredPhotos.length === 0) return null;
      return (idx + 1) % filteredPhotos.length;
    });
  }, [filteredPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleArrows = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleArrows);
    return () => window.removeEventListener('keydown', handleArrows);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-section-heading"
      className="py-12 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <SectionHeading
          headingId="gallery-section-heading"
          kickerEn="CAMPUS LIFE · PHOTO GALLERY"
          kickerKn="ಭಾವಚಿತ್ರಗಳ ಸಂಗ್ರಹ"
          title={t.gallery_heading}
          subtitle={t.gallery_sub}
        />

        {/* Accessible ARIA Filter Tabs */}
        <Tabs
          items={categories}
          activeId={selectedCategory}
          onChange={(nextCat) => {
            setSelectedCategory(nextCat);
            setLightboxIndex(null);
          }}
          ariaLabel={t.gallery_heading}
          idPrefix="gallery-filter"
        />

        {/* Keyboard-Accessible Photo Grid */}
        <div
          id={`gallery-filter-panel-${selectedCategory}`}
          role="tabpanel"
          aria-labelledby={`gallery-filter-tab-${selectedCategory}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredPhotos.map((photo, idx) => {
            const title = pick(photo.titleKn, photo.titleEn);
            const caption = pick(photo.captionKn, photo.captionEn);
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightboxIndex(idx)}
                aria-label={`${title} — ${pick('ದೊಡ್ಡದಾಗಿ ವೀಕ್ಷಿಸಿ', 'View enlarged photo')}`}
                className="group text-left rounded-lg overflow-hidden border border-slate-200 bg-white shadow-2xs hover:border-[#13325e] transition-colors cursor-pointer flex flex-col focus:outline-none"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                  <SafeImage
                    src={photo.image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 motion-reduce:group-hover:scale-100 transition-transform duration-300"
                  />
                  <span
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-md bg-slate-950/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                    aria-hidden="true"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
                <div className="p-3.5 space-y-1 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-[#13325e] leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{caption}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <Modal
        isOpen={Boolean(activePhoto)}
        onClose={() => setLightboxIndex(null)}
        titleId="gallery-lightbox-title"
        subtitle={
          activePhoto && lightboxIndex !== null
            ? `${lightboxIndex + 1} / ${filteredPhotos.length} · ${pick(
                'ಶಾಲಾ ಛಾಯಾಂಕಣ',
                'School Photo Archive'
              )}`
            : undefined
        }
        title={activePhoto ? pick(activePhoto.titleKn, activePhoto.titleEn) : ''}
        closeLabel={t.a11y_close_dialog}
        maxWidth="3xl"
        footer={
          filteredPhotos.length > 1 ? (
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                {t.gallery_prev_photo}
              </Button>
              <span className="text-xs font-mono text-slate-600 tabular-nums">
                {(lightboxIndex ?? 0) + 1} / {filteredPhotos.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                {t.gallery_next_photo}
              </Button>
            </div>
          ) : undefined
        }
      >
        {activePhoto && (
          <div className="space-y-4">
            <div className="aspect-16/10 max-h-[60vh] w-full rounded-md overflow-hidden bg-slate-900 border border-slate-200">
              <SafeImage
                src={activePhoto.image}
                alt={pick(activePhoto.titleKn, activePhoto.titleEn)}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {pick(activePhoto.captionKn, activePhoto.captionEn)}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
};
