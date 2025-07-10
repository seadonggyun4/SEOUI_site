// reservation/content.ts
export type CarOption = 'smokeFree' | 'driverAirbag' | 'passengerAirbag' | 'rearCamera' | 'rearSensor' | 'blackbox' | 'buttonStart' | 'heatedSeats' | 'bluetooth' | 'usb' | 'androidAuto' | 'appleCarPlay' | 'builtInNavigation';

export type AdditionalItem = 'carSeat' | 'stroller' | 'accessories';

export type PetItem = 'petStroller' | 'petCarSeat';

export interface ReservationData {
  id: string;
  carModel: string;
  carImage: string;
  carImages?: string[]; // 상세 이미지들 (캐러셀용)
  reservationNumber: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  totalDays: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  driverName: string;
  contactNumber: string;
  passengers: {
    adult: number;
    teenager: number;
    child: number;
  };
  options: CarOption[];
  additionalItems: AdditionalItem[];
  petItems: PetItem[];
  insurance: 'NOT_JOINED' | 'GENERAL' | 'PREMIUM';
}

export interface InsuranceInfo {
  type: 'NOT_JOINED' | 'GENERAL' | 'PREMIUM';
  title: string;
  price: string;
  customerResponsibility: string;
  lossOfUseFee: string;
  coverageLimit: string;
  eligibilityRequirements: string;
  additionalNote: string;
}

export interface ReservationContent {
  pageTitle: string;
  noReservations: string;
  detailButton: string;
  close: string;
  carDetailTitle: string;
  status: {
    confirmed: string;
    pending: string;
    cancelled: string;
    completed: string;
  };
  labels: {
    reservationNumber: string;
    carModel: string;
    pickupDateTime: string;
    returnDateTime: string;
    daysRemaining: string;
    daysCompleted: string;
    options: string;
    additionalItems: string;
    petItems: string;
    passengers: string;
    adult: string;
    teenager: string;
    child: string;
    driverName: string;
    contactNumber: string;
    status: string;
    insurance: string;
    noItems: string;
  };
  insurance: {
    NOT_JOINED: InsuranceInfo;
    GENERAL: InsuranceInfo;
    PREMIUM: InsuranceInfo;
  };
  insuranceDetails: {
    customerResponsibility: string;
    lossOfUseFee: string;
    coverageLimit: string;
    eligibilityRequirements: string;
    repairCosts: string;
    exceedingCoverage: string;
  };
  options: Record<CarOption, string>;
  additionalItems: Record<AdditionalItem, string>;
  petItems: Record<PetItem, string>;
}

