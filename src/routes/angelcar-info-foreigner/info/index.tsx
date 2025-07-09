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
    // 인증된 경우 메뉴 토글
    const menu = document.getElementById('circularMenu');
    menu?.classList.toggle('active');
  });

  // 로그아웃 핸들러
  const handleLogout = $(() => {
    try {
      sessionStorage.removeItem('foreignerApp');
      isUserAuthenticated.value = false;
      userName.value = '';
      window.location.href = '/angelcar-info-foreigner/info/';
    } catch (error) {
      console.error('Failed to logout:', error);
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

      <footer class="footer">
        <menu>
          {/* 공지사항 - 항상 표시 */}
          <a href="/angelcar-info-foreigner/info" class="menu-item fa fa-book" title="공지사항"></a>

          {/* 로그인 안되었을 때만 표시 */}
          {!isUserAuthenticated.value && (
            <a href="/angelcar-info-foreigner/user" class="menu-item fa fa-user" title="인증"></a>
          )}

          {/* 로그인 이후에만 표시 */}
          {isUserAuthenticated.value && (
            <>
              <a href="#" class="menu-item fa fa-bookmark" title="예약조회"></a>
              <a href="/angelcar-info-foreigner/message" class="menu-item fa fa-comment-dots" title="메시지"></a>
              <a
                href="#"
                class="menu-item fa-solid fa-right-from-bracket"
                title="로그아웃"
                onClick$={handleLogout}
              ></a>
            </>
          )}
        </menu>
      </footer>

      {/* Circular language menu */}
      <div id="circularMenu" class="circular-menu">
        <a class="floating-btn" onClick$={handleFloatingBtnClick}>
          <i class="fa fa-language"></i>
        </a>
        <menu class="items-wrapper">
          <div
            class="menu-item"
            onClick$={() => {activeLang.value = 'en'}}
          >
            {currentContent.menu.en}
          </div>
          <div
            class="menu-item"
            onClick$={() => {activeLang.value = 'zh'}}
          >
            {currentContent.menu.zh}
          </div>
        </menu>
      </div>
    </div>
  );
});