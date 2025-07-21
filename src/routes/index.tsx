import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const nav = useNavigate();

  useVisibleTask$(() => {
    nav('components-page/ag-button');
  });

  return null;
});