export const reservationContentData: Record<string, ReservationContent> = {
  en: {
    pageTitle: "My Reservations",
    noReservations: "No reservations found. Make your first reservation now!",
    detailButton: "View Details",
    close: "Close",
    carDetailTitle: "Car Details",
    status: {
      confirmed: "Confirmed",
      pending: "Pending",
      cancelled: "Cancelled",
      completed: "Completed"
    },
    labels: {
      reservationNumber: "Reservation No.",
      carModel: "Vehicle",
      pickupDateTime: "Pickup",
      returnDateTime: "Return",
      daysRemaining: "Days Remaining",
      daysCompleted: "Completed",
      options: "Vehicle Options",
      additionalItems: "Additional Items",
      petItems: "Pet Items",
      passengers: "Passengers",
      adult: "Adult",
      teenager: "Teenager",
      child: "Child",
      driverName: "Driver Name",
      contactNumber: "Contact Number",
      status: "Status",
      insurance: "Insurance",
      noItems: "No items"
    },
    insurance: {
      NOT_JOINED: {
        type: 'NOT_JOINED',
        title: "NOT JOINED",
        price: "-",
        customerResponsibility: "ALL",
        lossOfUseFee: "ALL",
        coverageLimit: "Zero",
        eligibilityRequirements: "Age 26+ with 2+ years of driving experience.",
        additionalNote: "All repair costs are the customer's responsibility."
      },
      GENERAL: {
        type: 'GENERAL',
        title: "GENERAL",
        price: "+12,000KRW",
        customerResponsibility: "300,000-500,000 KRW",
        lossOfUseFee: "ALL",
        coverageLimit: "3,000,000 ~ 4,000,000 KRW",
        eligibilityRequirements: "Age 26+ with 2+ years of driving experience.",
        additionalNote: "Any amount exceeding the coverage limit is also the customer's responsibility."
      },
      PREMIUM: {
        type: 'PREMIUM',
        title: "PREMIUM",
        price: "+16,000KRW",
        customerResponsibility: "None. (No charge within the coverage limit.)",
        lossOfUseFee: "None (No charge within the coverage limit.)",
        coverageLimit: "3,000,000~4,000,000 KRW",
        eligibilityRequirements: "Age 26+ with 3+ years of driving experience.",
        additionalNote: "Any amount exceeding the coverage limit is also the customer's responsibility."
      }
    },
    insuranceDetails: {
      customerResponsibility: "Customer Responsibility Amount",
      lossOfUseFee: "Loss of Use Fee",
      coverageLimit: "Coverage Limit",
      eligibilityRequirements: "Eligibility Requirements",
      repairCosts: "All repair costs are the customer's responsibility.",
      exceedingCoverage: "Any amount exceeding the coverage limit is also the customer's responsibility."
    },
    options: {
      smokeFree: "Non-smoking",
      driverAirbag: "Driver Airbag",
      passengerAirbag: "Passenger Airbag",
      rearCamera: "Rear Camera",
      rearSensor: "Rear Sensor",
      blackbox: "Black Box",
      buttonStart: "Push Start",
      heatedSeats: "Heated Seats",
      bluetooth: "Bluetooth",
      usb: "USB",
      androidAuto: "Android Auto",
      appleCarPlay: "Apple CarPlay",
      builtInNavigation: "Built-in Navigation"
    },
    additionalItems: {
      carSeat: "Car Seat",
      stroller: "Stroller",
      accessories: "Accessories"
    },
    petItems: {
      petStroller: "Pet Stroller",
      petCarSeat: "Pet Car Seat"
    }
  },
  zh: {
    pageTitle: "我的預訂",
    noReservations: "未找到預訂記錄。立即進行您的第一次預訂！",
    detailButton: "查看詳情",
    close: "關閉",
    carDetailTitle: "車輛詳情",
    status: {
      confirmed: "已確認",
      pending: "待確認",
      cancelled: "已取消",
      completed: "已完成"
    },
    labels: {
      reservationNumber: "預訂編號",
      carModel: "車輛",
      pickupDateTime: "取車",
      returnDateTime: "還車",
      daysRemaining: "剩餘天數",
      daysCompleted: "已完成",
      options: "車輛選項",
      additionalItems: "附加用品",
      petItems: "寵物用品",
      passengers: "乘客",
      adult: "成人",
      teenager: "青少年",
      child: "兒童",
      driverName: "駕駛員姓名",
      contactNumber: "聯絡電話",
      status: "狀態",
      insurance: "保險",
      noItems: "無用品"
    },
    insurance: {
      NOT_JOINED: {
        type: 'NOT_JOINED',
        title: "未投保",
        price: "-",
        customerResponsibility: "全部",
        lossOfUseFee: "全部",
        coverageLimit: "零",
        eligibilityRequirements: "年滿26歲且有2年以上駕駛經驗。",
        additionalNote: "所有維修費用由客戶承擔。"
      },
      GENERAL: {
        type: 'GENERAL',
        title: "一般保險",
        price: "+12,000韓元",
        customerResponsibility: "300,000-500,000韓元",
        lossOfUseFee: "全部",
        coverageLimit: "3,000,000 ~ 4,000,000韓元",
        eligibilityRequirements: "年滿26歲且有2年以上駕駛經驗。",
        additionalNote: "超出保險範圍的金額也由客戶承擔。"
      },
      PREMIUM: {
        type: 'PREMIUM',
        title: "高級保險",
        price: "+16,000韓元",
        customerResponsibility: "無。（保險範圍內不收費。）",
        lossOfUseFee: "無（保險範圍內不收費。）",
        coverageLimit: "3,000,000~4,000,000韓元",
        eligibilityRequirements: "年滿26歲且有3年以上駕駛經驗。",
        additionalNote: "超出保險範圍的金額也由客戶承擔。"
      }
    },
    insuranceDetails: {
      customerResponsibility: "客戶責任金額",
      lossOfUseFee: "使用損失費",
      coverageLimit: "保險範圍",
      eligibilityRequirements: "資格要求",
      repairCosts: "所有維修費用由客戶承擔。",
      exceedingCoverage: "超出保險範圍的金額也由客戶承擔。"
    },
    options: {
      smokeFree: "禁菸",
      driverAirbag: "駕駛座安全氣囊",
      passengerAirbag: "副駕駛座安全氣囊",
      rearCamera: "後方攝影機",
      rearSensor: "後方感應器",
      blackbox: "行車記錄器",
      buttonStart: "按鈕啟動",
      heatedSeats: "加熱座椅",
      bluetooth: "藍牙",
      usb: "USB",
      androidAuto: "Android Auto",
      appleCarPlay: "Apple CarPlay",
      builtInNavigation: "車載導航"
    },
    additionalItems: {
      carSeat: "兒童座椅",
      stroller: "嬰兒車",
      accessories: "配件"
    },
    petItems: {
      petStroller: "寵物推車",
      petCarSeat: "寵物座椅"
    }
  }
};

