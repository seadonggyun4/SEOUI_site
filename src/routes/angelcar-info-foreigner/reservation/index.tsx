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

  // 예약 상세보기
  const handleViewDetails = $((reservationId: string) => {
    // 상세 페이지로 이동하거나 모달 표시
    console.log('View details for reservation:', reservationId);
    alert(`${currentContent.buttons.viewDetails}: ${reservationId}`);
  });

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(globalState.activeLang.value === 'zh' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 예약 카드 렌더링
  const renderReservationCard = (reservation: ReservationData) => (
    <div key={reservation.id} class="reservation-card">
      <div class="card-header">
        <div class="reservation-number">
          {currentContent.labels.reservationNumber}: {reservation.reservationNumber}
        </div>
        <div class={`status-badge ${reservation.status}`}>
          {currentContent.status[reservation.status]}
        </div>
      </div>

      <div class="card-body">
        {/* 차량 정보 */}
        <div class="car-info">
          <img
            src={reservation.carImage}
            alt={reservation.carModel}
            class="car-image"
            onError$={(e) => {
              // 이미지 로드 실패 시 기본 이미지 설정
              (e.target as HTMLImageElement).src = '/angelcar-info-foreigner/img/default-car.png';
            }}
          />
          <div class="car-details">
            <div class="car-model">{reservation.carModel}</div>
            <div class="total-price">{reservation.totalPrice}</div>
          </div>
        </div>

        {/* 예약 상세 정보 */}
        <div class="reservation-details">
          <div class="detail-item">
            <div class="label">{currentContent.labels.pickupDate}</div>
            <div class="value">{formatDate(reservation.pickupDate)}</div>
          </div>
          <div class="detail-item">
            <div class="label">{currentContent.labels.returnDate}</div>
            <div class="value">{formatDate(reservation.returnDate)}</div>
          </div>
          <div class="detail-item">
            <div class="label">{currentContent.labels.totalDays}</div>
            <div class="value">
              {reservation.totalDays} {globalState.activeLang.value === 'en' ? 'days' : '天'}
            </div>
          </div>
        </div>

        {/* 위치 정보 */}
        <div class="location-info">
          <div class="location-item">
            <i class="fas fa-map-marker-alt icon"></i>
            <div class="location-text">
              <span class="label">{currentContent.labels.pickupLocation}:</span>
              {reservation.pickupLocation}
            </div>
          </div>
          <div class="location-item">
            <i class="fas fa-map-marker-alt icon"></i>
            <div class="location-text">
              <span class="label">{currentContent.labels.returnLocation}:</span>
              {reservation.returnLocation}
            </div>
          </div>
        </div>

        {/* 고객 정보 */}
        <div class="customer-info">
          <div class="customer-detail">
            <span class="label">{currentContent.labels.driverName}</span>
            <span class="value">{reservation.driverName}</span>
          </div>
          <div class="customer-detail">
            <span class="label">{currentContent.labels.contactNumber}</span>
            <span class="value">{reservation.contactNumber}</span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div class="action-buttons">
          <button
            class="btn btn-primary"
            onClick$={() => handleViewDetails(reservation.id)}
          >
            {currentContent.buttons.viewDetails}
          </button>
        </div>
      </div>
    </div>
  );

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
          <div class="loading-container" style="text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #6c757d;"></i>
            <p style="margin-top: 12px; color: #6c757d;">
              {globalState.activeLang.value === 'en' ? 'Loading reservations...' : '예약 정보를 불러오는 중...'}
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
    </div>
  );
});