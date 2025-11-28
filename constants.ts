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

const createTemplate = (id: DocumentType, name: string, category: string, type: 'complaint' | 'answer', specificFields: FormField[]): Template => {
  const baseFields = type === 'complaint' ? partyInfoFields : [
    // Answer fields differ slightly (Respondent vs Appellant context), but we simplify for this demo
    ...partyInfoFields.map(f => ({...f, section: '当事人信息 (答辩人/被答辩人)'}))
  ];
  
  return {
    id,
    name,
    category,
    type,
    fields: [...baseFields, ...specificFields, ...footerFields],
    defaultContent: {
      plaintiffType: '自然人',
      defendantType: '自然人',
      hasAgent: '无',
      courtName: 'xx市xx区人民法院'
    }
  };
};

// 1. 民间借贷
const lendingFields: FormField[] = [
  { key: 'claimPrincipal', label: '尚欠本金 (元)', type: 'currency', section: '诉讼请求/答辩事项', width: 'half' },
  { key: 'claimInterest', label: '尚欠利息 (元)', type: 'currency', section: '诉讼请求/答辩事项', width: 'half' },
  { key: 'rate', label: '利率标准', type: 'text', section: '诉讼请求/答辩事项', width: 'full', placeholder: '例如：年利率3.85%' },
  { key: 'loanDate', label: '借款日期', type: 'date', section: '事实与理由', width: 'half' },
  { key: 'repaymentDate', label: '约定还款日', type: 'date', section: '事实与理由', width: 'half' },
  { key: 'facts', label: '事实与理由/答辩理由', type: 'textarea', section: '事实与理由', width: 'full', placeholder: '请详细描述借贷经过...' },
];

// 2. 离婚纠纷
const divorceFields: FormField[] = [
  { key: 'marriageDate', label: '登记结婚日期', type: 'date', section: '婚姻基础', width: 'half' },
  { key: 'children', label: '子女情况', type: 'text', section: '婚姻基础', width: 'full', placeholder: '例如：一子一女，姓名...' },
  { key: 'custody', label: '抚养权主张', type: 'textarea', section: '诉讼请求/答辩事项', width: 'full' },
  { key: 'property', label: '财产分割主张', type: 'textarea', section: '诉讼请求/答辩事项', width: 'full' },
  { key: 'reason', label: '离婚理由/夫妻感情状况', type: 'textarea', section: '事实与理由', width: 'full' },
];

// 3. 买卖合同
const salesFields: FormField[] = [
  { key: 'contractName', label: '合同名称', type: 'text', section: '合同概况', width: 'full' },
  { key: 'debtAmount', label: '欠付货款 (元)', type: 'currency', section: '诉讼请求/答辩事项', width: 'half' },
  { key: 'breachPenalty', label: '违约金 (元)', type: 'currency', section: '诉讼请求/答辩事项', width: 'half' },
  { key: 'deliveryDate', label: '交货/履行时间', type: 'date', section: '事实与理由', width: 'half' },
  { key: 'facts', label: '违约事实描述', type: 'textarea', section: '事实与理由', width: 'full' },
];

// 4. 交通事故
const trafficFields: FormField[] = [
  { key: 'accidentDate', label: '事故发生日期', type: 'date', section: '事故概况', width: 'half' },
  { key: 'location', label: '事故地点', type: 'text', section: '事故概况', width: 'half' },
  { key: 'responsibility', label: '责任认定', type: 'text', section: '事故概况', width: 'full', placeholder: '例如：被告全责' },
  { key: 'medicalFee', label: '医疗费 (元)', type: 'currency', section: '赔偿项目', width: 'third' },
  { key: 'disabilityFee', label: '残疾赔偿金 (元)', type: 'currency', section: '赔偿项目', width: 'third' },
  { key: 'lostWages', label: '误工费 (元)', type: 'currency', section: '赔偿项目', width: 'third' },
  { key: 'facts', label: '事故经过及治疗情况', type: 'textarea', section: '事实与理由', width: 'full' },
];

// 5. 劳动争议
const laborFields: FormField[] = [
  { key: 'joinDate', label: '入职日期', type: 'date', section: '劳动关系', width: 'half' },
  { key: 'position', label: '岗位', type: 'text', section: '劳动关系', width: 'half' },
  { key: 'salary', label: '月工资标准', type: 'currency', section: '劳动关系', width: 'half' },
  { key: 'claims', label: '仲裁/诉讼请求', type: 'textarea', section: '诉讼请求/答辩事项', width: 'full', placeholder: '1. 支付工资... 2. 支付赔偿金...' },
  { key: 'facts', label: '事实经过', type: 'textarea', section: '事实与理由', width: 'full' },
];