// 예시 데이터 - 상세 이미지 추가
export const mockReservationData: ReservationData[] = [
  {
    id: "1",
    carModel: "Hyundai Avante",
    carImage: "/angelcar-info-foreigner/img/banner_mo.jpg",
    carImages: [
      "/angelcar-info-foreigner/img/banner_mo.jpg",
      "/angelcar-info-foreigner/img/banner_mo.jpg",
      "/angelcar-info-foreigner/img/banner_mo.jpg",
      "/angelcar-info-foreigner/img/banner_mo.jpg",
    ],
    reservationNumber: "AC240001",
    pickupDate: "2024-07-15",
    pickupTime: "10:00",
    returnDate: "2024-07-18",
    returnTime: "18:00",
    totalDays: 3,
    status: "confirmed",
    driverName: "John Smith",
    contactNumber: "+82-10-1234-5678",
    passengers: {
      adult: 2,
      teenager: 1,
      child: 0
    },
    options: ["smokeFree", "driverAirbag", "passengerAirbag", "rearCamera", "rearSensor", "blackbox", "buttonStart", "bluetooth", "usb", "appleCarPlay"],
    additionalItems: ["carSeat", "accessories"],
    petItems: [],
    insurance: "PREMIUM"
  },
  {
    id: "2",
    carModel: "KIA Morning",
    carImage: "/angelcar-info-foreigner/img/banner_mo.jpg",
    carImages: [
      "/angelcar-info-foreigner/img/banner_mo.jpg",
      "/angelcar-info-foreigner/img/banner_mo.jpg",
    ],
    reservationNumber: "AC240002",
    pickupDate: "2024-08-01",
    pickupTime: "09:30",
    returnDate: "2024-08-05",
    returnTime: "17:30",
    totalDays: 4,
    status: "pending",
    driverName: "John Smith",
    contactNumber: "+82-10-1234-5678",
    passengers: {
      adult: 2,
      teenager: 0,
      child: 1
    },
    options: ["smokeFree", "driverAirbag", "passengerAirbag", "blackbox", "usb", "builtInNavigation"],
    additionalItems: ["stroller"],
    petItems: ["petCarSeat"],
    insurance: "GENERAL"
  },
];