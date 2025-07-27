import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { PageLoader } from '@/widget/page-loader';
import { PAGE_LOAD_TIME } from '@/config/common';
import { FirstPage } from '@/config/menu';

export default component$(() => {
  const nav = useNavigate();

  useVisibleTask$(() => {
    setTimeout(() => {
      nav(FirstPage);
    }, PAGE_LOAD_TIME)
  });

  return ( <PageLoader /> );
});
