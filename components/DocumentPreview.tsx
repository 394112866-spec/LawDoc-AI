import React from 'react';
import { Template, GeneratedDocData } from '../types';

interface DocumentPreviewProps {
  template: Template;
  data: GeneratedDocData;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ template, data }) => {
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "    年  月  日";
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  // 1. Investigation Order Application Specific Render
  if (template.type === 'application') {
    return (
      <div className="flex flex-col gap-8 print:block">
        {/* Page 1: Application */}
        <div className="legal-document-container bg-white shadow-lg mx-auto p-[20mm] w-[210mm] min-h-[297mm] text-gray-900 leading-loose text-lg font-serif print:shadow-none print:break-after-page">
          <h1 className="text-3xl font-bold text-center mb-10 tracking-widest">调查令申请书</h1>
          
          <div className="space-y-4 mb-8">
            <p><strong>当事人：</strong>{data.clientName}，{data.clientGender}，{formatDate(data.clientDob)}出生，住{data.clientAddress}，身份证：{data.clientId}。</p>
            
            <div className="flex gap-8">
              <div><strong>申请人：姓名：</strong>{data.lawyer1Name}</div>
              <div><strong>职务：</strong>律师</div>
            </div>
            <p className="indent-16">工作单位：{data.lawyer1Org}，联系电话：{data.lawyer1Phone}</p>
            <p className="indent-16">律师执业证号码：{data.lawyer1License}</p>

            {data.lawyer2Name && (
              <>
                <div className="flex gap-8 mt-4">
                  <div><strong>姓名：</strong>{data.lawyer2Name}</div>
                  <div><strong>职务：</strong>律师</div>
                </div>
                <p className="indent-16">工作单位：{data.lawyer2Org || data.lawyer1Org}，联系电话：{data.lawyer2Phone}</p>
                <p className="indent-16">律师执业证号码：{data.lawyer2License}</p>
              </>
            )}
          </div>

          <div className="space-y-6">
            <p><strong>接受调查人：</strong>{data.targetCompany}</p>
            <p><strong>被执行人：</strong>{data.executeeName}，身份证号：{data.executeeId}</p>
            
            <p><strong>请求事项：</strong>请求贵院出具调查令，以便申请人持调查令前往{data.targetCompany}查询以下被执行人的{data.investigationRange || '账户信息、交易流水'}。</p>
            {data.startDate && <p>查询期间：自 {formatDate(data.startDate)} 起至 {formatDate(data.endDate)} 止。</p>}

            <p>
              <strong>事实和理由：</strong>{data.caseInfo}，贵院已经执行立案，案号为{data.caseNumber || '（____）___执___号'}。
              因申请人无法获取被执行人名下上述财产线索，为维护当事人的合法权益，特依法申请贵院对以上事项开出调查令，以便申请人能持令前往当地调查取得上述财产线索。
            </p>
          </div>

          <div className="mt-16 flex flex-col items-end space-y-4 pr-4">
            <p className="w-full text-left">此致</p>
            <p className="w-full text-left font-bold text-xl mb-8">{data.courtName || '__________人民法院'}</p>
            
            <div className="w-64 text-center">
              <p>申请人：</p>
              <div className="h-16"></div>
              <p>{formatDate(data.submitDate)}</p>
            </div>
          </div>
        </div>

        {/* Page 2: Commitment Letter */}
        <div className="legal-document-container bg-white shadow-lg mx-auto p-[20mm] w-[210mm] min-h-[297mm] text-gray-900 leading-loose text-lg font-serif print:shadow-none">
          <h1 className="text-3xl font-bold text-center mb-16 tracking-widest">调查令使用承诺书</h1>
          
          <p className="font-bold mb-6">{data.courtName || '__________人民法院'}：</p>
          
          <p className="mb-4 text-justify indent-8">
            作为律师调查令申请人，在使用律师调查令过程中，将遵守相关法律规定，并作出以下承诺：
          </p>

          <div className="space-y-4 px-2 mb-16 text-justify">
            <p>1. 持令调查时，主动出示律师调查令和执业证等证件，交由接受调查人核对。</p>
            <p>2. 在律师调查令的有效期间调查取证，有效期限届满，不得使用律师调查令。</p>
            <p>3. 持令取证后，在调查结束后五个工作日内将调查收集证据、调查令回执交回人民法院。</p>
            <p>4. 因自身原因未使用调查令或接受调查人未提供证据，在调查令载明的有效期限届满后五个工作日内，将调查令和回执退还人民法院。</p>
            <p>5. 对调查获得的证据和信息，仅限于本案审判(执行)工作使用，不对外泄露和擅作他用。</p>
            <p className="mt-8">如违反上述内容，按照《关于在民事审判程序和执行程序中实行律师调查令的若干规定(试行)》第十六条处理。</p>
          </div>

          <div className="flex flex-col items-end space-y-4 pr-4">
            <div className="w-64 text-center">
              <p>申请人：</p>
              <div className="h-16"></div>
              <p>{formatDate(data.submitDate)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... Original Code for Complaints and Answers (Table Layout) ...
  const isAnswer = template.type === 'answer';
  const docTitle = isAnswer ? '民事答辩状' : '民事起诉状';
  const subTitle = `(${template.category}纠纷)`;

  const renderPartySection = () => (
    <>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">
          当事人信息
        </td>
      </tr>
      <tr>
        <td className="border border-black p-4 w-32 align-middle text-center font-bold">
          {isAnswer ? '答辩人' : '原告'}<br/>
          <span className="font-normal text-sm">({data.plaintiffType})</span>
        </td>
        <td className="border border-black p-4 align-top leading-loose">
          <div className="space-y-1">
            <p><span className="font-bold">名称/姓名：</span>{data.plaintiffName || '__________________'}</p>
            {data.plaintiffType === '自然人' && (
              <p>
                <span className="font-bold">性别：</span>{data.plaintiffGender || '____'}
                <span className="mx-4"></span>
                <span className="font-bold">出生日期：</span>{formatDate(data.plaintiffDob)}
                <span className="mx-4"></span>
                <span className="font-bold">民族：</span>{data.plaintiffNation || '____'}
              </p>
            )}
            <p><span className="font-bold">工作单位/职务：</span>{data.plaintiffWork || '__________________'}</p>
            <p><span className="font-bold">联系电话：</span>{data.plaintiffPhone || '__________________'}</p>
            <p><span className="font-bold">住所地/注册地：</span>{data.plaintiffAddress || '____________________________________'}</p>
            <p><span className="font-bold">证件号码/统一社会信用代码：</span>{data.plaintiffId || '__________________'}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td className="border border-black p-4 w-32 align-middle text-center font-bold">
          {isAnswer ? '被答辩人' : '被告'}<br/>
          <span className="font-normal text-sm">({data.defendantType})</span>
        </td>
        <td className="border border-black p-4 align-top leading-loose">
          <div className="space-y-1">
            <p><span className="font-bold">名称/姓名：</span>{data.defendantName || '__________________'}</p>
            <p><span className="font-bold">法定代表人：</span>{data.defendantRep || '_______'}
               <span className="mx-4"></span>
               <span className="font-bold">联系电话：</span>{data.defendantPhone || '__________________'}
            </p>
            <p><span className="font-bold">住所地/注册地：</span>{data.defendantAddress || '____________________________________'}</p>
          </div>
        </td>
      </tr>
      {data.hasAgent === '有' && (
        <tr>
          <td className="border border-black p-4 w-32 align-middle text-center font-bold">委托诉讼<br/>代理人</td>
          <td className="border border-black p-4 align-top leading-loose">
            <p><span className="font-bold">姓名：</span>{data.agentName || '_______'} <span className="mx-8"></span> <span className="font-bold">单位/职务：</span>{data.agentOrg || '__________________'}</p>
          </td>
        </tr>
      )}
      <tr>
        <td className="border border-black p-4 w-32 align-middle text-center font-bold text-sm">送达地址<br/>(及收件人)</td>
        <td className="border border-black p-4 align-top leading-loose">
           <p>{data.plaintiffAddress || '同上'}</p>
           <p>收件人：{data.plaintiffName || '同上'} &nbsp;&nbsp;&nbsp; 电话：{data.plaintiffPhone}</p>
           <p>是否接受电子送达：☑ 是 □ 否</p>
        </td>
      </tr>
    </>
  );

  const renderComplaintBody = () => (
    <>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">诉讼请求和依据</td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-6 align-top min-h-[150px]">
          <div className="leading-loose space-y-2">
            {template.fields.filter(f => f.section === '诉讼请求/答辩事项').map((f, idx) => (
               <p key={f.key}><strong>{idx + 1}. {f.label}：</strong> {data[f.key] ? data[f.key] : '__________________'}</p>
            ))}
            {data.claims && <p><strong>请求事项：</strong>{data.claims}</p>}
            <p><strong>其他请求：</strong> 本案诉讼费用由被告承担。</p>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">事实和理由</td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-6 align-top min-h-[300px]">
          <div className="leading-loose text-justify indent-8 whitespace-pre-wrap">
            {data.facts || data.divorceReason || data.reason || '（此处请填写具体事实与理由...）'}
          </div>
        </td>
      </tr>
    </>
  );

  const renderAnswerBody = () => (
    <>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">答辩事项和依据</td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-0">
           <table className="w-full border-collapse">
             <tbody>
                {['对原告诉讼请求金额有无异议', '对违约金/赔偿金计算有无异议', '对事实经过描述有无异议', '对证据真实性有无异议'].map((item, idx) => (
                  <tr key={idx}>
                    <td className="border-b border-black p-3 w-1/3 border-r">{idx+1}. {item}</td>
                    <td className="border-b border-black p-3"><span className="mr-4">□ 无</span><span className="mr-4">□ 有 (事实和理由: _________________)</span></td>
                  </tr>
                ))}
             </tbody>
           </table>
        </td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-3 text-center text-xl font-bold bg-gray-50">事实和理由</td>
      </tr>
      <tr>
        <td colSpan={2} className="border border-black p-6 align-top min-h-[300px]">
          <div className="leading-loose text-justify indent-8 whitespace-pre-wrap">{data.facts || '（此处请填写具体答辩意见...）'}</div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="legal-document-container bg-white shadow-lg mx-auto p-[15mm] w-[210mm] min-h-[297mm] text-gray-900 leading-relaxed print:shadow-none">
      <h1 className="text-4xl font-bold text-center mb-2 font-serif tracking-widest">{docTitle}</h1>
      <h2 className="text-xl font-bold text-center mb-6 font-serif">{subTitle}</h2>
      <div className="border border-black p-2 text-xs mb-4 text-gray-600">
        <strong>说明：</strong>
        <ol className="list-decimal list-inside px-2">
          <li>本表所列内容是您提起诉讼/答辩以及人民法院查明案件事实所需，请务必如实填写。</li>
          <li>带 * 号内容为必填项。民事诉讼应当遵循诚信原则。</li>
        </ol>
      </div>
      <table className="w-full border-collapse border border-black text-sm">
        <tbody>
          {renderPartySection()}
          {isAnswer ? renderAnswerBody() : renderComplaintBody()}
        </tbody>
      </table>
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