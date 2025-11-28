import { DocumentType, Template, FormField } from "./types";

// --- Common Fields ---
const partyInfoFields: FormField[] = [
  { key: 'plaintiffType', label: '原告/上诉人类型', type: 'radio', options: ['自然人', '法人/非法人组织'], section: '当事人信息', width: 'full', defaultValue: '自然人' },
  { key: 'plaintiffName', label: '原告姓名/名称', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'plaintiffGender', label: '性别 (自然人)', type: 'radio', options: ['男', '女'], section: '当事人信息', width: 'half' },
  { key: 'plaintiffDob', label: '出生日期', type: 'date', section: '当事人信息', width: 'half' },
  { key: 'plaintiffNation', label: '民族', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'plaintiffWork', label: '工作单位/职务', type: 'text', section: '当事人信息', width: 'full' },
  { key: 'plaintiffAddress', label: '住所地/注册地', type: 'text', section: '当事人信息', width: 'full' },
  { key: 'plaintiffPhone', label: '联系电话', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'plaintiffId', label: '证件/代码', type: 'text', section: '当事人信息', width: 'half' },
  
  { key: 'defendantType', label: '被告/被上诉人类型', type: 'radio', options: ['自然人', '法人/非法人组织'], section: '当事人信息', width: 'full', defaultValue: '自然人' },
  { key: 'defendantName', label: '被告姓名/名称', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'defendantGender', label: '性别 (自然人)', type: 'radio', options: ['男', '女'], section: '当事人信息', width: 'half' },
  { key: 'defendantDob', label: '出生日期', type: 'date', section: '当事人信息', width: 'half' },
  { key: 'defendantAddress', label: '住所地/注册地', type: 'text', section: '当事人信息', width: 'full' },
  { key: 'defendantPhone', label: '联系电话', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'defendantRep', label: '法定代表人 (组织)', type: 'text', section: '当事人信息', width: 'half' },
  
  { key: 'hasAgent', label: '是否有代理人', type: 'radio', options: ['无', '有'], section: '代理人信息', width: 'full', defaultValue: '无' },
  { key: 'agentName', label: '代理人姓名', type: 'text', section: '代理人信息', width: 'half' },
  { key: 'agentOrg', label: '代理人单位', type: 'text', section: '代理人信息', width: 'half' },
];

const footerFields: FormField[] = [
  { key: 'courtName', label: '受诉法院', type: 'text', section: '致送法院', width: 'full', placeholder: '例如：xx市xx区人民法院' },
  { key: 'submitDate', label: '提交日期', type: 'date', section: '致送法院', width: 'half' },
];

// --- Specific Configurations ---

const createTemplate = (
  id: DocumentType, 
  name: string, 
  category: string, 
  group: '民事' | '行政' | '刑事' | '执行' | '国家赔偿',
  type: 'complaint' | 'answer' | 'application', 
  icon: string,
  specificFields: FormField[]
): Template => {
  let baseFields = partyInfoFields;
  
  if (type === 'answer') {
    baseFields = partyInfoFields.map(f => ({...f, section: '当事人信息 (答辩人/被答辩人)'}));
  } else if (type === 'application') {
    baseFields = []; 
  }
  
  return {
    id,
    name,
    category,
    group,
    type,
    icon,
    fields: [...baseFields, ...specificFields, ...footerFields],
    defaultContent: {
      plaintiffType: '自然人',
      defendantType: '自然人',
      hasAgent: '无',
      courtName: 'xx市xx区人民法院'
    }
  };
};

