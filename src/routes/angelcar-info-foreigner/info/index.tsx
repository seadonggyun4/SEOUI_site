import { component$, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import { contentData, type Section } from './content';
import './style.scss';

export default component$(() => {
  const activeTab = useSignal('info');
  const activeLang = useSignal('en');
  const isUserAuthenticated = useSignal(false); // 사용자 인증 상태
  const userName = useSignal(''); // 사용자명

  // 인증 상태 확인
  useVisibleTask$(() => {
    try {
      const foreignerAppData = sessionStorage.getItem('foreignerApp');
      if (foreignerAppData) {
        const parsedData = JSON.parse(foreignerAppData);
        if (parsedData.userName && parsedData.userName.trim()) {
          isUserAuthenticated.value = true;
          userName.value = parsedData.userName;
        }
      }
    } catch (error) {
      console.error('Failed to parse foreignerApp data:', error);
      isUserAuthenticated.value = false;
    }
  });

  const switchTab = $((tabId: string) => {
    activeTab.value = tabId;
  });

  // 플로팅 버튼 클릭 핸들러
  const handleFloatingBtnClick = $(() => {
    if (!isUserAuthenticated.value) {
      // 인증되지 않은 경우 로그인 페이지로 이동
      window.location.href = '/angelcar-info-foreigner/user/';
    } else {
      // 인증된 경우 메뉴 토글
      const menu = document.getElementById('circularMenu');
      menu?.classList.toggle('active');
    }
  });

  const currentContent = contentData[activeLang.value as keyof typeof contentData];

  // 섹션 렌더링 함수
  const renderSection = (section: Section) => {
    // 강조할 텍스트 처리 함수
    const renderContentWithStrong = (content: string[], strongTexts?: string[]) => {
      return content.map((line, lineIndex) => {
        if (!line.trim()) return <br key={lineIndex} />;

        let processedLine = line;
        if (strongTexts) {
          strongTexts.forEach(strongText => {
            if (line.includes(strongText)) {
              processedLine = processedLine.replace(
                strongText,
                `<strong>${strongText}</strong>`
              );
            }
          });
        }

        // angelcar 브랜드명 강조
        if (line.includes('angelcar') && !line.includes('<strong>')) {
          processedLine = processedLine.replace('angelcar', '<span class="primary">angelcar</span>');
        }

        return (
          <span key={lineIndex}>
            <span dangerouslySetInnerHTML={processedLine}></span>
            <br />
          </span>
        );
      });
    };

    return (
      <div>
        {section.heading && <h3 class="section-header">{section.heading}</h3>}
        {section.subheading && <h4>{section.subheading}</h4>}
        {section.content && section.content.length > 0 && (
          <p>
            {renderContentWithStrong(section.content, section.strongTexts)}
          </p>
        )}

        {section.hasLinks && section.links && (
          <div class="link-box">
            {section.links.map((link, index) => (
              <a key={index} href={link.url}>
                <img src={link.imgSrc} alt={link.alt} />
              </a>
            ))}
          </div>
        )}

        {section.hasImages && section.images && (
          <div class="img-box">
            {section.images.map((image, index) => (
              image.link ? (
                <a key={index} href={image.link}>
                  <img src={image.src} alt={image.alt} />
                </a>
              ) : (
                <img key={index} src={image.src} alt={image.alt} />
              )
            ))}
          </div>
        )}

        {section.hasSteps && section.steps && (
          <div class="steps-container">
            {section.steps.map((step, index) => (
              <p key={index}>
                Step 0{step.stepNumber}. {step.description}<br/>
                <div class="img-box">
                  <img src={step.imageSrc} alt={`step 0${step.stepNumber}`} />
                </div>
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div class="container">
      {/* Header */}
      <header>
        <div class="banner-img-box">
          <figure>
            <picture>
              <source srcset="/angelcar-info-foreigner/img/banner_mo.jpg" media="(max-width: 600px)" />
              <source srcset="/angelcar-info-foreigner/img/banner_ta.jpg" media="(max-width: 1200px)" />
              <img src="/angelcar-info-foreigner/img/banner.jpg" alt="angelcar" />
            </picture>
          </figure>
          <h1>
            <img src="/angelcar-info-foreigner/img/logo.png" alt="JEJU ANGEL RENT A CAR" />
          </h1>
        </div>
        <div class="info-box">
          <div class="info-box-text">
            <h2>'{currentContent.meta.title}' Rental Info.</h2>
            <p>{currentContent.meta.partnerTitle}</p>
            <ul class="info-box-imgs">
              <li><img src="/angelcar-info-foreigner/img/trip.png" alt="trip" /></li>
              <li><img src="/angelcar-info-foreigner/img/qeeq.png" alt="qeeq" /></li>
              <li><img src="/angelcar-info-foreigner/img/zuzuche.jpeg" alt="zuzuche" /></li>
              <li><img src="/angelcar-info-foreigner/img/yesaway.jpeg" alt="yesaway" /></li>
            </ul>
          </div>
        </div>
      </header>

      <main>
        <section class="tabs">
          {/* Tab Navigation */}
          <div class="tab-header-wrapper">
            <ul class="tab-header">
              {Object.entries(currentContent.meta.tabs).map(([key, label]) => (
                <li key={key}>
                  <button
                    class={`tab-item ${activeTab.value === key ? 'active' : ''}`}
                    onClick$={() => switchTab(key)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tab Content */}
          <div class="tab-content">
            <div class="tab-body">
              {currentContent.tabContents[activeTab.value] && (
                <div
                  key={activeTab.value}
                  class={`tab-panel ${
                    currentContent.tabContents[activeTab.value] ? 'active' : ''
                  }`}
                >
                  {currentContent.tabContents[activeTab.value].sections.map((section, index) => (
                    <div key={index}>
                      {renderSection(section)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Circular Menu */}
      <div id="circularMenu" class={`circular-menu ${!isUserAuthenticated.value ? 'unauthenticated' : ''}`}>
        <a class="floating-btn" onClick$={handleFloatingBtnClick}>
          <i class={`fa ${isUserAuthenticated.value ? 'fa-plus' : 'fa-user'}`}></i>
        </a>
        {/* 인증된 사용자만 메뉴 아이템 표시 */}
        {isUserAuthenticated.value && (
          <menu class="items-wrapper">
            <a href="/angelcar-info-foreigner/info" class="menu-item fa fa-book" title="공지사항">공지사항</a>
            <a href="#" class="menu-item fa fa-bookmark" title="예약조회">예약조회</a>
            <a href="/angelcar-info-foreigner/message" class="menu-item fa fa-comment-dots" title="메시지">메시지</a>
            <div
              class="menu-item fa fa-language"
              title="언어선택"
              onClick$={() => {
                activeLang.value = activeLang.value === 'en' ? 'zh' : 'en';
              }}
            >언어선택</div>
          </menu>
        )}
      </div>
    </div>
  );
});