export const TEMPLATES: Template[] = [
  createTemplate(DocumentType.COMPLAINT_PRIVATE_LENDING, '民事起诉状 (民间借贷)', '合同纠纷', 'complaint', lendingFields),
  createTemplate(DocumentType.ANSWER_PRIVATE_LENDING, '民事答辩状 (民间借贷)', '合同纠纷', 'answer', lendingFields),
  
  createTemplate(DocumentType.COMPLAINT_DIVORCE, '民事起诉状 (离婚纠纷)', '婚姻家庭', 'complaint', divorceFields),
  createTemplate(DocumentType.ANSWER_DIVORCE, '民事答辩状 (离婚纠纷)', '婚姻家庭', 'answer', divorceFields),
  
  createTemplate(DocumentType.COMPLAINT_SALES_CONTRACT, '民事起诉状 (买卖合同)', '合同纠纷', 'complaint', salesFields),
  createTemplate(DocumentType.ANSWER_SALES_CONTRACT, '民事答辩状 (买卖合同)', '合同纠纷', 'answer', salesFields),
  
  createTemplate(DocumentType.COMPLAINT_TRAFFIC_ACCIDENT, '民事起诉状 (交通事故)', '侵权责任', 'complaint', trafficFields),
  createTemplate(DocumentType.ANSWER_TRAFFIC_ACCIDENT, '民事答辩状 (交通事故)', '侵权责任', 'answer', trafficFields),
  
  createTemplate(DocumentType.COMPLAINT_LABOR_DISPUTE, '民事起诉状 (劳动争议)', '劳动争议', 'complaint', laborFields),
  createTemplate(DocumentType.ANSWER_LABOR_DISPUTE, '民事答辩状 (劳动争议)', '劳动争议', 'answer', laborFields),
  
  // Placeholder for others to show breadth
  createTemplate(DocumentType.COMPLAINT_FINANCIAL_LOAN, '民事起诉状 (金融借款)', '金融借贷', 'complaint', lendingFields),
  createTemplate(DocumentType.ANSWER_FINANCIAL_LOAN, '民事答辩状 (金融借款)', '金融借贷', 'answer', lendingFields),
  
  createTemplate(DocumentType.COMPLAINT_PROPERTY_SERVICE, '民事起诉状 (物业合同)', '合同纠纷', 'complaint', salesFields),
  createTemplate(DocumentType.ANSWER_PROPERTY_SERVICE, '民事答辩状 (物业合同)', '合同纠纷', 'answer', salesFields),
  
  createTemplate(DocumentType.COMPLAINT_CREDIT_CARD, '民事起诉状 (信用卡)', '金融借贷', 'complaint', lendingFields),
  createTemplate(DocumentType.ANSWER_CREDIT_CARD, '民事答辩状 (信用卡)', '金融借贷', 'answer', lendingFields),
  
  createTemplate(DocumentType.COMPLAINT_FINANCIAL_LEASING, '民事起诉状 (融资租赁)', '合同纠纷', 'complaint', salesFields),
  createTemplate(DocumentType.ANSWER_FINANCIAL_LEASING, '民事答辩状 (融资租赁)', '合同纠纷', 'answer', salesFields),
  
  createTemplate(DocumentType.COMPLAINT_SECURITIES_MISREP, '民事起诉状 (证券虚假陈述)', '证券纠纷', 'complaint', [
    { key: 'lossAmount', label: '投资损失 (元)', type: 'currency', section: '诉讼请求/答辩事项', width: 'half' },
    { key: 'misrepDate', label: '虚假陈述实施日', type: 'date', section: '事实与理由', width: 'half' },
    { key: 'facts', label: '虚假陈述事实', type: 'textarea', section: '事实与理由', width: 'full' }
  ]),
  createTemplate(DocumentType.ANSWER_SECURITIES_MISREP, '民事答辩状 (证券虚假陈述)', '证券纠纷', 'answer', [
    { key: 'lossAmount', label: '投资损失 (元)', type: 'currency', section: '诉讼请求/答辩事项', width: 'half' },
    { key: 'facts', label: '答辩事实与理由', type: 'textarea', section: '事实与理由', width: 'full' }
  ]),
];