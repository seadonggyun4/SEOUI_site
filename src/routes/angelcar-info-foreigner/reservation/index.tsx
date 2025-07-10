// reservation/index.tsx
import { component$, useSignal, $, useVisibleTask$, useContext } from '@builder.io/qwik';
import { GlobalStateContext } from '../store';
import { requireAuth } from '../store/authUtils';
import { reservationContentData, mockReservationData, type ReservationData } from './content';
import './style.scss';

export default component$(() => {
  const globalState = useContext(GlobalStateContext);
  const reservations = useSignal<ReservationData[]>([]);
  const isLoading = useSignal(true);
  const selectedInsurance = useSignal<'NOT_JOINED' | 'GENERAL' | 'PREMIUM' | null>(null);
  const selectedReservation = useSignal<ReservationData | null>(null);
  const currentImageIndex = useSignal(0);

  // 인증 확인 및 데이터 로드
  useVisibleTask$(() => {
    requireAuth();

    // 실제 환경에서는 API 호출로 예약 데이터를 가져옴
    // 현재는 모의 데이터 사용
    setTimeout(() => {
      reservations.value = mockReservationData;
      isLoading.value = false;
    }, 500);
  });

  const currentContent = reservationContentData[globalState.activeLang.value] || reservationContentData.en;

  // 보험 모달 닫기
  const closeInsuranceModal = $(() => {
    selectedInsurance.value = null;
  });

  // 보험 모달 열기
  const openInsuranceModal = $((insuranceType: 'NOT_JOINED' | 'GENERAL' | 'PREMIUM') => {
    selectedInsurance.value = insuranceType;
  });

  // 디테일 모달 열기/닫기
  const openDetailModal = $((reservation: ReservationData) => {
    selectedReservation.value = reservation;
    currentImageIndex.value = 0;
  });

  const closeDetailModal = $(() => {
    selectedReservation.value = null;
    currentImageIndex.value = 0;
  });

  // 캐러셀 네비게이션
  const nextImage = $(() => {
    if (selectedReservation.value?.carImages) {
      const maxIndex = selectedReservation.value.carImages.length - 1;
      currentImageIndex.value = currentImageIndex.value >= maxIndex ? 0 : currentImageIndex.value + 1;
    }
  });

  const prevImage = $(() => {
    if (selectedReservation.value?.carImages) {
      const maxIndex = selectedReservation.value.carImages.length - 1;
      currentImageIndex.value = currentImageIndex.value <= 0 ? maxIndex : currentImageIndex.value - 1;
    }
  });

  const goToImage = $((index: number) => {
    currentImageIndex.value = index;
  });

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(globalState.activeLang.value === 'zh' ? 'zh-TW' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // 반납까지 남은 일수 계산
  const calculateDaysRemaining = (returnDate: string) => {
    const today = new Date();
    const returnDay = new Date(returnDate);
    const diffTime = returnDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // 예약 카드 렌더링
  const renderReservationCard = (reservation: ReservationData) => {
    const daysRemaining = calculateDaysRemaining(reservation.returnDate);
    const isCompleted = reservation.status === 'completed';

    return (
      <div key={reservation.id} class="reservation-card">
        <div class="reservation-card__header">
          <div class="reservation-number">
            {currentContent.labels.reservationNumber}: {reservation.reservationNumber}
          </div>
          <div class={`status-badge ${reservation.status}`}>
            {currentContent.status[reservation.status]}
          </div>
        </div>

        <div class="reservation-card__body">
          {/* 차량 정보 */}
          <div class="reservation-card__car-info">
            <img
              src={reservation.carImage}
              alt={reservation.carModel}
              class="car-image"
              onError$={(e) => {
                (e.target as HTMLImageElement).src = '/angelcar-info-foreigner/img/default-car.png';
              }}
            />
            <div class="car-details">
              <div class="car-model">{reservation.carModel}</div>
            </div>
          </div>

          {/* 날짜/시간 정보 */}
          <div class="reservation-card__datetime">
            <div class="datetime-item">
              <div class="label">{currentContent.labels.pickupDateTime}</div>
              <div class="date">{formatDate(reservation.pickupDate)}</div>
              <div class="time">{reservation.pickupTime}</div>
            </div>
            <div class="datetime-item">
              <div class="label">{currentContent.labels.returnDateTime}</div>
              <div class="date">{formatDate(reservation.returnDate)}</div>
              <div class="time">{reservation.returnTime}</div>
            </div>
            <div class="datetime-item">
              <div class="label">
                {isCompleted ? currentContent.labels.daysCompleted : currentContent.labels.daysRemaining}
              </div>
              <div class="days">
                {isCompleted ? reservation.totalDays : daysRemaining}
              </div>
            </div>
          </div>

          {/* 탑승자 정보 */}
          <div class="reservation-card__passengers">
            <div class="passenger-item">
              <div class="count">{reservation.passengers.adult}</div>
              <div class="type">{currentContent.labels.adult}</div>
            </div>
            <div class="passenger-item">
              <div class="count">{reservation.passengers.teenager}</div>
              <div class="type">{currentContent.labels.teenager}</div>
            </div>
            <div class="passenger-item">
              <div class="count">{reservation.passengers.child}</div>
              <div class="type">{currentContent.labels.child}</div>
            </div>
          </div>

          {/* 보험 정보 */}
          <div class="reservation-card__insurance">
            <div class="section-title">{currentContent.labels.insurance}</div>
            <div
              class={`insurance-card ${reservation.insurance.toLowerCase().replace('_', '-')}`}
              onClick$={() => openInsuranceModal(reservation.insurance)}
            >
              <div class="insurance-header">
                <div class="insurance-title">
                  {currentContent.insurance[reservation.insurance].title}
                </div>
                <div class={`insurance-type ${reservation.insurance.toLowerCase().replace('_', '-')}`}>
                  {reservation.insurance}
                </div>
              </div>
              <div class="insurance-price">
                {currentContent.insurance[reservation.insurance].price}
              </div>
              <div class="insurance-note">
                {currentContent.insurance[reservation.insurance].additionalNote}
              </div>
            </div>
          </div>

          {/* 고객 정보 */}
          <div class="reservation-card__customer-info">
            <div class="customer-detail">
              <span class="label">{currentContent.labels.driverName}</span>
              <span class="value">{reservation.driverName}</span>
            </div>
            <div class="customer-detail">
              <span class="label">{currentContent.labels.contactNumber}</span>
              <span class="value">{reservation.contactNumber}</span>
            </div>
          </div>

          {/* 상세보기 버튼 */}
          <div class="reservation-card__actions">
            <button
              class="detail-button"
              onClick$={() => openDetailModal(reservation)}
            >
              {globalState.activeLang.value === 'en' ? 'View Details' :
              globalState.activeLang.value === 'zh' ? '查看詳情' : '상세보기'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="reservation-container">
      {/* Header */}
      <header class="header">
        <div class="logo-container">
          <img src="/angelcar-info-foreigner/img/logo.png" alt="JEJU ANGEL RENT A CAR" />
        </div>
        <h1 class="page-title">{currentContent.pageTitle}</h1>
      </header>

      {/* Main Content */}
      <main class="main-content">
        {isLoading.value ? (
          <div class="loading-container">
            <i class="fas fa-spinner loading-icon"></i>
            <p class="loading-text">
              {globalState.activeLang.value === 'en' ? 'Loading reservations...' :
               globalState.activeLang.value === 'zh' ? '預訂資訊載入中...' : '예약 정보를 불러오는 중...'}
            </p>
          </div>
        ) : reservations.value.length > 0 ? (
          <div class="reservations-list">
            {reservations.value.map(reservation => renderReservationCard(reservation))}
          </div>
        ) : (
          <div class="no-reservations">
            <i class="fas fa-car icon"></i>
            <p class="message">{currentContent.noReservations}</p>
          </div>
        )}
      </main>

      {/* 보험 상세 정보 모달 */}
      {selectedInsurance.value && (
        <div class="insurance-modal" onClick$={closeInsuranceModal}>
          <div class="modal-content" onClick$={(e) => e.stopPropagation()}>
            <div class="modal-header">
              <div class="modal-title">
                {currentContent.insurance[selectedInsurance.value].title}
              </div>
              <button class="close-button" onClick$={closeInsuranceModal}>×</button>
            </div>
            <div class="modal-body">
              <div class="detail-item">
                <div class="detail-label">{currentContent.insuranceDetails.customerResponsibility}</div>
                <div class="detail-value">{currentContent.insurance[selectedInsurance.value].customerResponsibility}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">{currentContent.insuranceDetails.lossOfUseFee}</div>
                <div class="detail-value">{currentContent.insurance[selectedInsurance.value].lossOfUseFee}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">{currentContent.insuranceDetails.coverageLimit}</div>
                <div class="detail-value">{currentContent.insurance[selectedInsurance.value].coverageLimit}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">{currentContent.insuranceDetails.eligibilityRequirements}</div>
                <div class="detail-value">{currentContent.insurance[selectedInsurance.value].eligibilityRequirements}</div>
              </div>
              <div class="note-section">
                <div class="note-text">{currentContent.insurance[selectedInsurance.value].additionalNote}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 예약 상세 정보 모달 */}
      {selectedReservation.value && (
        <div class="detail-modal" onClick$={closeDetailModal}>
          <div class="detail-modal__content" onClick$={(e) => e.stopPropagation()}>
            <div class="detail-modal__header">
              <div class="modal-title">
                {currentContent.labels.reservationNumber}: {selectedReservation.value.reservationNumber}
              </div>
              <button class="close-button" onClick$={closeDetailModal}>×</button>
            </div>

            <div class="detail-modal__carousel">
              <div class="carousel-container">
                {selectedReservation.value.carImages && selectedReservation.value.carImages.length > 0 ? (
                  selectedReservation.value.carImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedReservation.value!.carModel} ${index + 1}`}
                      class={`carousel-image ${index === currentImageIndex.value ? 'active' : ''}`}
                      onError$={(e) => {
                        (e.target as HTMLImageElement).src = '/angelcar-info-foreigner/img/default-car.png';
                      }}
                    />
                  ))
                ) : (
                  <img
                    src={selectedReservation.value.carImage}
                    alt={selectedReservation.value.carModel}
                    class="carousel-image active"
                    onError$={(e) => {
                      (e.target as HTMLImageElement).src = '/angelcar-info-foreigner/img/default-car.png';
                    }}
                  />
                )}

                {selectedReservation.value.carImages && selectedReservation.value.carImages.length > 1 && (
                  <>
                    <button class="carousel-nav prev" onClick$={prevImage}>‹</button>
                    <button class="carousel-nav next" onClick$={nextImage}>›</button>
                  </>
                )}
              </div>

              {selectedReservation.value.carImages && selectedReservation.value.carImages.length > 1 && (
                <div class="carousel-indicators">
                  {selectedReservation.value.carImages.map((_, index) => (
                    <div
                      key={index}
                      class={`indicator ${index === currentImageIndex.value ? 'active' : ''}`}
                      onClick$={() => goToImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div class="detail-modal__body">
              {/* 차량 옵션 */}
              {selectedReservation.value.options.length > 0 && (
                <div class="detail-modal__section">
                  <div class="section-title">{currentContent.labels.options}</div>
                  <div class="tags-container">
                    {selectedReservation.value.options.map((option, index) => (
                      <div key={index} class="tag">
                        {currentContent.options[option as keyof typeof currentContent.options] || option}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 부가용품 */}
              <div class="detail-modal__section">
                <div class="section-title">{currentContent.labels.additionalItems}</div>
                {selectedReservation.value.additionalItems.length > 0 ? (
                  <div class="items-grid">
                    {selectedReservation.value.additionalItems.map((item, index) => (
                      <div key={index} class="item-tag">
                        {currentContent.additionalItems[item as keyof typeof currentContent.additionalItems] || item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="no-items">
                    {globalState.activeLang.value === 'en' ? 'No additional items' :
                    globalState.activeLang.value === 'zh' ? '無附加用品' : '부가용품 없음'}
                  </div>
                )}
              </div>

              {/* 반려용품 */}
              <div class="detail-modal__section">
                <div class="section-title">{currentContent.labels.petItems}</div>
                {selectedReservation.value.petItems.length > 0 ? (
                  <div class="items-grid">
                    {selectedReservation.value.petItems.map((item, index) => (
                      <div key={index} class="item-tag">
                        {currentContent.petItems[item as keyof typeof currentContent.petItems] || item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div class="no-items">
                    {globalState.activeLang.value === 'en' ? 'No pet items' :
                    globalState.activeLang.value === 'zh' ? '無寵物用品' : '반려용품 없음'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});