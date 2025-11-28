import React from 'react';
import { Template, GeneratedDocData } from '../types';

interface DocumentPreviewProps {
  template: Template;
  data: GeneratedDocData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ template, data }) => {
  
  // Helper to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "    年  月  日";
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const isAnswer = template.type === 'answer';
  const docTitle = isAnswer ? '民事答辩状' : '民事起诉状';
  const subTitle = `(${template.category}纠纷)`;

  // --- Render Party Info Table Section ---
  const renderPartySection = () => (
    <>
      {/* Header Row */}
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">
          当事人信息
        </td>
      </tr>

      {/* Plaintiff / Appellant / Respondent (Data context depends on document type) */}
      <tr>
        <td className="border border-black p-4 w-32 align-middle text-center font-bold">
          {isAnswer ? '答辩人' : '原告'}<br/>
          <span className="font-normal text-sm">({data.plaintiffType})</span>
        </td>
        <td className="border border-black p-4 align-top leading-loose">
          <div className="space-y-1">
            <p>
              <span className="font-bold">名称/姓名：</span>
              {data.plaintiffName || '__________________'}
            </p>
            {data.plaintiffType === '自然人' && (
              <p>
                <span className="font-bold">性别：</span>{data.plaintiffGender || '____'}
                <span className="mx-4"></span>
                <span className="font-bold">出生日期：</span>{formatDate(data.plaintiffDob)}
                <span className="mx-4"></span>
                <span className="font-bold">民族：</span>{data.plaintiffNation || '____'}
              </p>
            )}
            <p>
              <span className="font-bold">工作单位/职务：</span>{data.plaintiffWork || '__________________'}
            </p>
            <p>
              <span className="font-bold">联系电话：</span>{data.plaintiffPhone || '__________________'}
            </p>
            <p>
              <span className="font-bold">住所地/注册地：</span>{data.plaintiffAddress || '____________________________________'}
            </p>
            <p>
              <span className="font-bold">证件号码/统一社会信用代码：</span>{data.plaintiffId || '__________________'}
            </p>
          </div>
        </td>
      </tr>

      {/* Defendant / Appellee */}
      <tr>
        <td className="border border-black p-4 w-32 align-middle text-center font-bold">
          {isAnswer ? '被答辩人' : '被告'}<br/>
          <span className="font-normal text-sm">({data.defendantType})</span>
        </td>
        <td className="border border-black p-4 align-top leading-loose">
          <div className="space-y-1">
            <p>
              <span className="font-bold">名称/姓名：</span>
              {data.defendantName || '__________________'}
            </p>
            {data.defendantType === '自然人' && (
              <p>
                <span className="font-bold">性别：</span>{data.defendantGender || '____'}
                <span className="mx-4"></span>
                <span className="font-bold">出生日期：</span>{formatDate(data.defendantDob)}
              </p>
            )}
            <p>
              <span className="font-bold">法定代表人：</span>{data.defendantRep || '_______'}
            </p>
            <p>
              <span className="font-bold">联系电话：</span>{data.defendantPhone || '__________________'}
            </p>
            <p>
              <span className="font-bold">住所地/注册地：</span>{data.defendantAddress || '____________________________________'}
            </p>
          </div>
        </td>
      </tr>

      {/* Agent */}
      {data.hasAgent === '有' && (
        <tr>
          <td className="border border-black p-4 w-32 align-middle text-center font-bold">
            委托诉讼<br/>代理人
          </td>
          <td className="border border-black p-4 align-top leading-loose">
            <p>
              <span className="font-bold">姓名：</span>{data.agentName || '_______'}
              <span className="mx-8"></span>
              <span className="font-bold">单位/职务：</span>{data.agentOrg || '__________________'}
            </p>
          </td>
        </tr>
      )}
      
      {/* Service Address */}
      <tr>
        <td className="border border-black p-4 w-32 align-middle text-center font-bold text-sm">
          送达地址<br/>(及收件人)
        </td>
        <td className="border border-black p-4 align-top leading-loose">
           <p>{data.plaintiffAddress || '同上'}</p>
           <p>收件人：{data.plaintiffName || '同上'}</p>
           <p>是否接受电子送达：☑ 是 □ 否</p>
        </td>
      </tr>
    </>
  );

  // --- Render Complaint Specific Sections ---
  const renderComplaintBody = () => (
    <>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">
          诉讼请求和依据
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-6 align-top min-h-[150px]">
          <div className="leading-loose space-y-2">
            {template.fields.filter(f => f.section === '诉讼请求/答辩事项').map((f, idx) => (
               <p key={f.key}>
                 <strong>{idx + 1}. {f.label}：</strong> {data[f.key] ? data[f.key] : '__________________'}
               </p>
            ))}
            <p><strong>其他请求：</strong> 本案诉讼费用由被告承担。</p>
          </div>
        </td>
      </tr>

      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">
          事实和理由
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-6 align-top min-h-[300px]">
          <div className="leading-loose text-justify indent-8 whitespace-pre-wrap">
            {data.facts || data.divorceReason || data.reason || '（此处请填写具体事实与理由，包括纠纷发生的时间、地点、经过、违约情况或侵权后果等。）'}
          </div>
        </td>
      </tr>
    </>
  );

  // --- Render Answer Specific Sections ---
  const renderAnswerBody = () => (
    <>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">
          答辩事项和依据
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-0">
           {/* Simulate the checkbox confirmation list from PDF */}
           <table className="w-full border-collapse">
             <tbody>
                {[
                  '对原告诉讼请求金额有无异议',
                  '对违约金/赔偿金计算有无异议',
                  '对事实经过描述有无异议',
                  '对证据真实性有无异议'
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className="border-b border-black p-3 w-1/3 border-r">{idx+1}. {item}</td>
                    <td className="border-b border-black p-3">
                      <span className="mr-4">□ 无</span>
                      <span className="mr-4">□ 有 (事实和理由: _________________)</span>
                    </td>
                  </tr>
                ))}
             </tbody>
           </table>
        </td>
      </tr>

      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">
          事实和理由 (详细答辩)
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-6 align-top min-h-[300px]">
          <div className="leading-loose text-justify indent-8 whitespace-pre-wrap">
            {data.facts || '（此处请填写具体答辩意见，反驳原告诉请的事实与法律依据。）'}
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="legal-document-container bg-white shadow-lg mx-auto p-[15mm] w-[210mm] min-h-[297mm] text-gray-900 leading-relaxed print:shadow-none">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-2 font-serif tracking-widest">{docTitle}</h1>
      <h2 className="text-xl font-bold text-center mb-6 font-serif">{subTitle}</h2>

      {/* Instructions Box (Similar to PDF) */}
      <div className="border border-black p-2 text-xs mb-4 text-gray-600">
        <strong>说明：</strong>
        <ol className="list-decimal list-inside px-2">
          <li>本表所列内容是您提起诉讼/答辩以及人民法院查明案件事实所需，请务必如实填写。</li>
          <li>带 * 号内容为必填项。民事诉讼应当遵循诚信原则。</li>
        </ol>
      </div>

      {/* Main Form Table */}
      <table className="w-full border-collapse border border-black text-sm">
        <tbody>
          {renderPartySection()}
          
          {/* Dynamic Body based on type */}
          {isAnswer ? renderAnswerBody() : renderComplaintBody()}
        </tbody>
      </table>

      {/* Footer Signatures */}
      <div className="mt-12 flex flex-col items-end space-y-4 pr-10">
        <p className="w-64 font-serif text-lg">此致</p>
        <p className="w-64 font-bold font-serif text-lg border-b border-black pb-1">{data.courtName || '__________人民法院'}</p>
        <br />
        <div className="w-80 mt-8">
          <p className="text-lg font-serif">具状人/答辩人（签字、盖章）：</p>
          <div className="h-12 border-b border-black mb-2"></div>
          <p className="text-right text-lg font-serif">{formatDate(data.submitDate)}</p>
        </div>
      </div>

    </div>
  );
};

export default DocumentPreview;