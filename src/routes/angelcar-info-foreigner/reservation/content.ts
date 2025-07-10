// reservation/content.ts
export interface ReservationData {
  id: string;
  carModel: string;
  carImage: string;
  reservationNumber: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalDays: number;
  totalPrice: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  driverName: string;
  contactNumber: string;
}

export interface ReservationContent {
  pageTitle: string;
  noReservations: string;
  status: {
    confirmed: string;
    pending: string;
    cancelled: string;
    completed: string;
  };
  labels: {
    reservationNumber: string;
    carModel: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    totalDays: string;
    totalPrice: string;
    driverName: string;
    contactNumber: string;
    status: string;
  };
  buttons: {
    viewDetails: string;
  };
}

export const reservationContentData: Record<string, ReservationContent> = {
  en: {
    pageTitle: "My Reservations",
    noReservations: "No reservations found. Make your first reservation now!",
    status: {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      completed: "Completed"
    },
    labels: {
      reservationNumber: "Reservation No.",
      carModel: "Vehicle",
      pickupDate: "Pickup Date",
      returnDate: "Return Date",
      pickupLocation: "Pickup Location",
      returnLocation: "Return Location",
      totalDays: "Rental Period",
      totalPrice: "Total Price",
      driverName: "Driver Name",
      contactNumber: "Contact Number",
      status: "Status"
    },
    buttons: {
      viewDetails: "View Details"
    }
  },
  zh: {
    pageTitle: "我的預訂",
    noReservations: "未找到預訂記錄。立即進行您的第一次預訂！",
    status: {
      confirmed: "已確認",
      pending: "待確認",
      cancelled: "已取消",
      completed: "已完成"
    },
    labels: {
      reservationNumber: "預訂編號",
      carModel: "車輛",
      pickupDate: "取車日期",
      returnDate: "還車日期",
      pickupLocation: "取車地點",
      returnLocation: "還車地點",
      totalDays: "租賃期間",
      totalPrice: "總價格",
      driverName: "駕駛員姓名",
      contactNumber: "聯絡電話",
      status: "狀態"
    },
    buttons: {
      viewDetails: "查看詳情"
    }
  }
};

// 예시 데이터
export const mockReservationData: ReservationData[] = [
  {
    id: "1",
    carModel: "Hyundai Avante",
    carImage: "/angelcar-info-foreigner/img/banner_mo.jpg",
    reservationNumber: "AC240001",
    pickupDate: "2024-07-15",
    returnDate: "2024-07-18",
    pickupLocation: "Jeju Airport",
    returnLocation: "Jeju Airport",
    totalDays: 3,
    totalPrice: "₩150,000",
    status: "confirmed",
    driverName: "John Smith",
    contactNumber: "+82-10-1234-5678"
  },
  {
    id: "2",
    carModel: "KIA Morning",
    carImage: "/angelcar-info-foreigner/img/banner_mo.jpg",
    reservationNumber: "AC240002",
    pickupDate: "2024-08-01",
    returnDate: "2024-08-05",
    pickupLocation: "Seongsan Branch",
    returnLocation: "Jeju Airport",
    totalDays: 4,
    totalPrice: "₩180,000",
    status: "pending",
    driverName: "John Smith",
    contactNumber: "+82-10-1234-5678"
  },
  {
    id: "3",
    carModel: "Genesis G70",
    carImage: "/angelcar-info-foreigner/img/banner_mo.jpg",
    reservationNumber: "AC240003",
    pickupDate: "2024-06-20",
    returnDate: "2024-06-22",
    pickupLocation: "Jeju Airport",
    returnLocation: "Jeju Airport",
    totalDays: 2,
    totalPrice: "₩200,000",
    status: "completed",
    driverName: "John Smith",
    contactNumber: "+82-10-1234-5678"
  }
];