// --- Field Definitions ---
const lendingFields: FormField[] = [
  { key: 'claimPrincipal', label: '尚欠本金 (元)', type: 'currency', section: '诉讼请求', width: 'half' },
  { key: 'claimInterest', label: '尚欠利息 (元)', type: 'currency', section: '诉讼请求', width: 'half' },
  { key: 'rate', label: '利率标准', type: 'text', section: '诉讼请求', width: 'full', placeholder: '例如：年利率3.85%' },
  { key: 'loanDate', label: '借款日期', type: 'date', section: '事实与理由', width: 'half' },
  { key: 'repaymentDate', label: '约定还款日', type: 'date', section: '事实与理由', width: 'half' },
  { key: 'facts', label: '事实与理由', type: 'textarea', section: '事实与理由', width: 'full' },
];
const divorceFields: FormField[] = [
  { key: 'marriageDate', label: '登记结婚日期', type: 'date', section: '婚姻基础', width: 'half' },
  { key: 'children', label: '子女情况', type: 'text', section: '婚姻基础', width: 'full', placeholder: '例如：一子一女，姓名...' },
  { key: 'custody', label: '抚养权主张', type: 'textarea', section: '诉讼请求', width: 'full' },
  { key: 'property', label: '财产分割主张', type: 'textarea', section: '诉讼请求', width: 'full' },
  { key: 'reason', label: '离婚理由', type: 'textarea', section: '事实与理由', width: 'full' },
];
const salesFields: FormField[] = [
  { key: 'contractName', label: '合同名称', type: 'text', section: '合同概况', width: 'full' },
  { key: 'debtAmount', label: '欠付货款 (元)', type: 'currency', section: '诉讼请求', width: 'half' },
  { key: 'breachPenalty', label: '违约金 (元)', type: 'currency', section: '诉讼请求', width: 'half' },
  { key: 'deliveryDate', label: '交货/履行时间', type: 'date', section: '事实与理由', width: 'half' },
  { key: 'facts', label: '违约事实', type: 'textarea', section: '事实与理由', width: 'full' },
];
const trafficFields: FormField[] = [
  { key: 'accidentDate', label: '事故发生日期', type: 'date', section: '事故概况', width: 'half' },
  { key: 'location', label: '事故地点', type: 'text', section: '事故概况', width: 'half' },
  { key: 'responsibility', label: '责任认定', type: 'text', section: '事故概况', width: 'full' },
  { key: 'medicalFee', label: '医疗费 (元)', type: 'currency', section: '赔偿项目', width: 'third' },
  { key: 'disabilityFee', label: '残疾赔偿金 (元)', type: 'currency', section: '赔偿项目', width: 'third' },
  { key: 'lostWages', label: '误工费 (元)', type: 'currency', section: '赔偿项目', width: 'third' },
  { key: 'facts', label: '事故经过', type: 'textarea', section: '事实与理由', width: 'full' },
];
const laborFields: FormField[] = [
  { key: 'joinDate', label: '入职日期', type: 'date', section: '劳动关系', width: 'half' },
  { key: 'position', label: '岗位', type: 'text', section: '劳动关系', width: 'half' },
  { key: 'salary', label: '月工资标准', type: 'currency', section: '劳动关系', width: 'half' },
  { key: 'claims', label: '仲裁请求', type: 'textarea', section: '诉讼请求', width: 'full' },
  { key: 'facts', label: '事实经过', type: 'textarea', section: '事实与理由', width: 'full' },
];
const investigationFields: FormField[] = [
  { key: 'clientName', label: '当事人姓名', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'clientGender', label: '性别', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'clientDob', label: '出生日期', type: 'date', section: '当事人信息', width: 'half' },
  { key: 'clientId', label: '身份证号', type: 'text', section: '当事人信息', width: 'half' },
  { key: 'clientAddress', label: '住址', type: 'text', section: '当事人信息', width: 'full' },
  { key: 'lawyer1Name', label: '律师1 姓名', type: 'text', section: '申请人(律师)', width: 'half' },
  { key: 'lawyer1Phone', label: '律师1 电话', type: 'text', section: '申请人(律师)', width: 'half' },
  { key: 'lawyer1Org', label: '律师1 执业机构', type: 'text', section: '申请人(律师)', width: 'full' },
  { key: 'lawyer1License', label: '律师1 执业证号', type: 'text', section: '申请人(律师)', width: 'full' },
  { key: 'targetCompany', label: '接受调查人', type: 'text', section: '调查对象', width: 'full' },
  { key: 'executeeName', label: '被执行人姓名', type: 'text', section: '调查对象', width: 'half' },
  { key: 'executeeId', label: '身份证号', type: 'text', section: '调查对象', width: 'half' },
  { key: 'investigationRange', label: '查询内容', type: 'textarea', section: '请求事项', width: 'full' },
  { key: 'startDate', label: '起始日期', type: 'date', section: '请求事项', width: 'half' },
  { key: 'endDate', label: '截止日期', type: 'date', section: '请求事项', width: 'half' },
  { key: 'caseInfo', label: '关联案件', type: 'textarea', section: '事实和理由', width: 'full' },
  { key: 'caseNumber', label: '案号', type: 'text', section: '事实和理由', width: 'full' },
];

