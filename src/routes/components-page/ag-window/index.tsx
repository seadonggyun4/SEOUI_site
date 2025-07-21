import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { DocSection } from '@/widget/doc-section';
import { docs } from './docs';
import { AgWindow } from '@/components/ag-window';
import './style.scss'

export default component$(() => {
  useVisibleTask$(() => {
    // Lit 컴포넌트 등록
    if (!customElements.get('ag-window')) {
      customElements.define('ag-window', AgWindow);
    }
  });

  return (
    <DocSection {...docs.window}>
      <ag-window class="first">
        <form
          class="form-example"
          preventdefault:submit
          onSubmit$={(ev) => {
            ev.preventDefault();
          }}
        >
        </form>
      </ag-window>
      <ag-window>
        <form
          class="form-example"
          preventdefault:submit
        >
          <h2 style="margin: 0; font-size: 2.4rem; text-align: center;">로그인</h2>

          <label style="display: flex; flex-direction: column; font-size: 1.4rem;">
            이메일
            <input
              type="email"
              name="email"
              required
              placeholder="이메일을 입력하세요"
              style="
                margin-top: 0.5rem;
                padding: 1rem;
                border: 1px solid #ccc;
              "
            />
          </label>

          <label style="display: flex; flex-direction: column; font-size: 1.4rem;">
            비밀번호
            <input
              type="password"
              name="password"
              required
              placeholder="비밀번호를 입력하세요"
              style="
                margin-top: 0.5rem;
                padding: 1rem;
                border: 1px solid #ccc;
              "
            />
          </label>

          <button
            type="submit"
            style="
              margin-top: 1rem;
              padding: 1rem 2rem;
              color: white;
              background-color: #4a90e2;
              border: none;
              cursor: pointer;
            "
          >
            로그인
          </button>
        </form>
      </ag-window>
    </DocSection>
  );
});
