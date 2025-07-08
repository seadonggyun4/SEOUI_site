// content.ts
export interface TabContent {
  title: string;
  sections: Section[];
}

export interface Section {
  heading?: string;
  subheading?: string;
  content: string[];
  strongTexts?: string[];
  hasLinks?: boolean;
  links?: LinkItem[];
  hasImages?: boolean;
  images?: ImageItem[];
  hasSteps?: boolean;
  steps?: StepItem[];
}

export interface LinkItem {
  url: string;
  imgSrc: string;
  alt: string;
}

export interface ImageItem {
  src: string;
  alt: string;
  link?: string;
}

export interface StepItem {
  stepNumber: number;
  description: string;
  imageSrc: string;
}

export interface ContentData {
  meta: {
    title: string;
    subtitle: string;
    partnerTitle: string;
    tabs: {
      [key: string]: string;
    };
  };
  tabContents: {
    [key: string]: TabContent;
  };
}

export const contentData: { [key: string]: ContentData } = {
  en: {
    meta: {
      title: "JEJU ANGEL RENT A CAR",
      subtitle: "Rental Information",
      partnerTitle: "Reservation platform with Trip.com, QEEQ, Zuzuche, Yesaway",
      tabs: {
        info: "Angelcar Info",
        requirements: "Driver Requirements",
        terms: "Key Terms & Conditions",
        shuttle: "Shuttle Operation&Boarding",
        pickup: "Pick up/Return Guide",
        emergency: "In case of an emergency"
      }
    },
    tabContents: {
      info: {
        title: "Angelcar Info",
        sections: [
          {
            heading: "Angelcar Company info",
            subheading: "Welcome to Jeju Angel Rent a Car",
            content: [
              "AngelCar is a leading company in the Jeju rental car industry",
              "since 2018, and aims to provide comfortable and happy travel to",
              "travelers with customer satisfaction as the top priority"
            ]
          },
          {
            subheading: "Company Name",
            content: [
              "Jeju Angel Rent a Car (Brand : angelcar)",
              "Business registration number : 127-86-45776"
            ]
          },
          {
            subheading: "Location",
            content: [
              "171-1 Doryeong-ro, Jeju-si, Jeju-do",
              "(제주특별자치도 제주시 도령로 171-1)"
            ]
          },
          {
            subheading: "Customer Service",
            content: [
              "Tell. 064-744-1401",
              "(Telephone consultation is only available in Korean)",
              "WhatsApp. +82 10-9650-1401",
              "Line ID. Angelcar",
              "Instagram : jejuangelcar_en",
              "Consultation available time. 08:00 ~ 19:00"
            ],
            hasLinks: true,
            links: [
              {
                url: "https://wa.me/qr/IGGSYP5OYOGAF1",
                imgSrc: "/angelcar-info-foreigner/img/wa.webp",
                alt: "wa"
              },
              {
                url: "https://page.line.me/663uivqc",
                imgSrc: "/angelcar-info-foreigner/img/line.png",
                alt: "line"
              },
              {
                url: "https://www.instagram.com/jejuangelcar_en/",
                imgSrc: "/angelcar-info-foreigner/img/instagram.webp",
                alt: "instagram"
              }
            ]
          }
        ]
      },
      requirements: {
        title: "Driver Requirements",
        sections: [
          {
            heading: "Driver Requirements",
            subheading: "A valid driver's license & requirements",
            content: [
              "License : Only IDP(International Driving Permit) Class B, C, D",
              "or Korean Driver's license (One year after acquisition)",
              "*Cannot be rent if you don't have IDP.",
              "*Printed paper IDP/Digital IDP cannot be used.",
              "*A valid IDP is required, and non-face-to-face registration is not possible.",
              "Age : from 26 to 70 years old",
              "More than two years of driving experience (after obtaining a driver's license)"
            ],
            strongTexts: [
              "License : Only IDP(International Driving Permit) Class B, C, D",
              "or Korean Driver's license (One year after acquisition)",
              "Age : from 26 to 70 years old",
              "More than two years of driving experience (after obtaining a driver's license)"
            ]
          },
          {
            subheading: "Required documents",
            content: [
              "Passport required",
              "A credit card payment consent form is required on site.",
              "*Please bring a credit card that can be used in Korea"
            ],
            strongTexts: ["Passport required"]
          },
          {
            subheading: "Etc",
            content: ["Up to 2 drivers can be registered. (No additional cost)"]
          },
          {
            content: [],
            hasImages: true,
            images: [
              {
                src: "/angelcar-info-foreigner/img/IDP.jpg",
                alt: "IDP",
                link: "https://internationaldrivingpermit.org/"
              }
            ]
          }
        ]
      },
      terms: {
        title: "Key Terms & Conditions",
        sections: [
          {
            heading: "Key Terms & Conditions",
            subheading: "Rental Car Driving Restrictions",
            content: [
              "*You must be over 26 years of age (Max 70 years old)",
              "*You must more than two years of driving experience",
              "(after obtaining a driver's license)",
              "*Only the driver registered in the contract can drive.",
              "(Insurance is not covered if an unregistered driver drives or",
              "violates the terms and conditions of the contract. Registered",
              "drivers cannot change and non-face-to-face registration is not allowed.)"
            ],
            strongTexts: [
              "over 26 years of age (Max 70 years old)",
              "more than two years of driving experience",
              "Only the driver registered in the contract can drive."
            ]
          },
          {
            subheading: "Fuel",
            content: [
              "The car must be returned with the same amount of fuel as when",
              "it was picked up."
            ],
            strongTexts: ["the same amount of fuel"]
          },
          {
            subheading: "Smoking, odors and damage",
            content: [
              "A fee of ₩250,000 will be charged for smoking, pet odors,",
              "vomit, fishing gear/bait odors, or any contamination/ damage to the seats."
            ],
            strongTexts: ["A fee of ₩250,000 will be charged for smoking"]
          },
          {
            subheading: "Pick up and return location",
            content: [
              "The rental car must be returned to the designated location.",
              "Returning the vehicle to a different location will incur additional",
              "costs and legal liability"
            ],
            strongTexts: ["The rental car must be returned to the designated location"]
          },
          {
            subheading: "Extension of rental period",
            content: [
              "Extensions of rental period must be confirmed with the company",
              "in advance. If an extension is not possible, the rental car must be",
              "returned on time."
            ],
            strongTexts: ["Extensions of rental period must be confirmed with the company in advance"]
          }
        ]
      },
      shuttle: {
        title: "Shuttle Operation&Boarding",
        sections: [
          {
            heading: "Shuttle Operation&Boarding",
            subheading: "Shuttle Bus Boarding Area (In the airport parking)",
            content: [
              "Rental Car Shuttle Bus Parking AREA 5, No 14",
              "*It takes about 5-10 minutes to get to Jeju Airport ↔ Angelcar by shuttle."
            ],
            strongTexts: ["AREA 5, No 14", "*It takes about 5-10 minutes to get to Jeju Airport ↔ Angelcar by shuttle"]
          },
          {
            subheading: "Shuttle Operation Time",
            content: [
              "*Departure from angelcar",
              "Running every 20 minutes from 07:20 a.m (-20:00)",
              "*Departure from the airport",
              "Running every 20 minutes from 07:40 a.m (-20:00)",
              "*30 minute intervals : 12-13:00 and 17-18:00 / after 20:00",
              "*If you arrive at Jeju Airport after 21:00, our staff will pick up by mini-van (-22:00)"
            ],
            strongTexts: [
              "Running every 20 minutes",
              "Running every 20 minutes",
              "30 minute intervals"
            ]
          },
          {
            subheading: "Shuttle boarding information",
            content: [],
            hasSteps: true,
            steps: [
              {
                stepNumber: 1,
                description: "Exit Gate 5 at Jeju International Airport",
                imageSrc: "/angelcar-info-foreigner/img/STEP01.jpg"
              },
              {
                stepNumber: 2,
                description: "Cross the crosswalk",
                imageSrc: "/angelcar-info-foreigner/img/STEP02.jpg"
              },
              {
                stepNumber: 3,
                description: "Proceed to the \"Rental Car Shuttles\" area – Area 5, No.14",
                imageSrc: "/angelcar-info-foreigner/img/STEP03.jpg"
              },
              {
                stepNumber: 4,
                description: "The stop is in front of the shuttle waiting station.",
                imageSrc: "/angelcar-info-foreigner/img/STEP04.jpg"
              },
              {
                stepNumber: 5,
                description: "Wait at Area 5, No. 14 for the Angelcar shuttle bus.",
                imageSrc: "/angelcar-info-foreigner/img/STEP05.jpg"
              },
              {
                stepNumber: 6,
                description: "Board the Angelcar shuttle bus, which runs every 20–30 minutes.",
                imageSrc: "/angelcar-info-foreigner/img/STEP06.jpg"
              },
              {
                stepNumber: 7,
                description: "Arrive at Angelcar Headquarters (approximately 5–10 minutes ride).",
                imageSrc: "/angelcar-info-foreigner/img/STEP07.jpg"
              }
            ]
          }
        ]
      },
      pickup: {
        title: "Pick up/Return Guide",
        sections: [
          {
            heading: "Pick up/Return Guide",
            subheading: "Pick up and Return location",
            content: [
              "Available for Pick up and Return at Angelcar",
              "*Location",
              "171-1 Doryeong-ro, Jeju-si, Jeju-do",
              "(제주특별자치도 제주시 도령로 171-1)",
              "*Take the shuttle from the airport and arrive at Angelcar"
            ],
            strongTexts: ["Available for Pick up and Return at Angelcar"]
          },
          {
            subheading: "Pick up",
            content: [
              "1. A rental car rental contract",
              "After arriving at Angelcar, visit the information desk on the 1st",
              "floor and prepare a rental car rental contract (using kiosks",
              "exclusively for foreigners)",
              "*Requirements: Passport and IDP(International Driving Permit),",
              "Credit card",
              "",
              "2. Check the rental car and Pick up",
              "Go to the parking location indicated on the rental car receipt",
              "and check the vehicle.",
              "*Parking Location: A01 - D20",
              "*Need to check the appearance of the rental car and the amount of fuel"
            ],
            strongTexts: [
              "1. A rental car rental contract",
              "2. Check the rental car and Pick up"
            ]
          },
          {
            subheading: "Return",
            content: [
              "1. Return location",
              "It can only be returned at AngelCar and cannot be returned outside/at the airport.",
              "",
              "2. Fuel",
              "The rental car must be returned equal to the amount of fuel at the time of Picked up and must be paid if it is insufficient.",
              "",
              "3. Extension of rental period",
              "Extensions of rental period must be confirmed with the company in advance. If an extension is not possible, the rental car must be returned on time."
            ],
            strongTexts: [
              "1. Return location",
              "It can only be returned at AngelCar",
              "2. Fuel",
              "must be paid if it is insufficient",
              "3. Extension of rental period",
              "Extensions of rental period must be confirmed with the company in advance."
            ]
          }
        ]
      },
      emergency: {
        title: "In case of an emergency",
        sections: [
          {
            heading: "In case of an emergency",
            subheading: "In case of an emergency",
            content: [
              "* If a warning lamp comes on or vehicle abnormality occurs in the vehicle",
              "* If the vehicle has been scratched, damaged or destroyed, etc",
              "* In case of a traffic accident, a car-to-car accident",
              "* In case of An accident with a pedestrian",
              "* In case of Collisions - structures, stones, columns, natural landscapes, etc",
              "* If you have any questions about the function of the vehicle, etc",
              "* In case of an emergency, you must contact Jeju Angelcar, and there may be disadvantages if you do not contact them."
            ],
            strongTexts: ["In case of an emergency, you must contact Jeju Angelcar, and there may be disadvantages if you do not contact them."]
          },
          {
            subheading: "Contact information",
            content: [
              "Emergency rescue request (in case of human damage): call 119",
              "Request for police dispatch (in the event of a crime): call 112",
              "*Angelcar contact information",
              "phone : +82 10-9650-1401",
              "WhatsApp : +82 10-9650-1401",
              "Line ID : Angelcar",
              "Consultation is available until 08:00-19:00"
            ],
            strongTexts: ["Angelcar contact information"]
          }
        ]
      }
    }
  },
  zh: {
    meta: {
      title: "濟州天使租車",
      subtitle: "租車資訊",
      partnerTitle: "預約平台：Trip.com, QEEQ, 租租車, Yesaway",
      tabs: {
        info: "公司資訊",
        requirements: "駕駛條件",
        terms: "重要條款",
        shuttle: "接駁車運行",
        pickup: "取車/還車指南",
        emergency: "緊急情況"
      }
    },
    tabContents: {
      info: {
        title: "公司資訊",
        sections: [
          {
            heading: "公司資訊",
            subheading: "歡迎來到濟州天使租車",
            content: [
              "天使租車自2018年以來一直是濟州租車行業的領先公司，",
              "以客戶滿意為最高優先級，旨在為旅客提供舒適愉快的旅行"
            ]
          },
          {
            subheading: "公司名稱",
            content: [
              "濟州天使租車 (品牌：angelcar)",
              "營業登記號：127-86-45776"
            ]
          },
          {
            subheading: "位置",
            content: [
              "濟州特別自治道濟州市道令路171-1",
              "(제주특별자치도 제주시 도령로 171-1)"
            ]
          },
          {
            subheading: "客戶服務",
            content: [
              "電話：064-744-1401",
              "(電話諮詢僅提供韓語服務)",
              "WhatsApp：+82 10-9650-1401",
              "Line ID：Angelcar",
              "Instagram：jejuangelcar_en",
              "諮詢時間：08:00 ~ 19:00"
            ],
            hasLinks: true,
            links: [
              {
                url: "https://wa.me/qr/IGGSYP5OYOGAF1",
                imgSrc: "/angelcar-info-foreigner/img/wa.webp",
                alt: "wa"
              },
              {
                url: "https://page.line.me/663uivqc",
                imgSrc: "/angelcar-info-foreigner/img/line.png",
                alt: "line"
              },
              {
                url: "https://www.instagram.com/jejuangelcar_en/",
                imgSrc: "/angelcar-info-foreigner/img/instagram.webp",
                alt: "instagram"
              }
            ]
          }
        ]
      },
      requirements: {
        title: "駕駛條件",
        sections: [
          {
            heading: "駕駛條件",
            subheading: "有效駕駛執照及要求",
            content: [
              "駕照：僅限國際駕照(IDP) B、C、D級",
              "或韓國駕照（取得一年後）",
              "*沒有國際駕照無法租車。",
              "*紙質國際駕照/數位國際駕照不可使用。",
              "*需要有效的國際駕照，不可進行非面對面登記。",
              "年齡：26歲至70歲",
              "駕駛經驗兩年以上（取得駕照後）"
            ],
            strongTexts: [
              "駕照：僅限國際駕照(IDP) B、C、D級",
              "或韓國駕照（取得一年後）",
              "年齡：26歲至70歲",
              "駕駛經驗兩年以上（取得駕照後）"
            ]
          },
          {
            subheading: "必要文件",
            content: [
              "需要護照",
              "現場需要信用卡付款同意書。",
              "*請攜帶可在韓國使用的信用卡"
            ],
            strongTexts: ["需要護照"]
          },
          {
            subheading: "其他",
            content: ["最多可登記2名駕駛員。（無額外費用）"]
          },
          {
            content: [],
            hasImages: true,
            images: [
              {
                src: "/angelcar-info-foreigner/img/IDP.jpg",
                alt: "IDP",
                link: "https://internationaldrivingpermit.org/"
              }
            ]
          }
        ]
      },
      terms: {
        title: "重要條款",
        sections: [
          {
            heading: "主要條款和條件",
            subheading: "租車駕駛限制",
            content: [
              "*必須年滿26歲（最高70歲）",
              "*必須有兩年以上駕駛經驗",
              "（取得駕照後）",
              "*只有合約中登記的駕駛員才能駕駛。",
              "（未登記的駕駛員駕駛或違反合約條款，保險不承保。",
              "登記駕駛員不可變更，不允許非面對面登記。）"
            ],
            strongTexts: [
              "年滿26歲（最高70歲）",
              "有兩年以上駕駛經驗",
              "只有合約中登記的駕駛員才能駕駛。"
            ]
          },
          {
            subheading: "燃料",
            content: [
              "汽車必須以與取車時相同的燃料量歸還。"
            ],
            strongTexts: ["與取車時相同的燃料量"]
          },
          {
            subheading: "吸煙、異味和損壞",
            content: [
              "吸煙將收取₩250,000費用，寵物異味、",
              "嘔吐物、釣魚用具/魚餌異味，或任何座椅污染/損壞。"
            ],
            strongTexts: ["吸煙將收取₩250,000費用"]
          },
          {
            subheading: "取車和還車地點",
            content: [
              "租車必須歸還到指定地點。",
              "將車輛歸還到不同地點將產生額外",
              "費用和法律責任"
            ],
            strongTexts: ["租車必須歸還到指定地點"]
          },
          {
            subheading: "租期延長",
            content: [
              "租期延長必須事先與公司確認。",
              "如果無法延長，租車必須",
              "按時歸還。"
            ],
            strongTexts: ["租期延長必須事先與公司確認"]
          }
        ]
      },
      shuttle: {
        title: "接駁車運行",
        sections: [
          {
            heading: "接駁車運行和登車",
            subheading: "接駁巴士登車區域（機場停車場內）",
            content: [
              "租車接駁巴士停車 5區域 14號",
              "*濟州機場 ↔ 天使租車接駁車程約5-10分鐘。"
            ],
            strongTexts: ["5區域 14號", "*濟州機場 ↔ 天使租車接駁車程約5-10分鐘"]
          },
          {
            subheading: "接駁車運行時間",
            content: [
              "*從天使租車出發",
              "每20分鐘一班 從上午07:20 (-20:00)",
              "*從機場出發",
              "每20分鐘一班 從上午07:40 (-20:00)",
              "*30分鐘間隔 : 12-13:00 和 17-18:00 / 20:00後",
              "*如果您在21:00後到達濟州機場，我們的工作人員將用小型貨車接您 (-22:00)"
            ],
            strongTexts: [
              "每20分鐘一班",
              "每20分鐘一班",
              "30分鐘間隔"
            ]
          },
          {
            subheading: "接駁車登車資訊",
            content: [],
            hasSteps: true,
            steps: [
              {
                stepNumber: 1,
                description: "從濟州國際機場5號門出口",
                imageSrc: "/angelcar-info-foreigner/img/STEP01.jpg"
              },
              {
                stepNumber: 2,
                description: "過人行橫道",
                imageSrc: "/angelcar-info-foreigner/img/STEP02.jpg"
              },
              {
                stepNumber: 3,
                description: "前往「租車接駁車」區域 – 5區域，14號",
                imageSrc: "/angelcar-info-foreigner/img/STEP03.jpg"
              },
              {
                stepNumber: 4,
                description: "站點在接駁車等候站前面。",
                imageSrc: "/angelcar-info-foreigner/img/STEP04.jpg"
              },
              {
                stepNumber: 5,
                description: "在5區域14號等候天使租車接駁車。",
                imageSrc: "/angelcar-info-foreigner/img/STEP05.jpg"
              },
              {
                stepNumber: 6,
                description: "登上天使租車接駁車，每20-30分鐘一班。",
                imageSrc: "/angelcar-info-foreigner/img/STEP06.jpg"
              },
              {
                stepNumber: 7,
                description: "到達天使租車總部（約5-10分鐘車程）。",
                imageSrc: "/angelcar-info-foreigner/img/STEP07.jpg"
              }
            ]
          }
        ]
      },
      pickup: {
        title: "取車/還車指南",
        sections: [
          {
            heading: "取車/還車指南",
            subheading: "取車和還車地點",
            content: [
              "可在天使租車取車和還車",
              "*地點",
              "濟州特別自治道濟州市道令路171-1",
              "(제주특별자치도 제주시 도령로 171-1)",
              "*從機場搭乘接駁車到達天使租車"
            ],
            strongTexts: ["可在天使租車取車和還車"]
          },
          {
            subheading: "取車",
            content: [
              "1. 租車合約",
              "到達天使租車後，請到1樓",
              "服務台辦理租車合約（使用",
              "外國人專用服務機）",
              "*需要：護照和國際駕照(IDP)，",
              "信用卡",
              "",
              "2. 檢查租車並取車",
              "前往租車收據上標示的停車位置",
              "並檢查車輛。",
              "*停車位置：A01 - D20",
              "*需要檢查租車外觀和燃料量"
            ],
            strongTexts: [
              "1. 租車合約",
              "2. 檢查租車並取車"
            ]
          },
          {
            subheading: "還車",
            content: [
              "1. 還車地點",
              "只能在天使租車還車，不能在外面/機場還車。",
              "",
              "2. 燃料",
              "租車必須以取車時的燃料量歸還，如果不足必須付費。",
              "",
              "3. 租期延長",
              "租期延長必須事先與公司確認。 如果無法延長，租車必須按時歸還。"
            ],
            strongTexts: [
              "1. 還車地點",
              "只能在天使租車還車",
              "2. 燃料",
              "如果不足必須付費",
              "3. 租期延長",
              "租期延長必須事先與公司確認。"
            ]
          }
        ]
      },
      emergency: {
        title: "緊急情況",
        sections: [
          {
            heading: "緊急情況",
            subheading: "緊急情況發生時",
            content: [
              "* 如果車輛出現警告燈或異常",
              "* 如果車輛被刮傷、損壞或毀壞等",
              "* 發生交通事故、車輛間事故",
              "* 與行人發生事故",
              "* 與建築物、石頭、柱子、自然景觀等碰撞",
              "* 如果對車輛功能有任何疑問等",
              "* 緊急情況下必須聯繫濟州天使租車，如果不聯繫可能會有不利影響。"
            ],
            strongTexts: ["緊急情況下必須聯繫濟州天使租車，如果不聯繫可能會有不利影響。"]
          },
          {
            subheading: "聯繫資訊",
            content: [
              "緊急救援請求（人員傷亡情況）：撥打 119",
              "警察出動請求（犯罪事件）：撥打 112",
              "*天使租車聯繫資訊",
              "電話：+82 10-9650-1401",
              "WhatsApp：+82 10-9650-1401",
              "Line ID：Angelcar",
              "諮詢時間：08:00-19:00"
            ],
            strongTexts: ["天使租車聯繫資訊"]
          }
        ]
      }
    }
  }
};