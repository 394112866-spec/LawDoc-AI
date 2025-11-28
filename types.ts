export enum DocumentType {
  // 起诉状 (Complaints)
  COMPLAINT_PRIVATE_LENDING = 'COMPLAINT_PRIVATE_LENDING', // 民间借贷
  COMPLAINT_DIVORCE = 'COMPLAINT_DIVORCE', // 离婚
  COMPLAINT_SALES_CONTRACT = 'COMPLAINT_SALES_CONTRACT', // 买卖合同
  COMPLAINT_FINANCIAL_LOAN = 'COMPLAINT_FINANCIAL_LOAN', // 金融借款
  COMPLAINT_PROPERTY_SERVICE = 'COMPLAINT_PROPERTY_SERVICE', // 物业服务
  COMPLAINT_CREDIT_CARD = 'COMPLAINT_CREDIT_CARD', // 信用卡
  COMPLAINT_TRAFFIC_ACCIDENT = 'COMPLAINT_TRAFFIC_ACCIDENT', // 交通事故
  COMPLAINT_LABOR_DISPUTE = 'COMPLAINT_LABOR_DISPUTE', // 劳动争议
  COMPLAINT_FINANCIAL_LEASING = 'COMPLAINT_FINANCIAL_LEASING', // 融资租赁
  COMPLAINT_SECURITIES_MISREP = 'COMPLAINT_SECURITIES_MISREP', // 证券虚假陈述
  COMPLAINT_INSURANCE = 'COMPLAINT_INSURANCE', // 保证保险

  // 答辩状 (Answers)
  ANSWER_PRIVATE_LENDING = 'ANSWER_PRIVATE_LENDING',
  ANSWER_DIVORCE = 'ANSWER_DIVORCE',
  ANSWER_SALES_CONTRACT = 'ANSWER_SALES_CONTRACT',
  ANSWER_FINANCIAL_LOAN = 'ANSWER_FINANCIAL_LOAN',
  ANSWER_PROPERTY_SERVICE = 'ANSWER_PROPERTY_SERVICE',
  ANSWER_CREDIT_CARD = 'ANSWER_CREDIT_CARD',
  ANSWER_TRAFFIC_ACCIDENT = 'ANSWER_TRAFFIC_ACCIDENT',
  ANSWER_LABOR_DISPUTE = 'ANSWER_LABOR_DISPUTE',
  ANSWER_FINANCIAL_LEASING = 'ANSWER_FINANCIAL_LEASING',
  ANSWER_SECURITIES_MISREP = 'ANSWER_SECURITIES_MISREP',
  ANSWER_INSURANCE = 'ANSWER_INSURANCE',

  // 申请书 (Applications)
  APPLICATION_INVESTIGATION = 'APPLICATION_INVESTIGATION', // 调查令申请书
}

export type FieldType = 'text' | 'date' | 'number' | 'textarea' | 'radio' | 'currency' | 'checkbox';

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[]; // For radio
  section: string; // Grouping
  placeholder?: string;
  width?: 'full' | 'half' | 'third';
  defaultValue?: any;
}

export interface Template {
  id: string; 
  name: string;
  category: string; // Sub-category like "Marriage", "Contract"
  group: '民事' | '行政' | '刑事' | '执行' | '国家赔偿'; // Top level category
  type: 'complaint' | 'answer' | 'application'; 
  icon: string; // Icon name for UI mapping
  fields: FormField[];
  defaultContent: Record<string, any>;
}

export interface GeneratedDocData {
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ContractAnalysisResult {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  risks: Array<{
    clause: string;
    issue: string;
    suggestion: string;
  }>;
  missingClauses: string[];
}