export const TEMPLATES: Template[] = [
  // 民事 - 起诉状
  createTemplate(DocumentType.COMPLAINT_DIVORCE, '离婚纠纷', '婚姻家庭', '民事', 'complaint', 'user', divorceFields),
  createTemplate(DocumentType.COMPLAINT_SALES_CONTRACT, '买卖合同纠纷', '合同纠纷', '民事', 'complaint', 'refresh-ccw', salesFields),
  createTemplate(DocumentType.COMPLAINT_FINANCIAL_LOAN, '金融借款合同纠纷', '金融借贷', '民事', 'complaint', 'landmark', lendingFields),
  createTemplate(DocumentType.COMPLAINT_PRIVATE_LENDING, '民间借贷纠纷', '合同纠纷', '民事', 'complaint', 'banknote', lendingFields),
  createTemplate(DocumentType.COMPLAINT_CREDIT_CARD, '信用卡纠纷', '金融借贷', '民事', 'complaint', 'credit-card', lendingFields),
  createTemplate(DocumentType.COMPLAINT_FINANCIAL_LEASING, '融资租赁合同纠纷', '合同纠纷', '民事', 'complaint', 'refresh-ccw', salesFields),
  createTemplate(DocumentType.COMPLAINT_PROPERTY_SERVICE, '物业服务合同纠纷', '合同纠纷', '民事', 'complaint', 'home', salesFields),
  createTemplate(DocumentType.COMPLAINT_LABOR_DISPUTE, '劳动争议纠纷', '劳动争议', '民事', 'complaint', 'wrench', laborFields),
  createTemplate(DocumentType.COMPLAINT_SECURITIES_MISREP, '证券虚假陈述责任纠纷', '证券纠纷', '民事', 'complaint', 'trending-up', lendingFields),
  createTemplate(DocumentType.COMPLAINT_INSURANCE, '保证保险合同纠纷', '金融保险', '民事', 'complaint', 'shield', salesFields),
  createTemplate(DocumentType.COMPLAINT_TRAFFIC_ACCIDENT, '机动车交通事故责任纠纷', '侵权责任', '民事', 'complaint', 'car', trafficFields),

  // 民事 - 答辩状
  createTemplate(DocumentType.ANSWER_DIVORCE, '离婚纠纷', '婚姻家庭', '民事', 'answer', 'user', divorceFields),
  createTemplate(DocumentType.ANSWER_SALES_CONTRACT, '买卖合同纠纷', '合同纠纷', '民事', 'answer', 'refresh-ccw', salesFields),
  createTemplate(DocumentType.ANSWER_FINANCIAL_LOAN, '金融借款合同纠纷', '金融借贷', '民事', 'answer', 'landmark', lendingFields),
  createTemplate(DocumentType.ANSWER_PRIVATE_LENDING, '民间借贷纠纷', '合同纠纷', '民事', 'answer', 'banknote', lendingFields),
  createTemplate(DocumentType.ANSWER_CREDIT_CARD, '信用卡纠纷', '金融借贷', '民事', 'answer', 'credit-card', lendingFields),
  createTemplate(DocumentType.ANSWER_TRAFFIC_ACCIDENT, '机动车交通事故责任纠纷', '侵权责任', '民事', 'answer', 'car', trafficFields),

  // 执行 - 申请书
  createTemplate(DocumentType.APPLICATION_INVESTIGATION, '调查令申请书', '调查取证', '执行', 'application', 'search', investigationFields),
];