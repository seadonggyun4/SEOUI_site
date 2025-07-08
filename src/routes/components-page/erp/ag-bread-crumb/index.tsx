import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';

export default component$(() => {
  useVisibleTask$(() => {
    const breadcrumb = document.querySelector('ag-breadcrumb');
    if (breadcrumb) {
      (breadcrumb as any).items = [
        { label: '서비스', path: '/service' },
        { label: '신청', path: '/service/apply' },
      ];
      (breadcrumb as any).root = '/';
      (breadcrumb as any).currentUrl = '/service/apply';
    }
  });

  return (
    <>
      <DocSection {...docs.breadcrumb}>
        <ag-breadcrumb></ag-breadcrumb>
      </DocSection>
    </>
  );
});
